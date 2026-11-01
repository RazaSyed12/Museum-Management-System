import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { allCategoriesActive } from '../lib/links';
import { requireAuth, requireStaff, requireAdminOrManager } from '../middleware/auth';

// Paths here are written in full (/collections/:collectionId/items, /items,
// /items/:id, /items/:id/archive), so this router is mounted without a prefix.
const router = Router();

// category:categories(...) is a direct alias of a to-one relation (one
// category per artefact, unlike a collection's many-to-many category_ids),
// so the row comes back with a clean `category` field already — no reshaping
// needed. Images are NOT embedded here, same convention as collections/events:
// fetch them separately via GET /items/:id/media (see media.ts).
const ITEM_SELECT =
  'item_id, collection_id, name, description, historical_period, year_label, origin, creator, ' +
  'location_id, accession_number, tags, status, created_at, updated_at, ' +
  'category:categories(category_id, name)';

function badRequest(res: Response, message: string, code = 'validation_error') {
  return res.status(400).json({ error: { message, code } });
}

function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}

function notFound(res: Response, what: string) {
  return res.status(404).json({ error: { message: `${what} not found.`, code: 'not_found' } });
}

// 23503 = foreign key (unknown location or category), 23505 = unique
// violation (accession number already used by another artefact).
function writeErrorMessage(error: { code?: string }): string | null {
  if (error.code === '23503') return 'That location or category does not exist.';
  if (error.code === '23505') return 'That accession number is already used by another artefact.';
  return null;
}

const idSchema = z.guid();
const text = (max: number) => z.string().trim().min(1).max(max);

const createSchema = z.object({
  name: text(200),
  description: text(5000).optional(),
  historical_period: text(150).optional(),
  year_label: text(100).optional(),
  origin: text(150).optional(),
  creator: text(150).optional(),
  location_id: z.guid().optional(),
  category_id: z.guid().optional(),
  accession_number: text(100).optional(),
  tags: z.array(text(50)).max(30).optional(),
  status: z.enum(['active', 'archived']).default('active'),
});

// For PATCH every field is optional; null clears an optional field.
// status is not nullable — there are only the two states.
const updateSchema = z
  .object({
    name: text(200),
    description: text(5000).nullable(),
    historical_period: text(150).nullable(),
    year_label: text(100).nullable(),
    origin: text(150).nullable(),
    creator: text(150).nullable(),
    location_id: z.guid().nullable(),
    category_id: z.guid().nullable(),
    accession_number: text(100).nullable(),
    tags: z.array(text(50)).max(30),
    status: z.enum(['active', 'archived']),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to change.' });

// Checks a category_id against allCategoriesActive (shared with
// collections/events) wrapped for the single-id case used here.
async function categoryOk(db: ReturnType<typeof userClient>, categoryId: string | null | undefined): Promise<boolean | null> {
  if (!categoryId) return true;
  return allCategoriesActive(db, [categoryId]);
}

// ---------------------------------------------------------------------------
// GET /collections/:collectionId/items — public for published collections and
// active artefacts. Staff (with a token) also see drafts/archived of both.
// Lightweight: no filters beyond pagination, since it's already scoped to one
// collection. For cross-collection browsing with filters, see GET /items below.
// ---------------------------------------------------------------------------

const nestedListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get('/collections/:collectionId/items', async (req: Request, res: Response) => {
  const collectionId = String(req.params.collectionId);
  if (!idSchema.safeParse(collectionId).success) return notFound(res, 'Collection');
  const parsed = nestedListQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { limit, offset } = parsed.data;

  const db = await readerClient(req, res);
  if (!db) return;

  // If the collection is hidden from this reader, say "not found" instead of an empty list.
  const { data: collection, error: collectionError } = await db
    .from('collections')
    .select('collection_id')
    .eq('collection_id', collectionId)
    .maybeSingle();
  if (collectionError) return serverError(res, 'Could not load the collection.');
  if (!collection) return notFound(res, 'Collection');

  const { data, error, count } = await db
    .from('collection_items')
    .select(ITEM_SELECT, { count: 'exact' })
    .eq('collection_id', collectionId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);
  if (error) return serverError(res, 'Could not load the items.');
  return res.json({ items: data ?? [], total: count ?? 0, limit, offset });
});

// ---------------------------------------------------------------------------
// GET /items — public, cross-collection. Full filter set: collection,
// category, status, period, origin (exact filters) plus a name search and
// a choosable sort.
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  collection_id: z.guid().optional(),
  category_id: z.guid().optional(),
  status: z.enum(['active', 'archived']).optional(),
  historical_period: z.string().trim().max(150).optional(),
  origin: z.string().trim().max(150).optional(),
  sort: z.enum(['name', 'newest', 'oldest']).default('name'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get('/items', async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { q, collection_id, category_id, status, historical_period, origin, sort, limit, offset } = parsed.data;

  const db = await readerClient(req, res);
  if (!db) return;

  const orderColumn = sort === 'name' ? 'name' : 'created_at';
  const orderAscending = sort !== 'newest';

  let query = db
    .from('collection_items')
    .select(ITEM_SELECT, { count: 'exact' })
    .order(orderColumn, { ascending: orderAscending })
    .range(offset, offset + limit - 1);

  if (q) query = query.ilike('name', `%${q}%`);
  if (collection_id) query = query.eq('collection_id', collection_id);
  if (category_id) query = query.eq('category_id', category_id);
  if (status) query = query.eq('status', status);
  if (historical_period) query = query.eq('historical_period', historical_period);
  if (origin) query = query.eq('origin', origin);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load the items.');
  return res.json({ items: data ?? [], total: count ?? 0, limit, offset });
});

// POST /collections/:collectionId/items — staff only.
router.post('/collections/:collectionId/items', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const collectionId = String(req.params.collectionId);
  if (!idSchema.safeParse(collectionId).success) return notFound(res, 'Collection');
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const db = userClient(req.auth!.token);

  const { data: collection, error: collectionError } = await db
    .from('collections')
    .select('collection_id')
    .eq('collection_id', collectionId)
    .maybeSingle();
  if (collectionError) return serverError(res, 'Could not load the collection.');
  if (!collection) return notFound(res, 'Collection');

  const categoryActive = await categoryOk(db, parsed.data.category_id);
  if (categoryActive === null) return serverError(res, 'Could not create the item.');
  if (!categoryActive) return badRequest(res, 'That category does not exist or is deactivated.', 'invalid_category');

  const { data, error } = await db
    .from('collection_items')
    .insert({ ...parsed.data, collection_id: collectionId })
    .select(ITEM_SELECT)
    .single();
  if (error || !data) {
    const message = error && writeErrorMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not create the item.');
  }
  return res.status(201).json({ item: data });
});

// GET /items/:id — public if the item is active and its collection is published; staff see all.
router.get('/items/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Item');

  const db = await readerClient(req, res);
  if (!db) return;

  const { data, error } = await db.from('collection_items').select(ITEM_SELECT).eq('item_id', id).maybeSingle();
  if (error) return serverError(res, 'Could not load the item.');
  if (!data) return notFound(res, 'Item');
  return res.json({ item: data });
});

// PATCH /items/:id — staff only. Changes only the fields that are sent.
// Setting status to archived requires an admin or manager tier (same rule
// as archiving a collection or cancelling an event).
router.patch('/items/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Item');
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  if (parsed.data.status === 'archived') {
    const tier = req.auth!.tier;
    if (tier !== 'admin' && tier !== 'manager') {
      return res.status(403).json({
        error: { message: 'Archiving an artefact requires an admin or manager tier.', code: 'forbidden' },
      });
    }
  }

  const db = userClient(req.auth!.token);

  if ('category_id' in parsed.data) {
    const categoryActive = await categoryOk(db, parsed.data.category_id);
    if (categoryActive === null) return serverError(res, 'Could not update the item.');
    if (!categoryActive) return badRequest(res, 'That category does not exist or is deactivated.', 'invalid_category');
  }

  const { data, error } = await db
    .from('collection_items')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('item_id', id)
    .select(ITEM_SELECT)
    .maybeSingle();
  if (error) {
    const message = writeErrorMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not update the item.');
  }
  if (!data) return notFound(res, 'Item');
  return res.json({ item: data });
});

// POST /items/:id/archive — admin/manager only. Same as PATCH {"status":"archived"},
// as a clearly named action. Hides the artefact from the public but keeps it
// (and its history) in the database. Repeating it is harmless.
router.post('/items/:id/archive', requireAuth, requireStaff, requireAdminOrManager, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Item');

  const { data, error } = await userClient(req.auth!.token)
    .from('collection_items')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('item_id', id)
    .select(ITEM_SELECT)
    .maybeSingle();
  if (error) return serverError(res, 'Could not archive the item.');
  if (!data) return notFound(res, 'Item');
  return res.json({ item: data });
});

// DELETE /items/:id — admin/manager only (outright deletion is strictly more
// destructive than archiving, so it gets at least the same tier gate).
// Nothing else depends on an item, so it is removed outright, not archived.
router.delete('/items/:id', requireAuth, requireStaff, requireAdminOrManager, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Item');

  const { data, error } = await userClient(req.auth!.token)
    .from('collection_items')
    .delete()
    .eq('item_id', id)
    .select('item_id')
    .maybeSingle();
  if (error) return serverError(res, 'Could not delete the item.');
  if (!data) return notFound(res, 'Item');
  return res.json({ message: 'Item deleted.' });
});

export default router;
