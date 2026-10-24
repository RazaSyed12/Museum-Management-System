import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { readerContext } from '../lib/readerClient';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';

// Full paths (/newsletter/..., /me/newsletter, /admin/newsletter), so this router is mounted without a prefix.
const router = Router();

function send(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}
const badRequest = (res: Response, message: string) => send(res, 400, 'validation_error', message);
const serverError = (res: Response, message: string) => send(res, 500, 'server_error', message);

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(254),
});

// POST /newsletter/subscribe — public (guests and signed-in users). A signed-in user subscribing their own
// account email gets the subscription linked to their account. No confirmation email is sent.
router.post('/newsletter/subscribe', async (req: Request, res: Response) => {
  const parsed = subscribeSchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const context = await readerContext(req, res);
  if (!context) return;

  const { error } = await context.db.rpc('newsletter_subscribe', { p_email: parsed.data.email });
  if (error) {
    if (error.message === 'invalid_email') return badRequest(res, 'Enter a valid email address');
    return serverError(res, 'Could not subscribe.');
  }
  return res.json({
    message: 'Thanks for subscribing. If you unsubscribed before, sign in and subscribe again from your account.',
  });
});

// GET /me/newsletter — signed in. {email, subscribed}.
router.get('/me/newsletter', requireAuth, async (req: Request, res: Response) => {
  const { data, error } = await userClient(req.auth!.token).rpc('my_newsletter');
  if (error) return serverError(res, 'Could not load your newsletter status.');
  return res.json(data);
});

// DELETE /me/newsletter — signed in. Unsubscribes the caller's own address.
router.delete('/me/newsletter', requireAuth, async (req: Request, res: Response) => {
  const { error } = await userClient(req.auth!.token).rpc('newsletter_unsubscribe');
  if (error) return serverError(res, 'Could not unsubscribe.');
  return res.json({ subscribed: false });
});

const listSchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(['subscribed', 'unsubscribed']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /admin/newsletter — staff only. ?q= (email contains), ?status=, ?limit=, ?offset=. Newest first.
router.get('/admin/newsletter', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const f = parsed.data;

  let query = userClient(req.auth!.token)
    .from('newsletter_subscriptions')
    .select('subscription_id, user_id, email, status, subscribed_at', { count: 'exact' })
    .order('subscribed_at', { ascending: false })
    .range(f.offset, f.offset + f.limit - 1);
  if (f.status) query = query.eq('status', f.status);
  if (f.q) query = query.ilike('email', `%${f.q.replace(/[\\%_]/g, '\\$&')}%`);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load the subscribers.');
  return res.json({ subscribers: data ?? [], total: count ?? 0, limit: f.limit, offset: f.offset });
});

export default router;