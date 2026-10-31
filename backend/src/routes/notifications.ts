import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';

// Full paths (/admin/notifications, /admin/notifications/:id/read), so this
// router is mounted without a prefix. Every notification belongs to exactly
// one recipient (the signed-in staff member) — there is no shared/broadcast
// state, so these routes never need to ask "whose read state".
const router = Router();

const NOTIFICATION_SELECT = 'notification_id, type, message, resource_kind, resource_id, read_at, created_at';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}
function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}
function notFound(res: Response, what: string) {
  return res.status(404).json({ error: { message: `${what} not found.`, code: 'not_found' } });
}

const idSchema = z.guid();

const listQuerySchema = z.object({
  unread_only: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /admin/notifications — any staff tier. RLS already scopes every query
// here to the caller's own rows (notifications_select_own), so no explicit
// recipient filter is needed in the query itself. unread_count is always
// the TOTAL unread count, independent of ?unread_only= and pagination, so
// the frontend can show a badge without a second request.
router.get('/admin/notifications', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { unread_only, limit, offset } = parsed.data;
  const db = userClient(req.auth!.token);

  let query = db
    .from('notifications')
    .select(NOTIFICATION_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (unread_only === 'true') query = query.is('read_at', null);

  const [{ data, error, count }, { count: unreadCount, error: unreadError }] = await Promise.all([
    query,
    db.from('notifications').select('notification_id', { count: 'exact', head: true }).is('read_at', null),
  ]);
  if (error || unreadError) return serverError(res, 'Could not load notifications.');

  return res.json({
    notifications: data ?? [],
    total: count ?? 0,
    unread_count: unreadCount ?? 0,
    limit,
    offset,
  });
});

// POST /admin/notifications/:id/read — any staff tier. Idempotent: marking
// an already-read notification read again just returns it unchanged.
router.post('/admin/notifications/:id/read', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Notification');

  const { data, error } = await userClient(req.auth!.token).rpc('mark_notification_read', { p_notification_id: id });
  if (error) {
    if (error.message === 'notification_not_found') return notFound(res, 'Notification');
    return serverError(res, 'Could not update the notification.');
  }
  return res.json({ notification: data });
});

export default router;
