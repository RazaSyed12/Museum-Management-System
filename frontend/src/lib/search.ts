import { listCollections } from '@/lib/api/collections';
import { listEvents } from '@/lib/api/events';

/**
 * Site search over collections and events.
 *
 * Async because it goes through lib/api/* (mocked today, a real fetch once
 * the backend lands) rather than reading a fixture directly — this is the
 * one place that knows where results come from, and `href` is a real path
 * rather than a screen label, so a result can point straight at a specific
 * collection or event instead of its generic listing page.
 */
export type SearchKind = 'Collection' | 'Event' | 'Exhibition' | 'Page';

export interface SearchResult {
  id: string;
  kind: SearchKind;
  title: string;
  meta: string;
  href: string;
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

/** No dedicated "Visit" pages exist yet (opening hours, accessibility, ...),
 *  so those quick links fall back to Home rather than claiming a page that
 *  isn't built — same honesty rule as everywhere else mock data stands in
 *  for something not built yet. */
export const QUICK_LINKS = [
  { label: 'Plan your visit', href: '/' },
  { label: 'Opening hours', href: '/' },
  { label: 'Book tickets', href: '/tickets' },
  { label: 'Accessibility', href: '/' },
] as const;

/** Results shown per group; the count in the live region still reflects every match. */
const PER_GROUP = 3;

const PAGES: SearchResult[] = [
  { id: 'page-visit', kind: 'Page', title: 'Plan your visit', meta: 'Opening hours, tickets and getting here', href: '/' },
  { id: 'page-hours', kind: 'Page', title: 'Opening hours', meta: 'Mon–Fri 10:00–17:30 · Sat–Sun 09:30–18:00', href: '/' },
  { id: 'page-access', kind: 'Page', title: 'Accessibility', meta: 'Step-free throughout · BSL tours on the first Saturday', href: '/' },
  { id: 'page-tickets', kind: 'Page', title: 'Tickets', meta: 'Book general admission and exhibition tickets', href: '/tickets' },
  { id: 'page-membership', kind: 'Page', title: 'Membership', meta: 'Reduced prices and reserved tickets', href: '/membership' },
];

async function buildIndex(): Promise<Record<SearchGroup['label'], SearchResult[]>> {
  const [{ items: collections }, events] = await Promise.all([listCollections({ pageSize: 999 }), listEvents()]);
  return {
    Collections: collections.map((c) => ({
      id: `collection-${c.id}`,
      kind: 'Collection' as const,
      title: c.name,
      meta: `${c.category} · ${c.period} · ${c.items} objects`,
      href: `/collections/${c.id}`,
    })),
    Events: events.map((e) => ({
      id: `event-${e.id}`,
      kind: e.id === 'beneath' ? ('Exhibition' as const) : ('Event' as const),
      title: e.title,
      meta: e.id === 'beneath' ? `${e.date} – ${e.endDate} · ${e.location}` : `${e.date} · ${e.location}${e.free ? ' · Free' : ''}`,
      href: `/events/${e.id}`,
    })),
    Pages: PAGES,
  };
}

function matchesTitle(r: SearchResult, tokens: string[]): boolean {
  const title = r.title.toLowerCase();
  return tokens.every((t) => title.includes(t));
}

export async function searchSite(query: string): Promise<SearchOutcome> {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { groups: [], total: 0 };

  const index = await buildIndex();
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
