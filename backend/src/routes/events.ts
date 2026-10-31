import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { replaceLinks, allCategoriesActive } from '../lib/links';
import { requireAuth, requireStaff, requireAdminOrManager } from '../middleware/auth';

const router = Router();

// What the site needs about an event. The embedded bits follow the foreign
// keys: locations(...) is the venue, event_categories -> categories(...) its
// tags, event_collections -> collections(...) the collections it showcases.
// RLS also applies to the embedded rows, so a guest never receives an
// inactive category or a draft collection here.
export const EVENT_SELECT =
  'event_id, name, description, start_at, end_at, status, ticket_price, price_member, price_child, event_type, ' +
  'cancellation_reason, capacity, location_id, created_at, updated_at, ' +
  'locations(name, city), event_categories(categories(category_id, name)), ' +
  'event_collections(collections(collection_id, name))';

function badRequest(res: Response, message: string, code = 'validation_error') {
  return res.status(400).json({ error: { message, code } });
}

function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}

function notFound(res: Response) {
  return res.status(404).json({ error: { message: 'Event not found.', code: 'not_found' } });
}

// Turns the database row into the shape the frontend wants:
// one "location" object and flat "categories" / "collections" lists.
export function shape(row: any) {
  const { locations, event_categories, event_collections, ...rest } = row;
  // "Completed" is derived, never stored: a scheduled event whose end_at has
  // passed reads as completed without needing a fourth persisted status.
  const display_status = rest.status === 'scheduled' && new Date(rest.end_at) <= new Date() ? 'completed' : rest.status;
  return {
    ...rest,
    display_status,
    location: locations ?? null,
    categories: (event_categories ?? []).map((link: any) => link.categories).filter(Boolean),
    collections: (event_collections ?? []).map((link: any) => link.collections).filter(Boolean),
  };
}

// Postgres error codes worth explaining instead of a blanket 500:
// 23503 = foreign key (unknown location or collection), 23514 = CHECK
// constraint (in practice: end_at not after start_at).
function badWriteMessage(error: { code?: string; message?: string }): string | null {
  if (error.code === '23503') return 'The location or one of the collections does not exist.';
  if (error.code === '23514') {
    if (error.message?.includes('capacity_below_allocations')) {
      return 'The capacity cannot be lower than the tickets already allocated to this event. Reduce the allocations first.';
    }
    return 'The event must end after it starts, and price and capacity cannot be negative.';
  }
  return null;
}

// ISO 8601 with a timezone, e.g. "2026-11-14T18:00:00+10:30" or "...Z".
// Requiring the offset avoids guessing which timezone a bare time meant.
const isoDateTime = z.iso.datetime({ offset: true, message: 'Use an ISO date-time with a timezone, e.g. 2026-11-14T18:00:00+10:30' });

// ---------------------------------------------------------------------------
// GET /events — public list.
// ---------------------------------------------------------------------------

const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  when: z.enum(['upcoming', 'past', 'all']).default('upcoming'),
  category_id: z.guid('category_id must be a valid UUID').optional(),
  collection_id: z.guid('collection_id must be a valid UUID').optional(),
  status: z.enum(['draft', 'scheduled', 'cancelled']).optional(),
  type: z.string().trim().max(100).optional(),
  // Arbitrary overlap window, independent of `when`: an event matches if its
  // [start_at, end_at] range overlaps [date_from, date_to]. Either bound can
  // be omitted. Combine with `when` at your own risk — they both apply (AND).
  date_from: isoDateTime.optional(),
  date_to: isoDateTime.optional(),
  sort: z.enum(['start_at', 'newest', 'oldest']).default('start_at'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// The event ids linked to something, read from a link table
// (e.g. every event_id in event_categories with one of these category ids).
async function eventIdsLinkedTo(db: SupabaseClient, table: string, column: string, values: string[]) {
  const { data, error } = await db.from(table).select('event_id').in(column, values);
  if (error) return null;
  return [...new Set((data ?? []).map((row: any) => row.event_id as string))];
}

// How many of this event's bookings are about to be cancelled (and, if paid,
// refunded) by the events_cancel_bookings DB trigger the moment its status
// flips to 'cancelled'. Counted just BEFORE that update, not after, since the
// trigger clears pending/confirmed bookings out as part of the same write —
// by the time the update returns there would be nothing left to count. If the
// event is already cancelled, this naturally returns 0: the trigger already
// cleared out everything cancellable the first time it fired.
async function countCancellableBookings(db: SupabaseClient, eventId: string): Promise<number | null> {
  const { count, error } = await db
    .from('bookings')
    .select('booking_id', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .in('booking_status', ['pending', 'confirmed']);
  if (error) return null;
  return count ?? 0;
}

// Without a token, RLS only shows events that aren't drafts (scheduled and
// cancelled ones — a cancelled event's page stays up so people see the
// news). With a staff token, drafts are included too.
//   when=upcoming (default) -> hasn't ended yet, soonest first
//   when=past               -> already ended, most recent first
//   when=all                -> everything, soonest first
// category_id also matches that category's sub-categories, so filtering by
// "Mining & Industry" finds an event tagged only "Gold Rush".
router.get('/', async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { q, when, category_id, collection_id, status, type, date_from, date_to, sort, limit, offset } = parsed.data;

  const db = await readerClient(req, res);
  if (!db) return;

  // Link-table filters are resolved to a list of event ids first. Filtering
  // through the embedded join instead would also trim each event's own
  // "categories" list down to the one being filtered on.
  let onlyIds: string[] | null = null;
  if (category_id) {
    const { data: cats, error } = await db
      .from('categories')
      .select('category_id')
      .or(`category_id.eq.${category_id},parent_category_id.eq.${category_id}`);
    if (error) return serverError(res, 'Could not load events.');
    const ids = await eventIdsLinkedTo(db, 'event_categories', 'category_id', (cats ?? []).map((c: any) => c.category_id));
    if (!ids) return serverError(res, 'Could not load events.');
    onlyIds = ids;
  }
  if (collection_id) {
    const ids = await eventIdsLinkedTo(db, 'event_collections', 'collection_id', [collection_id]);
    if (!ids) return serverError(res, 'Could not load events.');
    onlyIds = onlyIds ? onlyIds.filter((id) => ids.includes(id)) : ids;
  }
  if (onlyIds && onlyIds.length === 0) {
    return res.status(200).json({ events: [], total: 0, limit, offset });
  }

  // sort=start_at (default) keeps the existing when-based direction
  // (soonest first for upcoming/all, most recent first for past).
  // newest/oldest instead sort by when the event was created.
  const orderColumn = sort === 'start_at' ? 'start_at' : 'created_at';
  const orderAscending = sort === 'oldest' ? true : sort === 'newest' ? false : when !== 'past';

  let query = db
    .from('events')
    .select(EVENT_SELECT, { count: 'exact' })
    .order(orderColumn, { ascending: orderAscending })
    .range(offset, offset + limit - 1);

  const now = new Date().toISOString();
  if (when === 'upcoming') query = query.gte('end_at', now);
  if (when === 'past') query = query.lt('end_at', now);
  if (q) query = query.ilike('name', `%${q}%`);
  if (status) query = query.eq('status', status);
  if (type) query = query.eq('event_type', type);
  if (date_from) query = query.gte('end_at', date_from);
  if (date_to) query = query.lte('start_at', date_to);
  if (onlyIds) query = query.in('event_id', onlyIds);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load events.');

  return res.status(200).json({
    events: (data ?? []).map(shape),
    total: count ?? 0,
    limit,
    offset,
  });
});

// ---------------------------------------------------------------------------
// GET /events/:id — public. A draft looks exactly like a missing event (404)
// to anyone who isn't staff.
// ---------------------------------------------------------------------------

const idSchema = z.object({ id: z.guid('Event id must be a valid UUID') });

router.get('/:id', async (req: Request, res: Response) => {
  const parsed = idSchema.safeParse(req.params);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const db = await readerClient(req, res);
  if (!db) return;

  const { data, error } = await db
    .from('events')
    .select(EVENT_SELECT)
    .eq('event_id', parsed.data.id)
    .maybeSingle();

  if (error) return serverError(res, 'Could not load the event.');
  if (!data) return notFound(res);
  return res.status(200).json({ event: shape(data) });
});

// ---------------------------------------------------------------------------
// POST /events — staff only.
// ---------------------------------------------------------------------------

// Every event needs at least one category: recommendations match a user's
// onboarding picks against event categories, so an untagged event could
// never be recommended to anyone. New events start as drafts (hidden from
// the public) unless staff publish straight away with status "scheduled".
const createSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    description: z.string().trim().max(5000).nullish(),
    start_at: isoDateTime,
    end_at: isoDateTime,
    status: z.enum(['draft', 'scheduled']).default('draft'),
    location_id: z.guid().nullish(),
    event_type: z.string().trim().max(100).nullish(),
    ticket_price: z.number().min(0, 'Ticket price cannot be negative').max(99999999.99).default(0),
    // Null = that tier isn't offered for this event — not "same as general", not "free".
    price_member: z.number().min(0, 'Member price cannot be negative').max(99999999.99).nullish(),
    price_child: z.number().min(0, 'Child price cannot be negative').max(99999999.99).nullish(),
    capacity: z.number().int('Capacity must be a whole number').min(0, 'Capacity cannot be negative'),
    category_ids: z.array(z.guid()).min(1, 'Pick at least one category').max(20),
    collection_ids: z.array(z.guid()).max(20).default([]),
  })
  .refine((body) => new Date(body.end_at) > new Date(body.start_at), {
    message: 'The event must end after it starts',
    path: ['end_at'],
  });

// The login check (requireAuth) and role check (requireStaff) run first. The
// writes then run AS the staff member, so the database's own staff-only RLS
// rules are a second lock behind the code check.
router.post('/', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { category_ids, collection_ids, ...fields } = parsed.data;
  const categoryIds = [...new Set(category_ids)];
  const collectionIds = [...new Set(collection_ids)];
  const auth = req.auth!;
  const db = userClient(auth.token);

  const categoriesOk = await allCategoriesActive(db, categoryIds);
  if (categoriesOk === null) return serverError(res, 'Could not create the event.');
  if (!categoriesOk) return badRequest(res, 'One or more categories do not exist or are deactivated.', 'invalid_category');

  const { data: created, error } = await db
    .from('events')
    .insert({ ...fields, created_by: auth.userId })
    .select('event_id')
    .single();

  if (error || !created) {
    const message = error && badWriteMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not create the event.');
  }
  const id = created.event_id;

  const linkError =
    (await replaceLinks(db, 'event_categories', 'event_id', id, 'category_id', categoryIds)) ??
    (await replaceLinks(db, 'event_collections', 'event_id', id, 'collection_id', collectionIds));
  if (linkError) {
    // Undo the half-finished create so no event is left without its links.
    // Deleting the event also removes any links already added (on delete cascade).
    await db.from('events').delete().eq('event_id', id);
    const message = badWriteMessage(linkError);
    return message ? badRequest(res, message) : serverError(res, 'Could not create the event.');
  }

  // Re-read it so the reply has the same shape as GET /events/:id.
  const { data: full, error: readError } = await db.from('events').select(EVENT_SELECT).eq('event_id', id).single();
  if (readError || !full) return serverError(res, 'The event was created but could not be read back.');

  return res.status(201).json({ event: shape(full) });
});

// ---------------------------------------------------------------------------
// PATCH /events/:id — staff only. Changes only the fields that are sent.
// ---------------------------------------------------------------------------

// Every field is optional and has NO default, so fields left out are left
// alone. category_ids / collection_ids, if sent, REPLACE the whole list —
// and category_ids still needs at least one entry.
const updateSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(200).optional(),
    description: z.string().trim().max(5000).nullish(),
    start_at: isoDateTime.optional(),
    end_at: isoDateTime.optional(),
    status: z.enum(['draft', 'scheduled', 'cancelled']).optional(),
    location_id: z.guid().nullish(),
    event_type: z.string().trim().max(100).nullish(),
    ticket_price: z.number().min(0, 'Ticket price cannot be negative').max(99999999.99).optional(),
    price_member: z.number().min(0, 'Member price cannot be negative').max(99999999.99).nullish(),
    price_child: z.number().min(0, 'Child price cannot be negative').max(99999999.99).nullish(),
    capacity: z.number().int('Capacity must be a whole number').min(0, 'Capacity cannot be negative').optional(),
    cancellation_reason: z.string().trim().max(2000).nullish(),
    category_ids: z.array(z.guid()).min(1, 'An event needs at least one category').max(20).optional(),
    collection_ids: z.array(z.guid()).max(20).optional(),
  })
  .refine((body) => Object.keys(body).length > 0, { message: 'Send at least one field to update' })
  .refine((body) => !body.start_at || !body.end_at || new Date(body.end_at) > new Date(body.start_at), {
    message: 'The event must end after it starts',
    path: ['end_at'],
  });

router.patch('/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const idParsed = idSchema.safeParse(req.params);
  if (!idParsed.success) return badRequest(res, idParsed.error.issues[0].message);
  const id = idParsed.data.id;
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const isCancelling = parsed.data.status === 'cancelled';
  if (isCancelling) {
    const tier = req.auth!.tier;
    if (tier !== 'admin' && tier !== 'manager') {
      return res.status(403).json({
        error: { message: 'Cancelling an event requires an admin or manager tier.', code: 'forbidden' },
      });
    }
  }

  const { category_ids, collection_ids, ...fields } = parsed.data;
  const db = userClient(req.auth!.token);

  if (category_ids) {
    const categoriesOk = await allCategoriesActive(db, [...new Set(category_ids)]);
    if (categoriesOk === null) return serverError(res, 'Could not update the event.');
    if (!categoriesOk) return badRequest(res, 'One or more categories do not exist or are deactivated.', 'invalid_category');
  }

  // Counted BEFORE the update below, which (if this is cancelling the event)
  // is the same write that fires the DB trigger clearing these bookings out —
  // see countCancellableBookings.
  let affectedBookings: number | null = null;
  if (isCancelling) {
    affectedBookings = await countCancellableBookings(db, id);
    if (affectedBookings === null) return serverError(res, 'Could not update the event.');
  }

  // updated_at is not maintained by a database trigger, so we set it here.
  // If only one of start_at / end_at is sent, the database's own
  // end-after-start CHECK compares it against the stored other one.
  const { data: updated, error } = await db
    .from('events')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('event_id', id)
    .select('event_id')
    .maybeSingle();

  if (error) {
    const message = badWriteMessage(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not update the event.');
  }
  if (!updated) return notFound(res);

  const linkError =
    (category_ids && (await replaceLinks(db, 'event_categories', 'event_id', id, 'category_id', [...new Set(category_ids)]))) ||
    (collection_ids && (await replaceLinks(db, 'event_collections', 'event_id', id, 'collection_id', [...new Set(collection_ids)])));
  if (linkError) {
    const message = badWriteMessage(linkError);
    return message ? badRequest(res, message) : serverError(res, 'Could not update the event\'s links.');
  }

  const { data: full, error: readError } = await db.from('events').select(EVENT_SELECT).eq('event_id', id).single();
  if (readError || !full) return serverError(res, 'The event was updated but could not be read back.');

  return res.status(200).json({
    event: shape(full),
    ...(affectedBookings !== null ? { affected_bookings: affectedBookings } : {}),
  });
});

// ---------------------------------------------------------------------------
// POST /events/:id/cancel — admin/manager only. Same as PATCH
// {"status":"cancelled"}, as a clearly named action, with an optional
// cancellation reason. The event stays visible to the public, marked
// cancelled, so anyone who planned to go sees the news. Repeating it is
// harmless (and reports 0 affected_bookings the second time, since the
// trigger already cleared them out on the first call).
//
// The event itself cancels, and every one of its pending/confirmed bookings
// is cancelled and (if paid) refunded automatically by the events_cancel_bookings
// DB trigger — see the cancellation_reason column's migration for context.
// This response's affected_bookings tells the caller how many that was.
// ---------------------------------------------------------------------------

const cancelEventSchema = z.object({
  reason: z.string().trim().max(2000).nullish(),
});

router.post('/:id/cancel', requireAuth, requireStaff, requireAdminOrManager, async (req: Request, res: Response) => {
  const parsed = idSchema.safeParse(req.params);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const bodyParsed = cancelEventSchema.safeParse(req.body ?? {});
  if (!bodyParsed.success) return badRequest(res, bodyParsed.error.issues[0].message);
  const id = parsed.data.id;
  const db = userClient(req.auth!.token);

  const affectedBookings = await countCancellableBookings(db, id);
  if (affectedBookings === null) return serverError(res, 'Could not cancel the event.');

  // A reason sent here only overwrites what's stored if it's actually given,
  // so repeating the call with no body doesn't blank out an earlier reason.
  const update: Record<string, unknown> = { status: 'cancelled', updated_at: new Date().toISOString() };
  if (bodyParsed.data.reason !== undefined && bodyParsed.data.reason !== null) {
    update.cancellation_reason = bodyParsed.data.reason;
  }

  const { data: cancelled, error } = await db
    .from('events')
    .update(update)
    .eq('event_id', id)
    .select(EVENT_SELECT)
    .maybeSingle();

  if (error) return serverError(res, 'Could not cancel the event.');
  if (!cancelled) return notFound(res);
  return res.status(200).json({ event: shape(cancelled), affected_bookings: affectedBookings });
});

export default router;
