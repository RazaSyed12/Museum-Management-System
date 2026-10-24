import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';

// Full paths (/admin/...), so this router is mounted without a prefix.
// Every route is staff only; the database functions check is_staff() again.
const router = Router();

function send(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}
const badRequest = (res: Response, message: string) => send(res, 400, 'validation_error', message);
const serverError = (res: Response, message: string) => send(res, 500, 'server_error', message);

function rpcFailure(res: Response, error: { message?: string }, fallback: string) {
  switch (error.message) {
    case 'forbidden':
      return send(res, 403, 'forbidden', 'Staff access required.');
    case 'user_not_found':
      return send(res, 404, 'not_found', 'User not found.');
    case 'cannot_change_self':
      return send(res, 409, 'cannot_change_self', 'You cannot demote or suspend your own account.');
    case 'nothing_to_change':
      return badRequest(res, 'Send role, status or both.');
    case 'invalid_role':
      return badRequest(res, 'Role must be registered or staff.');
    case 'invalid_status':
      return badRequest(res, 'Status must be active or suspended.');
    default:
      return serverError(res, fallback);
  }
}

const idSchema = z.guid();

const listSchema = z.object({
  q: z.string().trim().max(100).optional(),
  role: z.enum(['registered', 'member', 'staff']).optional(),
  status: z.enum(['active', 'suspended', 'deleted']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /admin/users — staff only. ?q= (name or email), ?role=, ?status=, ?limit=, ?offset=. Newest first.
router.get('/admin/users', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const f = parsed.data;

  const { data, error } = await userClient(req.auth!.token).rpc('admin_list_users', {
    p_q: f.q || null,
    p_role: f.role ?? null,
    p_status: f.status ?? null,
    p_limit: f.limit,
    p_offset: f.offset,
  });
  if (error) return rpcFailure(res, error, 'Could not load the users.');

  const rows = (data ?? []) as any[];
  const total = rows.length > 0 ? Number(rows[0].total) : 0;
  const users = rows.map(({ total: _total, ...user }) => user);
  return res.json({ users, total, limit: f.limit, offset: f.offset });
});

// GET /admin/users/:id — staff only. One user with membership and recent bookings.
router.get('/admin/users/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return send(res, 404, 'not_found', 'User not found.');

  const { data, error } = await userClient(req.auth!.token).rpc('admin_get_user', { p_id: id });
  if (error) return rpcFailure(res, error, 'Could not load the user.');
  return res.json({ user: data });
});

const patchSchema = z
  .object({
    role: z.enum(['registered', 'staff']).optional(),
    status: z.enum(['active', 'suspended']).optional(),
  })
  .strict();

// PATCH /admin/users/:id — staff only. Change role and/or status. Suspending ends the user's
// sessions. Staff cannot demote or suspend themselves.
router.patch('/admin/users/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return send(res, 404, 'not_found', 'User not found.');
  const parsed = patchSchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  if (parsed.data.role === undefined && parsed.data.status === undefined) {
    return badRequest(res, 'Send role, status or both.');
  }

  const { data, error } = await userClient(req.auth!.token).rpc('admin_set_user', {
    p_id: id,
    p_role: parsed.data.role ?? null,
    p_status: parsed.data.status ?? null,
  });
  if (error) return rpcFailure(res, error, 'Could not update the user.');
  return res.json({ user: data });
});

// GET /admin/stats — staff only. Dashboard numbers.
router.get('/admin/stats', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const { data, error } = await userClient(req.auth!.token).rpc('admin_stats');
  if (error) return rpcFailure(res, error, 'Could not load the stats.');
  return res.json({ stats: data });
});

export default router;