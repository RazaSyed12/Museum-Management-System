import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff } from '../middleware/auth';

// Paths are written in full (/events/:id/allocations and /allocations/:id), so this router has no prefix.
const router = Router();

const ALLOCATION_SELECT = 'allocation_id, event_id, allocation_name, membership_required, quantity, reserved_quantity';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}
function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}
function notFound(res: Response, what: string) {
  return res.status(404).json({ error: { message: `${what} not found.`, code: 'not_found' } });
}
function conflict(res: Response, code: string, message: string) {
  return res.status(409).json({ error: { message, code } });
}

const idSchema = z.guid();
const quantity = z.number().int().max(1000000);

const createSchema = z.object({
  allocation_name: z.string().trim().min(1).max(100),
  quantity: quantity.min(1),
  membership_required: z.boolean().default(false),
});

const updateSchema = z
  .object({
    allocation_name: z.string().trim().min(1).max(100),
    quantity: quantity.min(0),
    membership_required: z.boolean(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to change.' });

function withAvailable(row: any) {
  return { ...row, available: row.quantity - row.reserved_quantity };
}

// Turns a database error on an allocation write into the right reply.
function writeError(res: Response, error: { code?: string; message?: string }, capacity: number | null, fallback: string) {
  if (error.code === '23505') {
    return conflict(res, 'conflict', 'An allocation with that name already exists for this event.');
  }
  if (error.code === '23514') {
    if (error.message?.includes('capacity_exceeded')) {
      return conflict(
        res,
        'capacity_exceeded',
        capacity === null
          ? 'The allocations would add up to more than the event capacity.'
          : `The allocations would add up to more than the event capacity of ${capacity} tickets.`,
      );
    }
    return conflict(res, 'below_reserved', 'The quantity cannot be lower than the tickets already reserved.');
  }
  return serverError(res, fallback);
}

// GET /events/:id/allocations — public for non-draft events (a draft looks "not found" to visitors).
router.get('/events/:id/allocations', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Event');
  const db = await readerClient(req, res);
  if (!db) return;

  const { data: event, error: eventError } = await db.from('events').select('event_id, capacity').eq('event_id', id).maybeSingle();
  if (eventError) return serverError(res, 'Could not load the event.');
  if (!event) return notFound(res, 'Event');

  const { data, error } = await db
    .from('ticket_allocations')
    .select(ALLOCATION_SELECT)
    .eq('event_id', id)
    .order('membership_required', { ascending: true })
    .order('allocation_name', { ascending: true });
  if (error) return serverError(res, 'Could not load the allocations.');

  const allocations = (data ?? []).map(withAvailable);
  const allocated = allocations.reduce((sum, a) => sum + a.quantity, 0);
  return res.json({
    allocations,
    capacity: event.capacity,
    allocated_total: allocated,
    unallocated: event.capacity - allocated,
  });
});

// POST /events/:id/allocations — staff only.
router.post('/events/:id/allocations', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Event');
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const db = userClient(req.auth!.token);

  const { data: event, error: eventError } = await db.from('events').select('event_id, capacity').eq('event_id', id).maybeSingle();
  if (eventError) return serverError(res, 'Could not load the event.');
  if (!event) return notFound(res, 'Event');

  const { data, error } = await db
    .from('ticket_allocations')
    .insert({ ...parsed.data, event_id: id })
    .select(ALLOCATION_SELECT)
    .single();
  if (error || !data) return writeError(res, error ?? {}, event.capacity, 'Could not create the allocation.');
  return res.status(201).json({ allocation: withAvailable(data) });
});

// PATCH /allocations/:id — staff only. Changes only the fields that are sent.
router.patch('/allocations/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Allocation');
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const db = userClient(req.auth!.token);

  const { data: existing, error: readError } = await db.from('ticket_allocations').select(ALLOCATION_SELECT).eq('allocation_id', id).maybeSingle();
  if (readError) return serverError(res, 'Could not load the allocation.');
  if (!existing) return notFound(res, 'Allocation');

  if (parsed.data.quantity !== undefined && parsed.data.quantity < existing.reserved_quantity) {
    return conflict(res, 'below_reserved', `The quantity cannot be lower than the ${existing.reserved_quantity} tickets already reserved.`);
  }

  const { data: event } = await db.from('events').select('capacity').eq('event_id', existing.event_id).maybeSingle();

  const { data, error } = await db.from('ticket_allocations').update(parsed.data).eq('allocation_id', id).select(ALLOCATION_SELECT).maybeSingle();
  if (error) return writeError(res, error, event?.capacity ?? null, 'Could not update the allocation.');
  if (!data) return notFound(res, 'Allocation');
  return res.json({ allocation: withAvailable(data) });
});

// DELETE /allocations/:id — staff only. Refused while tickets are reserved or already issued.
router.delete('/allocations/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Allocation');
  const db = userClient(req.auth!.token);

  const { data: existing, error: readError } = await db.from('ticket_allocations').select(ALLOCATION_SELECT).eq('allocation_id', id).maybeSingle();
  if (readError) return serverError(res, 'Could not load the allocation.');
  if (!existing) return notFound(res, 'Allocation');
  if (existing.reserved_quantity > 0) {
    return conflict(res, 'conflict', `This allocation still has ${existing.reserved_quantity} reserved tickets, so it cannot be deleted.`);
  }

  const { error } = await db.from('ticket_allocations').delete().eq('allocation_id', id);
  if (error) {
    if (error.code === '23503') return conflict(res, 'conflict', 'Tickets have already been issued from this allocation, so it cannot be deleted.');
    return serverError(res, 'Could not delete the allocation.');
  }
  return res.json({ message: 'Allocation deleted.' });
});

export default router;