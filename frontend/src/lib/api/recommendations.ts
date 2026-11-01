import { authedRequest } from './authed';
import type { Tone } from '@/lib/tone';
import { toneForIndex } from '@/lib/tone';

/* ── Real backend (openapi.yaml: GET /recommendations) ──
 *
 * Own toggle: NEXT_PUBLIC_RECOMMENDATIONS_API_MOCKING=disabled makes the
 * homepage "Recommended for you / What other visitors are exploring" row and
 * the profile's "Because of what you've explored" use the backend's ranking
 * (the account's interest picks first, then recent history, then popular).
 * Unset, both keep their fixed editorial examples. */

export function recommendationsMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_RECOMMENDATIONS_API_MOCKING === 'disabled';
}

export interface RailItem {
  key: string;
  title: string;
  kind: 'Event' | 'Collection';
  /** Plain-English reason, shown to signed-in visitors only. */
  reason?: string;
  image?: string;
  tone: Tone;
  href: string;
}

export interface Rail {
  /** True when the list was ranked by the account's own interest picks. */
  personalised: boolean;
  items: RailItem[];
}

interface RawRecommendation {
  source: 'interest' | 'history' | 'popular' | 'upcoming' | 'featured' | 'other';
  reasons: { name: string }[];
}
interface RawEvent {
  event_id: string;
  name: string;
  images?: { url: string }[];
  recommendation: RawRecommendation;
}
interface RawCollection {
  collection_id: string;
  name: string;
  images?: { url: string }[];
  recommendation: RawRecommendation;
}

function reasonFor(r: RawRecommendation): string | undefined {
  switch (r.source) {
    case 'interest': {
      const names = r.reasons.map((x) => x.name);
      return names.length ? `Because you like ${names.slice(0, 2).join(' and ')}` : 'Matches your interests';
    }
    case 'history':
      return 'Similar to what you’ve explored';
    case 'popular':
      return 'Popular with visitors';
    case 'upcoming':
      return 'Coming up soon';
    case 'featured':
      return 'Featured collection';
    default:
      return undefined;
  }
}

/** Events and collections, interleaved so the row mixes both. `perKind` caps
 *  each kind (so 2 gives a row of up to 4). Sends the token when signed in so
 *  the ranking can use the account's picks. */
export async function getRecommendationRail(token: string | undefined, perKind = 2): Promise<Rail> {
  const data = await authedRequest<{ personalised: boolean; events: RawEvent[]; collections: RawCollection[] }>(
    'GET',
    `/recommendations?limit=${perKind}`,
    token,
  );
  const events: RailItem[] = data.events.map((e) => ({
    key: `event-${e.event_id}`,
    title: e.name,
    kind: 'Event',
    reason: reasonFor(e.recommendation),
    image: e.images?.[0]?.url,
    tone: 'green',
    href: `/events/${e.event_id}`,
  }));
  const collections: RailItem[] = data.collections.map((c) => ({
    key: `collection-${c.collection_id}`,
    title: c.name,
    kind: 'Collection',
    reason: reasonFor(c.recommendation),
    image: c.images?.[0]?.url,
    tone: 'olive',
    href: `/collections/${c.collection_id}`,
  }));
  const items: RailItem[] = [];
  for (let i = 0; i < Math.max(events.length, collections.length); i++) {
    if (collections[i]) items.push(collections[i]!);
    if (events[i]) items.push(events[i]!);
  }
  return { personalised: data.personalised, items: items.map((it, i) => ({ ...it, tone: toneForIndex(i) })) };
}
