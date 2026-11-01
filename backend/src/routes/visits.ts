import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';

// Full paths (/visits, /visits/:id), so this router is mounted without a prefix.
// Staff only. Visits are read-only once created (no PATCH/DELETE) — a mistaken
// entry is a staff/admin matter to fix directly, not an exposed API operation.
const router = Router();

const VISIT_SELECT = 'attendance_id, visitor_id, booking_id, quantity, visited_at, created_by, created_at';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}
function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}
function notFound(res: Response, what: string) {
  return res.status(404).json({ error: { message: `${what} not found.`, code: 'not_found' } });
}
function writeErrorMessage(error: { code?: string }): string | null {
  if (error.code === '23503') return 'That visitor does not exist.';
  return null;
}

const idSchema = z.guid();
const isoDateTime = z.iso.datetime({ offset: true, message: 'Use an ISO date-time with a timezone, e.g. 2026-11-14T18:00:00+10:30' });

// booking_id is deliberately not accepted here — ticketed attendance is only
// ever created by POST /bookings/:id/check-in (see the attendance_booking_id_key
// unique index), so there's exactly one way to produce that kind of row.
// This endpoint is for an anonymous or visitor-linked walk-in with no booking.
const createSchema = z.object({
  visitor_id: z.guid().optional(),
  quantity: z.number().int().min(1).max(1000).default(1),
  visited_at: isoDateTime.optional(),
});

const listQuerySchema = z.object({
  visitor_id: z.guid().optional(),
  booking_id: z.guid().optional(),
  date_from: isoDateTime.optional(),
  date_to: isoDateTime.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /visits — staff only. ?visitor_id= and ?booking_id= are how the visitor
// and booking detail screens get their attendance history (no separate
// history endpoint needed, per the handoff doc).
router.get('/visits', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { visitor_id, booking_id, date_from, date_to, limit, offset } = parsed.data;

  let query = userClient(req.auth!.token)
    .from('attendance')
    .select(VISIT_SELECT, { count: 'exact' })
    .order('visited_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (visitor_id) query = query.eq('visitor_id', visitor_id);
  if (booking_id) query = query.eq('booking_id', booking_id);
  if (date_from) query = query.gte('visited_at', date_from);
  if (date_to) query = query.lte('visited_at', date_to);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load the visits.');
  return res.json({ visits: data ?? [], total: count ?? 0, limit, offset });
});

// GET /visits/:id — staff only.
router.get('/visits/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Visit');

  const { data, error } = await userClient(req.auth!.token)
    .from('attendance')
    .select(VISIT_SELECT)
    .eq('attendance_id', id)
    .maybeSingle();
  if (error) return serverError(res, 'Could not load the visit.');
  if (!data) return notFound(res, 'Visit');
  return res.json({ visit: data });
});

// POST /visits — any staff tier (matches "record visits": yes for every tier).
// Records a walk-in: visitor_id is optional (omit it for a fully anonymous
// head count), visited_at defaults to now.
router.post('/visits', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token)
    .from('attendance')
    .insert({
      visitor_id: parsed.data.visitor_id ?? null,
      quantity: parsed.data.quantity,
      visited_at: parsed.data.visited_at ?? new Date().toISOString(),
      created_by: req.auth!.userId,
    })
    .select(VISIT_SELECT)
    .single();
  if (error || !data) {
    const message = error && writeErrorMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not record the visit.');
  }
  return res.status(201).json({ visit: data });
});

export default router;
