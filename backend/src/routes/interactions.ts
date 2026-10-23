import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { requireAuth } from '../middleware/auth';

// Full paths (/me/interactions), so this router is mounted without a prefix.
// Only signed-in users are ever recorded; guests are not tracked at all.
const router = Router();

function send(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}
const badRequest = (res: Response, message: string) => send(res, 400, 'validation_error', message);
const serverError = (res: Response, message: string) => send(res, 500, 'server_error', message);

const bodySchema = z
  .object({
    type: z.enum(['view', 'category_browse', 'search']),
    event_id: z.guid().optional(),
    collection_id: z.guid().optional(),
    item_id: z.guid().optional(),
    category_id: z.guid().optional(),
    query: z.string().trim().min(3).max(100).optional(),
  })
  .strict();

// Each type takes exactly its own fields.
function targetProblem(d: z.infer<typeof bodySchema>): string | null {
  const targets = [d.event_id, d.collection_id, d.item_id].filter(Boolean).length;
  if (d.type === 'view') {
    if (targets !== 1 || d.category_id || d.query !== undefined) {
      return 'A view needs exactly one of event_id, collection_id or item_id.';
    }
    return null;
  }
  if (d.type === 'category_browse') {
    if (!d.category_id || targets > 0 || d.query !== undefined) {
      return 'A category browse needs only category_id.';
    }
    return null;
  }
  if (d.query === undefined || targets > 0 || d.category_id) {
    return 'A search needs only query (3 to 100 characters).';
  }
  return null;
}

// POST /me/interactions — signed in. Records a view, a category browse or a search.
// 201 {recorded: true}; 200 {recorded: false} when the same thing was recorded in the last 10 minutes.
router.post('/me/interactions', requireAuth, async (req: Request, res: Response) => {
  const parsed = bodySchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const problem = targetProblem(parsed.data);
  if (problem) return badRequest(res, problem);
  const d = parsed.data;

  const { data, error } = await userClient(req.auth!.token).rpc('log_interaction', {
    p_type: d.type,
    p_event_id: d.event_id ?? null,
    p_collection_id: d.collection_id ?? null,
    p_item_id: d.item_id ?? null,
    p_category_id: d.category_id ?? null,
    p_query: d.query ?? null,
  });
  if (error) {
    if (error.code === '23503') {
      return send(res, 404, 'not_found', 'That event, collection, item or category does not exist.');
    }
    return serverError(res, 'Could not record that.');
  }
  return res.status(data === true ? 201 : 200).json({ recorded: data === true });
});

const listSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /me/interactions — signed in. The caller's own history, newest first.
router.get('/me/interactions', requireAuth, async (req: Request, res: Response) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { limit, offset } = parsed.data;

  const { data, error, count } = await userClient(req.auth!.token)
    .from('user_interactions')
    .select('interaction_id, interaction_type, event_id, collection_id, item_id, category_id, search_query, occurred_at', {
      count: 'exact',
    })
    .eq('user_id', req.auth!.userId)
    .order('occurred_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) return serverError(res, 'Could not load your history.');
  return res.json({ interactions: data ?? [], total: count ?? 0, limit, offset });
});

// DELETE /me/interactions — signed in. Clears the caller's browsing history.
// (Bookings are separate records and are not touched.)
router.delete('/me/interactions', requireAuth, async (req: Request, res: Response) => {
  const { data, error } = await userClient(req.auth!.token).rpc('clear_my_interactions');
  if (error) return serverError(res, 'Could not clear your history.');
  return res.json({ deleted: data ?? 0 });
});

export default router;