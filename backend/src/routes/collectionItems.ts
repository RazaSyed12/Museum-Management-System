import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff } from '../middleware/auth';

// Paths here are written in full (/collections/:collectionId/items and /items/:id),
// so this router is mounted without a prefix.
const router = Router();

const ITEM_SELECT =
  'item_id, collection_id, name, description, historical_period, year_label, origin, creator, location_id, created_at';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}

function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}

function notFound(res: Response, what: string) {
  return res.status(404).json({ error: { message: `${what} not found.`, code: 'not_found' } });
}

// 23503 = foreign key: the location_id you sent does not exist
function isBadReference(error: { code?: string }) {
  return error.code === '23503';
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
});

// For PATCH every field is optional; null clears an optional field.
const updateSchema = z
  .object({
    name: text(200),
    description: text(5000).nullable(),
    historical_period: text(150).nullable(),
    year_label: text(100).nullable(),
    origin: text(150).nullable(),
    creator: text(150).nullable(),
    location_id: z.guid().nullable(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to change.' });

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /collections/:collectionId/items — public for published collections.
// Staff (with a token) can also see items of draft and archived collections.
router.get('/collections/:collectionId/items', async (req: Request, res: Response) => {
  const collectionId = String(req.params.collectionId);
  if (!idSchema.safeParse(collectionId).success) return notFound(res, 'Collection');
  const parsed = listQuerySchema.safeParse(req.query);
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

  const { data, error } = await db
    .from('collection_items')
    .insert({ ...parsed.data, collection_id: collectionId })
    .select(ITEM_SELECT)
    .single();
  if (error || !data) {
    if (error && isBadReference(error)) return badRequest(res, 'That location does not exist.');
    return serverError(res, 'Could not create the item.');
  }
  return res.status(201).json({ item: data });
});

// GET /items/:id — public if the item's collection is published; staff can see all.
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
router.patch('/items/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Item');
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token)
    .from('collection_items')
    .update(parsed.data)
    .eq('item_id', id)
    .select(ITEM_SELECT)
    .maybeSingle();
  if (error) {
    if (isBadReference(error)) return badRequest(res, 'That location does not exist.');
    return serverError(res, 'Could not update the item.');
  }
  if (!data) return notFound(res, 'Item');
  return res.json({ item: data });
});

// DELETE /items/:id — staff only. Nothing else depends on an item, so it is removed outright.
router.delete('/items/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
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