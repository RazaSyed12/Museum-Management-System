import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff, requireAdminOrManager } from '../middleware/auth';

const router = Router();

// What the public site needs about a collection. The embedded bits
// follow the foreign keys: locations(...) is the collection's location,
// collection_categories -> categories(...) is its category list,
// collection_media -> media(...) its photos (sorted in shape(), not by Postgres).
export const COLLECTION_SELECT =
  'collection_id, name, description, status, featured, location_id, historical_period, catalogue_total, created_at, updated_at, ' +
  'locations(name, city), collection_categories(categories(category_id, name)), ' +
  'collection_media(sort_order, media(media_id, url, alt_text))';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}

function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}

// Turns the database row into the shape the frontend wants:
// one "location" object and a flat "categories" list.
export function shape(row: any) {
  const { locations, collection_categories, collection_media, ...rest } = row;
  return {
    ...rest,
    location: locations ?? null,
    categories: (collection_categories ?? [])
      .map((link: any) => link.categories)
      .filter(Boolean),
    images: (collection_media ?? [])
      .slice()
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((link: any) => link.media)
      .filter(Boolean),
  };
}

const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  featured: z.enum(['true', 'false']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  category_id: z.guid('category_id must be a valid UUID').optional(),
  sort: z.enum(['name', 'newest', 'oldest', 'updated']).default('name'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// The collection ids linked to one of the given category ids, read from the
// link table (mirrors eventIdsLinkedTo in routes/events.ts).
async function collectionIdsLinkedTo(db: SupabaseClient, categoryIds: string[]) {
  const { data, error } = await db.from('collection_categories').select('collection_id').in('category_id', categoryIds);
  if (error) return null;
  return [...new Set((data ?? []).map((row: any) => row.collection_id as string))];
}

// GET /collections — public. Without a token, row-level security only lets the
// anonymous role see rows with status = 'published'. With a staff token the
// same query also returns drafts and archived collections. ?status= on top of
// that further narrows within whatever RLS already allows (so a guest asking
// for ?status=draft just gets zero rows, not an error). ?category_id= also
// matches that category's sub-categories, same convention as GET /events.
router.get('/', async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { q, featured, status, category_id, sort, limit, offset } = parsed.data;

  const db = await readerClient(req, res);
  if (!db) return;

  let onlyIds: string[] | null = null;
  if (category_id) {
    const { data: cats, error } = await db
      .from('categories')
      .select('category_id')
      .or(`category_id.eq.${category_id},parent_category_id.eq.${category_id}`);
    if (error) return serverError(res, 'Could not load collections.');
    const ids = await collectionIdsLinkedTo(db, (cats ?? []).map((c: any) => c.category_id));
    if (!ids) return serverError(res, 'Could not load collections.');
    onlyIds = ids;
  }
  if (onlyIds && onlyIds.length === 0) {
    return res.status(200).json({ collections: [], total: 0, limit, offset });
  }

  const sortColumn = { name: 'name', newest: 'created_at', oldest: 'created_at', updated: 'updated_at' }[sort];
  const sortAscending = sort === 'name' || sort === 'oldest';

  let query = db
    .from('collections')
    .select(COLLECTION_SELECT, { count: 'exact' })
    .order(sortColumn, { ascending: sortAscending })
    .range(offset, offset + limit - 1);

  if (q) query = query.ilike('name', `%${q}%`);
  if (featured) query = query.eq('featured', featured === 'true');
  if (status) query = query.eq('status', status);
  if (onlyIds) query = query.in('collection_id', onlyIds);

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
  historical_period: z.string().trim().max(150).nullish(),
  // Full physical object count, including objects never individually digitised.
  // Independent of collection_items — never derived from it.
  catalogue_total: z.number().int().min(0).nullish(),
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
    historical_period: z.string().trim().max(150).nullish(),
    catalogue_total: z.number().int().min(0).nullish(),
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

  if (parsed.data.status === 'archived') {
    const tier = req.auth!.tier;
    if (tier !== 'admin' && tier !== 'manager') {
      return res.status(403).json({
        error: { message: 'Archiving a collection requires an admin or manager tier.', code: 'forbidden' },
      });
    }
  }

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

  // The row update above already committed, so from here on a category-link
  // failure is a PARTIAL update, not a failed request — the collection's own
  // fields are saved either way. Rather than returning a 4xx/5xx that would
  // wrongly suggest nothing was saved, record what went wrong and report it
  // alongside the (successfully) updated collection. Documented recovery:
  // the caller can resend PATCH with just category_ids to retry.
  let categoriesError: { code: string; message: string } | null = null;
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
        categoriesError = isBadReference(addError)
          ? { code: 'invalid_category', message: 'One of the categories does not exist.' }
          : { code: 'server_error', message: 'Could not update the categories.' };
      }
    }
    // Only remove old links if the add step (if any) succeeded — otherwise we'd
    // be removing links on top of an already-failed, half-applied add.
    if (!categoriesError) {
      let removal = db.from('collection_categories').delete().eq('collection_id', id);
      if (category_ids.length > 0) removal = removal.not('category_id', 'in', `(${category_ids.join(',')})`);
      const { error: removeError } = await removal;
      if (removeError) categoriesError = { code: 'server_error', message: 'Could not update the categories.' };
    }
  }

  const { data: full, error: readError } = await db
    .from('collections')
    .select(COLLECTION_SELECT)
    .eq('collection_id', id)
    .single();
  if (readError || !full) return serverError(res, 'The collection was updated but could not be read back.');

  if (categoriesError) {
    // 207: the collection itself saved fine; only the category sync failed.
    return res.status(207).json({ collection: shape(full), categories_error: categoriesError });
  }
  return res.status(200).json({ collection: shape(full) });
});

// POST /collections/:id/archive — admin/manager only. Archiving hides a collection from
// the public site but keeps it (and its history) in the database. It does the
// same as PATCH {"status":"archived"}, as a clearly named action. Repeating it is harmless.
router.post('/:id/archive', requireAuth, requireStaff, requireAdminOrManager, async (req: Request, res: Response) => {
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