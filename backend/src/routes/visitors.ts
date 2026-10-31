import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';

// Full paths (/visitors, /visitors/:id), so this router is mounted without a prefix.
// Staff only, end to end — visitor records are never public or self-service.
const router = Router();

const VISITOR_SELECT = 'visitor_id, full_name, email, phone, address, linked_profile_id, created_at, updated_at';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}
function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}
function notFound(res: Response, what: string) {
  return res.status(404).json({ error: { message: `${what} not found.`, code: 'not_found' } });
}
// 23503 = foreign key: linked_profile_id does not exist.
function writeErrorMessage(error: { code?: string }): string | null {
  if (error.code === '23503') return 'That linked profile does not exist.';
  return null;
}

const idSchema = z.guid();
const text = (max: number) => z.string().trim().min(1).max(max);

const createSchema = z.object({
  full_name: text(200),
  email: z.string().trim().toLowerCase().email().max(200).optional(),
  phone: text(50).optional(),
  address: text(500).optional(),
});

// For PATCH every field is optional; null clears an optional field.
const updateSchema = z
  .object({
    full_name: text(200),
    email: z.string().trim().toLowerCase().email().max(200).nullable(),
    phone: text(50).nullable(),
    address: text(500).nullable(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to change.' });

const listQuerySchema = z.object({
  // Matches name OR email — no uniqueness is enforced on email (see the
  // migration), so this is how staff check for an existing visitor before
  // creating a new one.
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /visitors — staff only. ?q= matches name or email.
router.get('/visitors', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { q, limit, offset } = parsed.data;

  let query = userClient(req.auth!.token)
    .from('visitors')
    .select(VISITOR_SELECT, { count: 'exact' })
    .order('full_name', { ascending: true })
    .range(offset, offset + limit - 1);
  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load the visitors.');
  return res.json({ visitors: data ?? [], total: count ?? 0, limit, offset });
});

// GET /visitors/:id — staff only. Booking/membership/visit history comes from
// those resources' own list endpoints filtered by visitor_id, not from here.
router.get('/visitors/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Visitor');

  const { data, error } = await userClient(req.auth!.token)
    .from('visitors')
    .select(VISITOR_SELECT)
    .eq('visitor_id', id)
    .maybeSingle();
  if (error) return serverError(res, 'Could not load the visitor.');
  if (!data) return notFound(res, 'Visitor');
  return res.json({ visitor: data });
});

// POST /visitors — staff only.
router.post('/visitors', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token)
    .from('visitors')
    .insert(parsed.data)
    .select(VISITOR_SELECT)
    .single();
  if (error || !data) {
    const message = error && writeErrorMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not create the visitor.');
  }
  return res.status(201).json({ visitor: data });
});

// PATCH /visitors/:id — staff only. Changes only the fields that are sent.
router.patch('/visitors/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Visitor');
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token)
    .from('visitors')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('visitor_id', id)
    .select(VISITOR_SELECT)
    .maybeSingle();
  if (error) {
    const message = writeErrorMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not update the visitor.');
  }
  if (!data) return notFound(res, 'Visitor');
  return res.json({ visitor: data });
});

export default router;
