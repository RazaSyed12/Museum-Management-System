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

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(6),
});

interface Interest {
  category_id: string;
  name: string;
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
 * Puts the items that match the user's interests first — the more of the
 * user's picks an item matches, the higher it goes; ties keep the incoming
 * order (soonest event / featured collection first). Then fills the rest
 * of the list with the other items in their incoming order, so the row is
 * never empty. Each item gets a "recommendation" saying why it is there.
 */
function rank<T extends { categories: { category_id: string }[] }>(
  items: T[],
  interests: Map<string, Interest>,
  limit: number,
  fallbackSource: (item: T) => string,
) {
  const scored = items.map((item, index) => {
    const reasons = new Map<string, Interest>();
    for (const c of item.categories) {
      const interest = interests.get(c.category_id);
      if (interest) reasons.set(interest.category_id, interest);
    }
    return { item, index, reasons: [...reasons.values()].sort((a, b) => a.name.localeCompare(b.name)) };
  });

  const matched = scored
    .filter((s) => s.reasons.length > 0)
    .sort((a, b) => b.reasons.length - a.reasons.length || a.index - b.index);
  const others = scored.filter((s) => s.reasons.length === 0);

  return [...matched, ...others].slice(0, limit).map(({ item, reasons }) => ({
    ...item,
    recommendation: reasons.length > 0
      ? { source: 'interest', reasons }
      : { source: fallbackSource(item), reasons: [] as Interest[] },
  }));
}

// GET /recommendations — public. Feeds the "Recommended for you" row on the
// Home page. It never limits what anyone can browse: GET /events and
// GET /collections still list everything for everyone.
//  - Signed in with interest picks -> matching upcoming events and published
//    collections first ("source": "interest", with the picks as reasons),
//    topped up with other upcoming events / featured collections.
//  - Guest, or no picks (e.g. staff) -> the same list without the
//    personal part: soonest upcoming events and featured collections.
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
      personalised: interests.size > 0,
      interests: picks.map((p) => ({ category_id: p.category_id, name: p.name })),
      events: rank((events.data ?? []).map(shapeEvent), interests, limit, () => 'upcoming'),
      collections: rank((collections.data ?? []).map(shapeCollection), interests, limit,
        (c: any) => (c.featured ? 'featured' : 'other')),
    });
  } catch {
    return res.status(500).json({
      error: { message: 'Could not load recommendations.', code: 'server_error' },
    });
  }
});

export default router;
