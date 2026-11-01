import { listCollections } from '@/lib/api/collections';
import { listEvents } from '@/lib/api/events';
import { searchCatalogue, searchMockingDisabled } from '@/lib/api/search';
import { getToken } from '@/lib/api/authed';

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

/** Quick links shown before the visitor types anything. */
export const QUICK_LINKS = [
  { label: 'Plan your visit', href: '/visit' },
  { label: 'Opening hours', href: '/visit#hours' },
  { label: 'Book tickets', href: '/tickets' },
  { label: 'Accessibility', href: '/visit#accessibility' },
] as const;

/** Results shown per group; the count in the live region still reflects every match. */
const PER_GROUP = 3;

const PAGES: SearchResult[] = [
  { id: 'page-visit', kind: 'Page', title: 'Plan your visit', meta: 'Opening hours, tickets and getting here', href: '/visit' },
  { id: 'page-hours', kind: 'Page', title: 'Opening hours', meta: 'Mon–Fri 10:00–17:30 · Sat–Sun 09:30–18:00', href: '/visit#hours' },
  { id: 'page-access', kind: 'Page', title: 'Accessibility', meta: 'Step-free throughout · BSL tours on the first Saturday', href: '/visit#accessibility' },
  { id: 'page-tickets', kind: 'Page', title: 'Tickets', meta: 'Book general admission and exhibition tickets', href: '/tickets' },
  { id: 'page-membership', kind: 'Page', title: 'Membership', meta: 'Reduced prices and reserved tickets', href: '/membership' },
];

async function buildIndex(): Promise<Record<SearchGroup['label'], SearchResult[]>> {
  const [{ items: collections }, events] = await Promise.all([listCollections({ limit: 100 }), listEvents()]);
  return {
    Collections: collections.map((c) => ({
      id: `collection-${c.id}`,
      kind: 'Collection' as const,
      title: c.name,
      meta: [c.categories.map((cat) => cat.name).join(', '), c.location?.name].filter(Boolean).join(' · '),
      href: `/collections/${c.id}`,
    })),
    Events: events.map((e) => ({
      id: `event-${e.id}`,
      // Spans more than one day — a long-running show rather than a single
      // dated event. Derived from the actual date range, not a hardcoded id.
      kind: e.date !== e.endDate ? ('Exhibition' as const) : ('Event' as const),
      title: e.title,
      meta: e.date !== e.endDate ? `${e.date} – ${e.endDate} · ${e.location}` : `${e.date} · ${e.location}${e.free ? ' · Free' : ''}`,
      href: `/events/${e.id}`,
    })),
    Pages: PAGES,
  };
}

function matchesTitle(r: SearchResult, tokens: string[]): boolean {
  const title = r.title.toLowerCase();
  return tokens.every((t) => title.includes(t));
}

const SEARCH_TIMEZONE = 'Australia/Adelaide'; // matches lib/api/events.ts

function searchDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { timeZone: SEARCH_TIMEZONE, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

/** Real backend: events, collections and collection items come from GET /search;
 *  the site's own pages are still matched locally. Returns undefined if the call
 *  fails, so the caller falls back to the in-browser index. */
async function searchReal(query: string, tokens: string[]): Promise<SearchOutcome | undefined> {
  if (query.trim().length < 2) return { groups: [], total: 0 }; // the backend needs at least 2 characters
  let hits;
  try {
    hits = await searchCatalogue(query, getToken());
  } catch {
    return undefined;
  }
  const collections: SearchResult[] = [
    ...hits.collections.map((c) => ({
      id: `collection-${c.id}`,
      kind: 'Collection' as const,
      title: c.name,
      meta: c.description ?? '',
      href: `/collections/${c.id}`,
    })),
    // Item pages aren't served by the real backend yet, so an object links to its collection.
    ...hits.items.map((i) => ({
      id: `item-${i.id}`,
      kind: 'Collection' as const,
      title: i.name,
      meta: `In ${i.collectionName}`,
      href: `/collections/${i.collectionId}`,
    })),
  ];
  const events: SearchResult[] = hits.events.map((e) => ({
    id: `event-${e.id}`,
    kind: 'Event' as const,
    title: e.name,
    meta: [searchDate(e.startAt), e.location].filter(Boolean).join(' · '),
    href: `/events/${e.id}`,
  }));
  const pages = PAGES.filter((r) => {
    const haystack = `${r.title} ${r.meta} ${r.kind}`.toLowerCase();
    return tokens.every((t) => haystack.includes(t));
  });
  const groups: SearchGroup[] = [];
  let total = 0;
  for (const [label, results] of [['Collections', collections], ['Events', events], ['Pages', pages]] as const) {
    total += results.length;
    if (results.length) groups.push({ label, results: results.slice(0, PER_GROUP) });
  }
  return { groups, total };
}

export async function searchSite(query: string): Promise<SearchOutcome> {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { groups: [], total: 0 };

  if (searchMockingDisabled()) {
    const real = await searchReal(query, tokens);
    if (real) return real;
  }

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
