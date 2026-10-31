import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff, requireAdminOrManager } from '../middleware/auth';

const router = Router();

// What a hero slide needs for display. The embedded bits follow the
// foreign keys: events(...) and collections(...) are whichever one (if
// any) the slide links to, media(...) is its background image. Embedding
// rather than copying is deliberate — a linked slide's date/location/name
// always reflects the live event/collection instead of going stale,
// exactly like EVENT_SELECT embeds locations(...).
export const HERO_SELECT =
  'slide_id, eyebrow, title, description, primary_label, primary_href, secondary_label, secondary_href, ' +
  'event_id, collection_id, media_id, sort_order, is_active, starts_at, ends_at, created_at, updated_at, ' +
  'events(event_id, name, start_at, end_at, locations(name, city)), ' +
  'collections(collection_id, name, historical_period), ' +
  'media(media_id, url, alt_text)';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}

function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}

function notFound(res: Response) {
  return res.status(404).json({ error: { message: 'Hero slide not found.', code: 'not_found' } });
}

// Turns the database row into the shape the frontend wants: a slide's own
// link column stays (event_id / collection_id), plus the live object it
// points at, named for what it is rather than the raw embed name.
export function shape(row: any) {
  const { events, collections, media, ...rest } = row;
  return {
    ...rest,
    linked_event: events ?? null,
    linked_collection: collections ?? null,
    image: media ?? null,
  };
}

// Postgres error codes worth explaining instead of a blanket 500:
// 23503 = foreign key (unknown event, collection or media), 23514 = one of
// the two CHECK constraints on hero_slides (named, so the constraint name
// comes through in the Postgres error message — same pattern as
// capacity_below_allocations in events.ts).
function badWriteMessage(error: { code?: string; message?: string }): string | null {
  if (error.code === '23503') return 'The linked event, collection or media does not exist.';
  if (error.code === '23514') {
    if (error.message?.includes('hero_slides_single_link_check')) {
      return 'A slide can link to an event or a collection, not both.';
    }
    if (error.message?.includes('hero_slides_schedule_order_check')) {
      return 'ends_at must be after starts_at.';
    }
    return 'One of the values sent is not valid.';
  }
  return null;
}

const isoDateTime = z.iso.datetime({
  offset: true,
  message: 'Use an ISO date-time with a timezone, e.g. 2026-11-14T18:00:00+10:30',
});

// ---------------------------------------------------------------------------
// GET /hero — public. Uses readerClient so RLS does the filtering: an
// anonymous or registered caller gets only active, in-window slides; a
// staff caller (any tier) sees every slide, same as GET /events and
// GET /collections already behave.
// ---------------------------------------------------------------------------

router.get('/', async (req: Request, res: Response) => {
  const db = await readerClient(req, res);
  if (!db) return;

  const { data, error } = await db
    .from('hero_slides')
    .select(HERO_SELECT)
    .order('sort_order', { ascending: true });

  if (error) return serverError(res, 'Could not load hero slides.');
  return res.status(200).json({ slides: (data ?? []).map(shape) });
});

// ---------------------------------------------------------------------------
// POST /hero — staff only (any tier, same as POST /collections).
// ---------------------------------------------------------------------------

const createSchema = z
  .object({
    eyebrow: z.string().trim().max(100).nullish(),
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().trim().max(2000).nullish(),
    primary_label: z.string().trim().max(100).nullish(),
    primary_href: z.string().trim().max(500).nullish(),
    secondary_label: z.string().trim().max(100).nullish(),
    secondary_href: z.string().trim().max(500).nullish(),
    event_id: z.guid().nullish(),
    collection_id: z.guid().nullish(),
    media_id: z.guid().nullish(),
    sort_order: z.number().int().min(0).optional(),
    is_active: z.boolean().default(true),
    starts_at: isoDateTime.nullish(),
    ends_at: isoDateTime.nullish(),
  })
  .refine((body) => !(body.event_id && body.collection_id), {
    message: 'A slide can link to an event or a collection, not both',
    path: ['collection_id'],
  })
  .refine((body) => !body.starts_at || !body.ends_at || new Date(body.ends_at) > new Date(body.starts_at), {
    message: 'ends_at must be after starts_at',
    path: ['ends_at'],
  });

// One past the current highest sort_order, so a new slide with none given
// lands at the end instead of jumping to the front at 0.
async function nextSortOrder(db: SupabaseClient): Promise<number | null> {
  const { data, error } = await db
    .from('hero_slides')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);
  if (error) return null;
  return ((data?.[0]?.sort_order as number | undefined) ?? -1) + 1;
}

// The login check (requireAuth) and role check (requireStaff) run first.
// The insert then runs AS the staff member, so the database's own
// staff-only RLS rule is a second lock behind the code check.
router.post('/', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const auth = req.auth!;
  const db = userClient(auth.token);
  const { sort_order, ...fields } = parsed.data;

  let order = sort_order;
  if (order === undefined) {
    const next = await nextSortOrder(db);
    if (next === null) return serverError(res, 'Could not create the hero slide.');
    order = next;
  }

  const { data: created, error } = await db
    .from('hero_slides')
    .insert({ ...fields, sort_order: order, created_by: auth.userId })
    .select('slide_id')
    .single();

  if (error || !created) {
    const message = error && badWriteMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not create the hero slide.');
  }

  // Re-read it so the reply has the same shape as GET /hero.
  const { data: full, error: readError } = await db
    .from('hero_slides')
    .select(HERO_SELECT)
    .eq('slide_id', created.slide_id)
    .single();
  if (readError || !full) return serverError(res, 'The hero slide was created but could not be read back.');

  return res.status(201).json({ slide: shape(full) });
});

// ---------------------------------------------------------------------------
// PATCH /hero/:id — staff only. Changes only the fields that are sent. This
// endpoint also doubles as the reordering mechanism: staff send
// { sort_order: n } per slide to reorder, no separate endpoint needed.
// ---------------------------------------------------------------------------

const idSchema = z.object({ id: z.guid('Hero slide id must be a valid UUID') });

const updateSchema = z
  .object({
    eyebrow: z.string().trim().max(100).nullish(),
    title: z.string().trim().min(1, 'Title is required').max(200).optional(),
    description: z.string().trim().max(2000).nullish(),
    primary_label: z.string().trim().max(100).nullish(),
    primary_href: z.string().trim().max(500).nullish(),
    secondary_label: z.string().trim().max(100).nullish(),
    secondary_href: z.string().trim().max(500).nullish(),
    event_id: z.guid().nullish(),
    collection_id: z.guid().nullish(),
    media_id: z.guid().nullish(),
    sort_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
    starts_at: isoDateTime.nullish(),
    ends_at: isoDateTime.nullish(),
  })
  .refine((body) => Object.keys(body).length > 0, { message: 'Send at least one field to update' })
  .refine((body) => !(body.event_id && body.collection_id), {
    message: 'A slide can link to an event or a collection, not both',
    path: ['collection_id'],
  })
  // If only one of starts_at / ends_at is sent, the database's own
  // schedule-order CHECK compares it against the stored other one.
  .refine((body) => !body.starts_at || !body.ends_at || new Date(body.ends_at) > new Date(body.starts_at), {
    message: 'ends_at must be after starts_at',
    path: ['ends_at'],
  });

router.patch('/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const idParsed = idSchema.safeParse(req.params);
  if (!idParsed.success) return badRequest(res, idParsed.error.issues[0].message);
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const id = idParsed.data.id;
  const db = userClient(req.auth!.token);

  // updated_at is not maintained by a database trigger, so we set it here.
  const { data: updated, error } = await db
    .from('hero_slides')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('slide_id', id)
    .select('slide_id')
    .maybeSingle();

  if (error) {
    const message = badWriteMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not update the hero slide.');
  }
  if (!updated) return notFound(res);

  const { data: full, error: readError } = await db
    .from('hero_slides')
    .select(HERO_SELECT)
    .eq('slide_id', id)
    .single();
  if (readError || !full) return serverError(res, 'The hero slide was updated but could not be read back.');

  return res.status(200).json({ slide: shape(full) });
});

// ---------------------------------------------------------------------------
// POST /hero/:id/archive — admin/manager only (same tier gate as
// /collections/:id/archive). Sets is_active = false rather than deleting the
// row, so configuration/history isn't lost. Repeating it is harmless.
// ---------------------------------------------------------------------------

router.post('/:id/archive', requireAuth, requireStaff, requireAdminOrManager, async (req: Request, res: Response) => {
  const parsed = idSchema.safeParse(req.params);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const db = userClient(req.auth!.token);

  const { data: archived, error } = await db
    .from('hero_slides')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('slide_id', parsed.data.id)
    .select(HERO_SELECT)
    .maybeSingle();

  if (error) return serverError(res, 'Could not archive the hero slide.');
  if (!archived) return notFound(res);
  return res.status(200).json({ slide: shape(archived) });
});

export default router;
