import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff } from '../middleware/auth';

const router = Router();

// What the public site needs about a collection. The embedded bits
// follow the foreign keys: locations(...) is the collection's location,
// collection_categories -> categories(...) is its category list.
export const COLLECTION_SELECT =
  'collection_id, name, description, status, featured, location_id, created_at, updated_at, ' +
  'locations(name, city), collection_categories(categories(category_id, name))';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}

function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}

// Turns the database row into the shape the frontend wants:
// one "location" object and a flat "categories" list.
export function shape(row: any) {
  const { locations, collection_categories, ...rest } = row;
  return {
    ...rest,
    location: locations ?? null,
    categories: (collection_categories ?? [])
      .map((link: any) => link.categories)
      .filter(Boolean),
  };
}

const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  featured: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /collections — public. Without a token, row-level security only lets the
// anonymous role see rows with status = 'published'. With a staff token the
// same query also returns drafts and archived collections.
router.get('/', async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { q, featured, limit, offset } = parsed.data;

  const db = await readerClient(req, res);
  if (!db) return;

  let query = db
    .from('collections')
    .select(COLLECTION_SELECT, { count: 'exact' })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);

  if (q) query = query.ilike('name', `%${q}%`);
  if (featured) query = query.eq('featured', featured === 'true');

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load collections.');

  return res.status(200).json({
    collections: (data ?? []).map(shape),
    total: count ?? 0,
    limit,
    offset,
  });
});

const idSchema = z.object({ id: z.guid('Collection id must be a valid UUID') });

// GET /collections/:id — public. For anyone who may not see it, a draft or
// archived collection looks exactly like one that doesn't exist (404).
router.get('/:id', async (req: Request, res: Response) => {
  const parsed = idSchema.safeParse(req.params);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const db = await readerClient(req, res);
  if (!db) return;

  const { data, error } = await db
    .from('collections')
    .select(COLLECTION_SELECT)
    .eq('collection_id', parsed.data.id)
    .maybeSingle();

  if (error) return serverError(res, 'Could not load the collection.');
  if (!data) {
    return res.status(404).json({
      error: { message: 'Collection not found.', code: 'not_found' },
    });
  }
  return res.status(200).json({ collection: shape(data) });
});

const createSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  description: z.string().trim().max(5000).nullish(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  location_id: z.guid().nullish(),
  featured: z.boolean().default(false),
  category_ids: z.array(z.guid()).max(20).default([]),
});

// Postgres error codes worth explaining to the caller instead of a blanket 500:
// 23503 = foreign key (e.g. unknown location or category), 23514 = CHECK constraint.
function isBadReference(error: { code?: string }) {
  return error.code === '23503' || error.code === '23514';
}

// POST /collections — staff only. The login check (requireAuth) and the role
// check (requireStaff) run first. The insert then runs AS the staff member, so
// the database's own staff-only rule is a second lock behind the code check.
router.post('/', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { category_ids, ...fields } = parsed.data;
  const auth = req.auth!;
  const db = userClient(auth.token);

  const { data: created, error } = await db
    .from('collections')
    .insert({ ...fields, created_by: auth.userId })
    .select('collection_id')
    .single();

  if (error || !created) {
    if (error && isBadReference(error)) {
      return badRequest(res, 'The location or a value you sent is not valid.');
    }
    return serverError(res, 'Could not create the collection.');
  }

  if (category_ids.length > 0) {
    const { error: linkError } = await db
      .from('collection_categories')
      .insert(category_ids.map((category_id) => ({ collection_id: created.collection_id, category_id })));

    if (linkError) {
      // Undo the half-finished create so nothing is left without its categories.
      await db.from('collections').delete().eq('collection_id', created.collection_id);
      if (isBadReference(linkError)) return badRequest(res, 'One of the categories does not exist.');
      return serverError(res, 'Could not create the collection.');
    }
  }

  // Re-read it so the reply has the same shape as GET /collections/:id.
  const { data: full, error: readError } = await db
    .from('collections')
    .select(COLLECTION_SELECT)
    .eq('collection_id', created.collection_id)
    .single();
  if (readError || !full) return serverError(res, 'The collection was created but could not be read back.');

  return res.status(201).json({ collection: shape(full) });
});

// For PATCH every field is optional and has NO default, so fields the caller
// leaves out are left alone. (Defaults here would silently reset them.)
const updateSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(200).optional(),
    description: z.string().trim().max(5000).nullish(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    location_id: z.guid().nullish(),
    featured: z.boolean().optional(),
    category_ids: z.array(z.guid()).max(20).optional(),
  })
  .refine((body) => Object.keys(body).length > 0, { message: 'Send at least one field to update' });

function notFound(res: Response) {
  return res.status(404).json({ error: { message: 'Collection not found.', code: 'not_found' } });
}

// PATCH /collections/:id — staff only. Changes only the fields that are sent.
// If category_ids is sent it REPLACES the collection's category list.
router.patch('/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const idParsed = idSchema.safeParse(req.params);
  if (!idParsed.success) return badRequest(res, idParsed.error.issues[0].message);
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const id = idParsed.data.id;
  const { category_ids, ...fields } = parsed.data;
  const db = userClient(req.auth!.token);

  // updated_at is not maintained by a database trigger, so we set it here.
  const { data: updated, error } = await db
    .from('collections')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('collection_id', id)
    .select('collection_id')
    .maybeSingle();

  if (error) {
    if (isBadReference(error)) return badRequest(res, 'The location or a value you sent is not valid.');
    return serverError(res, 'Could not update the collection.');
  }
  if (!updated) return notFound(res);

  if (category_ids) {
    // Add the new links first, so a bad category id fails before anything is removed.
    if (category_ids.length > 0) {
      const { error: addError } = await db
        .from('collection_categories')
        .upsert(
          category_ids.map((category_id) => ({ collection_id: id, category_id })),
          { onConflict: 'collection_id,category_id', ignoreDuplicates: true },
        );
      if (addError) {
        if (isBadReference(addError)) return badRequest(res, 'One of the categories does not exist.');
        return serverError(res, 'Could not update the categories.');
      }
    }
    // Then remove links that are no longer wanted.
    let removal = db.from('collection_categories').delete().eq('collection_id', id);
    if (category_ids.length > 0) removal = removal.not('category_id', 'in', `(${category_ids.join(',')})`);
    const { error: removeError } = await removal;
    if (removeError) return serverError(res, 'Could not update the categories.');
  }

  const { data: full, error: readError } = await db
    .from('collections')
    .select(COLLECTION_SELECT)
    .eq('collection_id', id)
    .single();
  if (readError || !full) return serverError(res, 'The collection was updated but could not be read back.');

  return res.status(200).json({ collection: shape(full) });
});

// POST /collections/:id/archive — staff only. Archiving hides a collection from
// the public site but keeps it (and its history) in the database. It does the
// same as PATCH {"status":"archived"}, as a clearly named action. Repeating it is harmless.
router.post('/:id/archive', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = idSchema.safeParse(req.params);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const db = userClient(req.auth!.token);

  const { data: archived, error } = await db
    .from('collections')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('collection_id', parsed.data.id)
    .select(COLLECTION_SELECT)
    .maybeSingle();

  if (error) return serverError(res, 'Could not archive the collection.');
  if (!archived) return notFound(res);
  return res.status(200).json({ collection: shape(archived) });
});

export default router;