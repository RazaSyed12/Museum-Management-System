/**
 * Editorial content that isn't behind a documented endpoint — unlike
 * collections/events/bookings (lib/api/*, mocked via MSW), there's nothing
 * here to swap for a real fetch later. Recommendations are explicitly
 * "open for discussion, not blocking anything yet" per
 * backend/API-REQUIREMENTS.md, and the interest-picker list is static copy,
 * not staff-managed data.
 */
import { collections } from '@/mocks/data';
import type { Tone } from '@/lib/api/collections';

export interface Recommendation {
  title: string;
  kind: string;
  reason: string;
  tone: Tone;
}

export const recommendedForYou: Recommendation[] = [
  {
    title: 'Ice Age Britain',
    kind: 'Collection',
    reason: 'Because you explored Prehistory',
    tone: 'olive',
  },
  {
    title: 'Age of Dinosaurs',
    kind: 'Collection',
    reason: 'Similar to the fossils you viewed',
    tone: 'green',
  },
  {
    title: 'Curator talk: Reading the Lanthorn Hoard',
    kind: 'Event',
    reason: 'Archaeology, near you this month',
    tone: 'stone',
  },
  {
    title: 'Coin & Currency',
    kind: 'Collection',
    reason: 'Often viewed with The Lanthorn Hoard',
    tone: 'sand',
  },
];

export const popularRightNow: Recommendation[] = [
  {
    title: 'The Lanthorn Hoard',
    kind: 'Collection',
    reason: 'Most visited this month',
    tone: 'stone',
  },
  { title: 'Age of Dinosaurs', kind: 'Collection', reason: 'Popular with families', tone: 'green' },
  { title: 'Twilight at the Museum', kind: 'Event', reason: 'Selling quickly', tone: 'olive' },
  { title: 'Medieval Armoury', kind: 'Collection', reason: 'Trending this week', tone: 'sand' },
];

/** Collection recommendations link to the real page now that one exists;
 *  Event recommendations still fall back to RecommendationCard's default
 *  ('#') until Events has its own detail pages. Reaches into the mock
 *  fixture directly (rather than going through lib/api/collections) since
 *  recommendations aren't a real endpoint yet — once they are, the API
 *  response should just include the href/id and this helper goes away. */
export function hrefForRecommendation(r: Recommendation): string | undefined {
  if (r.kind !== 'Collection') return undefined;
  const collection = collections.find((c) => c.name === r.title);
  return collection && `/collections/${collection.id}`;
}

/** The interest-picker's own list (onboarding + profile) — a superset of
 *  the categories list by one ('Natural History' has no collection yet),
 *  kept separate because the two pickers serve different purposes. Static
 *  copy, not staff-managed, so it doesn't go through lib/api/collections'
 *  listCategories(). */
export const interests = [
  'Dinosaurs',
  'Prehistory',
  'Ancient History',
  'Archaeology',
  'Medieval',
  'Renaissance',
  'Art',
  'Natural History',
];
