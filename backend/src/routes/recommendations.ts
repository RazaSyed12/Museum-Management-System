import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { readerContext } from '../lib/readerClient';
import { loadPreferences } from '../lib/preferences';
import { EVENT_SELECT, shape as shapeEvent } from './events';
import { COLLECTION_SELECT, shape as shapeCollection } from './collections';

const router = Router();

// How many upcoming events / published collections are considered before
// ranking. A regional museum has tens of each, so this is "all of them" in
// practice; the cap only keeps one request from ever loading thousands.
const CANDIDATE_LIMIT = 200;

// One onboarding pick is worth PICK_POINTS. Browsing history (views, category
// browses, searches, bookings) can add at most HISTORY_CAP to one item, which
// is lower than a single pick, so an explicit pick always beats behaviour.
// The weights of each kind of history live in the database function
// my_category_affinity().
const PICK_POINTS = 10;
const HISTORY_CAP = 9;

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(6),
});

interface Interest {
  category_id: string;
  name: string;
}

interface Affinity {
  name: string;
  weight: number;
}

interface Signals<T> {
  history: Map<string, Affinity>;
  popularity: Map<string, number>;
  idOf: (item: T) => string;
}

/**
 * Maps every category that counts as "something this user likes" to the
 * onboarding pick it counts towards. A pick also covers its active
 * sub-categories: picking "Mining & Industry" makes an event tagged only
 * "Gold Rush" a match, with "Mining & Industry" as the reason shown.
 * Empty for guests and for users with no active picks.
 */
async function loadInterests(db: SupabaseClient, userId: string | null) {
  const picks = userId ? await loadPreferences(db, userId) : [];
  const interests = new Map<string, Interest>(
    picks.map((p) => [p.category_id, { category_id: p.category_id, name: p.name }]),
  );
  if (picks.length === 0) return { picks, interests };

  const { data: children, error } = await db
    .from('categories')
    .select('category_id, parent_category_id')
    .in('parent_category_id', picks.map((p) => p.category_id))
    .eq('active', true);
  if (error) throw error;

  for (const child of children ?? []) {
    // A sub-category the user picked directly keeps its own name as the reason.
    if (!interests.has(child.category_id)) {
      interests.set(child.category_id, interests.get(child.parent_category_id)!);
    }
  }
  return { picks, interests };
}

/**
 * The signed-in user's category scores from their own history (last 90 days).
 * Empty for guests: guests are never tracked.
 */
async function loadHistory(db: SupabaseClient, userId: string | null) {
  const history = new Map<string, Affinity>();
  if (!userId) return history;
  const { data, error } = await db.rpc('my_category_affinity');
  if (error) throw error;
  for (const row of data ?? []) {
    history.set(row.category_id, { name: row.name, weight: Number(row.weight) });
  }
  return history;
}

/**
 * "Most popular" totals for everyone, guests included: tickets booked per
 * event, and views per collection. Totals only, nothing personal.
 */
async function loadPopularity(db: SupabaseClient) {
  const events = new Map<string, number>();
  const collections = new Map<string, number>();
  const { data, error } = await db.rpc('popularity_scores');
  if (error) throw error;
  for (const row of data ?? []) {
    (row.kind === 'event' ? events : collections).set(row.id, Number(row.score));
  }
  return { events, collections };
}

/**
 * Puts the items that match the user's interests first — the more of the
 * user's picks an item matches, the higher it goes; ties keep the incoming
 * order (soonest event / featured collection first). Then fills the rest
 * of the list with the other items in their incoming order, so the row is
 * never empty. Each item gets a "recommendation" saying why it is there.
 *
 * With "signals" (history and popularity) the score is
 *   10 x picks matched + history points (at most 9),
 * ties go to the more popular item, then to the incoming order. The reason
 * is "interest" (a pick matched), else "history", else "popular", else the
 * fallback. Without signals it behaves exactly as before.
 */
function rank<T extends { categories: { category_id: string }[] }>(
  items: T[],
  interests: Map<string, Interest>,
  limit: number,
  fallbackSource: (item: T) => string,
  signals?: Signals<T>,
) {
  const scored = items.map((item, index) => {
    const reasons = new Map<string, Interest>();
    const seen = new Map<string, Interest>();
    let historyPoints = 0;
    for (const c of item.categories) {
      const interest = interests.get(c.category_id);
      if (interest) reasons.set(interest.category_id, interest);
      const past = signals?.history.get(c.category_id);
      if (past) {
        seen.set(c.category_id, { category_id: c.category_id, name: past.name });
        historyPoints += past.weight;
      }
    }
    const pickReasons = [...reasons.values()].sort((a, b) => a.name.localeCompare(b.name));
    const historyReasons = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
    const score = pickReasons.length * PICK_POINTS + Math.min(historyPoints, HISTORY_CAP);
    const popular = signals ? signals.popularity.get(signals.idOf(item)) ?? 0 : 0;
    return { item, index, pickReasons, historyReasons, score, popular };
  });

  const ranked = [...scored].sort(
    (a, b) => b.score - a.score || b.popular - a.popular || a.index - b.index,
  );

  return ranked.slice(0, limit).map(({ item, pickReasons, historyReasons, popular }) => ({
    ...item,
    recommendation:
      pickReasons.length > 0
        ? { source: 'interest', reasons: pickReasons }
        : historyReasons.length > 0
          ? { source: 'history', reasons: historyReasons }
          : popular > 0
            ? { source: 'popular', reasons: [] as Interest[] }
            : { source: fallbackSource(item), reasons: [] as Interest[] },
  }));
}

// GET /recommendations — public. Feeds the "Recommended for you" row on the
// Home page. It never limits what anyone can browse: GET /events and
// GET /collections still list everything for everyone.
//  - Signed in with interest picks -> matching upcoming events and published
//    collections first ("source": "interest", with the picks as reasons),
//    topped up with other upcoming events / featured collections.
//  - Signed in with browsing history (views, category browses, searches,
//    bookings) -> items in those categories rank next ("source": "history").
//  - Guest, or nothing personal -> the most popular items first
//    ("source": "popular", booked events / viewed collections), then the
//    soonest upcoming events and featured collections.
// Only bookable events (status "scheduled", not yet ended) are recommended;
// drafts and cancelled events never are, even for staff.
router.get('/', async (req: Request, res: Response) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: { message: parsed.error.issues[0].message, code: 'validation_error' },
    });
  }
  const { limit } = parsed.data;

  const context = await readerContext(req, res);
  if (!context) return;
  const { db, userId } = context;

  try {
    const { picks, interests } = await loadInterests(db, userId);
    const history = await loadHistory(db, userId);
    const popularity = await loadPopularity(db);

    const [events, collections] = await Promise.all([
      db.from('events')
        .select(EVENT_SELECT)
        .eq('status', 'scheduled')
        .gte('end_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(CANDIDATE_LIMIT),
      db.from('collections')
        .select(COLLECTION_SELECT)
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('name', { ascending: true })
        .limit(CANDIDATE_LIMIT),
    ]);
    if (events.error) throw events.error;
    if (collections.error) throw collections.error;

    return res.status(200).json({
      personalised: interests.size > 0 || history.size > 0,
      interests: picks.map((p) => ({ category_id: p.category_id, name: p.name })),
      events: rank((events.data ?? []).map(shapeEvent), interests, limit, () => 'upcoming', {
        history,
        popularity: popularity.events,
        idOf: (e: any) => e.event_id,
      }),
      collections: rank((collections.data ?? []).map(shapeCollection), interests, limit,
        (c: any) => (c.featured ? 'featured' : 'other'), {
          history,
          popularity: popularity.collections,
          idOf: (c: any) => c.collection_id,
        }),
    });
  } catch {
    return res.status(500).json({
      error: { message: 'Could not load recommendations.', code: 'server_error' },
    });
  }
});

export default router;