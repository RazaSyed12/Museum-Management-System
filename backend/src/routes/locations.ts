import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { anonClient, userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';

const router = Router();

const LOCATION_SELECT = 'location_id, name, address, city, country, capacity';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}

function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}

function notFound(res: Response) {
  return res.status(404).json({ error: { message: 'Location not found.', code: 'not_found' } });
}

// 23503 = a foreign key blocks this (the location is still used by an event or collection)
function isInUse(error: { code?: string }) {
  return error.code === '23503';
}

const idSchema = z.guid();

const text = (max: number) => z.string().trim().min(1).max(max);

const createSchema = z.object({
  name: text(150),
  address: text(300).optional(),
  city: text(100).optional(),
  country: text(100).optional(),
  capacity: z.number().int().min(0).max(1000000).optional(),
});

// For PATCH every field is optional. null clears an optional field.
const updateSchema = z
  .object({
    name: text(150),
    address: text(300).nullable(),
    city: text(100).nullable(),
    country: text(100).nullable(),
    capacity: z.number().int().min(0).max(1000000).nullable(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to change.' });

const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /locations — public. Supports ?q=text (searches the name), ?limit, ?offset.
router.get('/', async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { q, limit, offset } = parsed.data;

  let query = anonClient()
    .from('locations')
    .select(LOCATION_SELECT, { count: 'exact' })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);
  if (q) query = query.ilike('name', `%${q.replace(/[%_,()]/g, ' ')}%`);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load locations.');
  return res.json({ locations: data ?? [], total: count ?? 0, limit, offset });
});

// GET /locations/:id — public.
router.get('/:id', async (req: Request, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success) return notFound(res);
  const { data, error } = await anonClient()
    .from('locations')
    .select(LOCATION_SELECT)
    .eq('location_id', req.params.id)
    .maybeSingle();
  if (error) return serverError(res, 'Could not load the location.');
  if (!data) return notFound(res);
  return res.json({ location: data });
});

// POST /locations — staff only.
router.post('/', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token)
    .from('locations')
    .insert(parsed.data)
    .select(LOCATION_SELECT)
    .single();
  if (error || !data) return serverError(res, 'Could not create the location.');
  return res.status(201).json({ location: data });
});

// PATCH /locations/:id — staff only. Changes only the fields that are sent.
router.patch('/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success) return notFound(res);
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token)
    .from('locations')
    .update(parsed.data)
    .eq('location_id', req.params.id)
    .select(LOCATION_SELECT)
    .maybeSingle();
  if (error) return serverError(res, 'Could not update the location.');
  if (!data) return notFound(res);
  return res.json({ location: data });
});

// DELETE /locations/:id — staff only. Refused with 409 if events/collections still use it.
router.delete('/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  if (!idSchema.safeParse(req.params.id).success) return notFound(res);

  const { data, error } = await userClient(req.auth!.token)
    .from('locations')
    .delete()
    .eq('location_id', req.params.id)
    .select('location_id')
    .maybeSingle();
  if (error) {
    if (isInUse(error)) {
      return res.status(409).json({
        error: {
          message: 'This location is still used by an event or collection. Move them to another location first.',
          code: 'conflict',
        },
      });
    }
    return serverError(res, 'Could not delete the location.');
  }
  if (!data) return notFound(res);
  return res.json({ message: 'Location deleted.' });
});

export default router;