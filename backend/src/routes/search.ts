import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { readerContext } from '../lib/readerClient';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';

// Full path (/search), so this router is mounted without a prefix.
const router = Router();

const querySchema = z.object({
  q: z
    .string('Search text is required')
    .trim()
    .min(2, 'Search text must be at least 2 characters')
    .max(100, 'Search text must be at most 100 characters'),
  limit: z.coerce.number().int().min(1).max(20).default(5),
});

// GET /search?q=&limit= — public. Events, collections, collection items, locations and categories whose
// name or description contain the text (up to "limit" of each kind, best matches first). Runs as the
// caller, so guests never see drafts. A signed-in user's search is also saved to their history, which
// feeds the recommendations.
router.get('/search', async (req: Request, res: Response) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: { message: parsed.error.issues[0].message, code: 'validation_error' },
    });
  }
  const { q, limit } = parsed.data;

  const context = await readerContext(req, res);
  if (!context) return;
  const { db, userId } = context;

  const { data, error } = await db.rpc('search_catalogue', { p_q: q, p_limit: limit });
  if (error) {
    return res.status(500).json({ error: { message: 'Search failed.', code: 'server_error' } });
  }

  if (userId && q.length >= 3) {
    try {
      await db.rpc('log_interaction', { p_type: 'search', p_query: q });
    } catch {
      // History is best effort; a failure here never breaks the search.
    }
  }

  const rows = (data ?? []) as any[];
  const of = (kind: string) => rows.filter((r) => r.kind === kind);

  return res.json({
    query: q,
    events: of('event').map((r) => ({
      event_id: r.id, name: r.title, description: r.description, start_at: r.starts_at, status: r.status,
    })),
    collections: of('collection').map((r) => ({
      collection_id: r.id, name: r.title, description: r.description, status: r.status,
    })),
    items: of('item').map((r) => ({
      item_id: r.id, name: r.title, description: r.description, detail: r.detail,
      collection_id: r.collection_id, collection_name: r.collection_name,
    })),
    locations: of('location').map((r) => ({
      location_id: r.id, name: r.title, address: r.description, place: r.detail,
    })),
    categories: of('category').map((r) => ({
      category_id: r.id, name: r.title, description: r.description,
    })),
  });
});

const staffQuerySchema = z.object({
  q: z
    .string('Search text is required')
    .trim()
    .min(2, 'Search text must be at least 2 characters')
    .max(100, 'Search text must be at most 100 characters'),
  limit: z.coerce.number().int().min(1).max(20).default(5),
});

// GET /admin/search?q=&limit= — any staff tier. A SEPARATE search from
// GET /search above, not an extension of it: this one reaches visitors,
// bookings, memberships and staff accounts — sensitive domains that must
// never be reachable through the public endpoint. The staff_user kind is
// only ever populated for an admin caller (enforced in the database
// function, not just here). Flat, bounded list (up to `limit` per kind,
// best matches first) with a stable id/label/kind/destination per row —
// not the richer per-kind buckets GET /search returns, since this is a
// lookup/jump-to-record search, not a content search.
router.get('/admin/search', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = staffQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: { message: parsed.error.issues[0].message, code: 'validation_error' },
    });
  }
  const { q, limit } = parsed.data;

  const { data, error } = await userClient(req.auth!.token).rpc('staff_search', { p_q: q, p_limit: limit });
  if (error) {
    return res.status(500).json({ error: { message: 'Search failed.', code: 'server_error' } });
  }

  const rows = ((data ?? []) as any[]).map((r) => ({ kind: r.kind, id: r.id, label: r.label, destination: r.destination }));
  return res.json({ query: q, results: rows });
});

export default router;