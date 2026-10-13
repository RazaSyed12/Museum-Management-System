import { collections, events } from '@/lib/sample-data';

/**
 * Site search over the home page's sample data.
 *
 * This is the one place that knows where results come from. When the
 * collections and events endpoints exist, replace `buildIndex()` with a
 * fetch (and make `searchSite` async) — SearchOverlay only consumes the
 * `SearchGroup[]` shape below.
 */
export type SearchKind = 'Collection' | 'Event' | 'Exhibition' | 'Page';

export interface SearchResult {
  id: string;
  kind: SearchKind;
  title: string;
  meta: string;
  /** Screen label understood by `useSiteNav().go` (see lib/nav.ts). */
  route: string;
}

export interface SearchGroup {
  label: 'Collections' | 'Events' | 'Pages';
  results: SearchResult[];
}

export interface SearchOutcome {
  groups: SearchGroup[];
  total: number;
}

export const POPULAR_SEARCHES = ['Dinosaurs', 'Family', 'Tickets', 'Medieval'] as const;

export const QUICK_LINKS = [
  { label: 'Plan your visit', route: 'Visit' },
  { label: 'Opening hours', route: 'Visit' },
  { label: 'Book tickets', route: 'Tickets' },
  { label: 'Accessibility', route: 'Visit' },
] as const;

/** Results shown per group; the count in the live region still reflects every match. */
const PER_GROUP = 3;

const PAGES: SearchResult[] = [
  { id: 'page-visit', kind: 'Page', title: 'Plan your visit', meta: 'Opening hours, tickets and getting here', route: 'Visit' },
  { id: 'page-hours', kind: 'Page', title: 'Opening hours', meta: 'Mon–Fri 10:00–17:30 · Sat–Sun 09:30–18:00', route: 'Visit' },
  { id: 'page-access', kind: 'Page', title: 'Accessibility', meta: 'Step-free throughout · BSL tours on the first Saturday', route: 'Visit' },
  { id: 'page-tickets', kind: 'Page', title: 'Tickets', meta: 'Book general admission and exhibition tickets', route: 'Tickets' },
  { id: 'page-membership', kind: 'Page', title: 'Membership', meta: 'Reduced prices and reserved tickets', route: 'Membership' },
];

function buildIndex(): Record<SearchGroup['label'], SearchResult[]> {
  return {
    Collections: collections.map((c) => ({
      id: `collection-${c.id}`,
      kind: 'Collection' as const,
      title: c.name,
      meta: `${c.category} · ${c.period} · ${c.items} objects`,
      route: 'Collection',
    })),
    Events: events.map((e) => ({
      id: `event-${e.id}`,
      kind: e.id === 'beneath' ? ('Exhibition' as const) : ('Event' as const),
      title: e.title,
      meta: e.id === 'beneath' ? `${e.date} – ${e.endDate} · ${e.location}` : `${e.date} · ${e.location}${e.free ? ' · Free' : ''}`,
      route: 'Event',
    })),
    Pages: PAGES,
  };
}

function matchesTitle(r: SearchResult, tokens: string[]): boolean {
  const title = r.title.toLowerCase();
  return tokens.every((t) => title.includes(t));
}

export function searchSite(query: string): SearchOutcome {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { groups: [], total: 0 };

  const index = buildIndex();
  const groups: SearchGroup[] = [];
  let total = 0;

  (Object.keys(index) as SearchGroup['label'][]).forEach((label) => {
    const hits = index[label]
      .filter((r) => {
        const haystack = `${r.title} ${r.meta} ${r.kind}`.toLowerCase();
        return tokens.every((t) => haystack.includes(t));
      })
      // Title matches first (Array.sort is stable, so ties keep their listed order).
      .sort((a, b) => Number(!matchesTitle(a, tokens)) - Number(!matchesTitle(b, tokens)));
    total += hits.length;
    if (hits.length) groups.push({ label, results: hits.slice(0, PER_GROUP) });
  });

  return { groups, total };
}
