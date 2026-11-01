import { authedRequest } from './authed';

/* ── Real backend (openapi.yaml: GET /search) ──
 *
 * Own toggle: NEXT_PUBLIC_SEARCH_API_MOCKING=disabled makes the header search
 * ask the backend (events, collections and collection items by name and
 * description). A signed-in visitor's token is sent so the backend can record
 * the search for their recommendations. Unset, the search filters the
 * events and collections already loaded in the browser, as before. If the
 * real call fails the search falls back to that too. */

export function searchMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_SEARCH_API_MOCKING === 'disabled';
}

export interface CatalogueHits {
  events: { id: string; name: string; startAt: string; location?: string }[];
  collections: { id: string; name: string; description?: string }[];
  items: { id: string; name: string; collectionId: string; collectionName: string }[];
}

interface RawSearch {
  events: { event_id: string; name: string; start_at: string; location?: { name?: string } | null }[];
  collections: { collection_id: string; name: string; description: string | null }[];
  items: { item_id: string; name: string; collection_id: string; collection_name: string }[];
}

/** Needs 2–100 characters (the backend rejects shorter text). */
export async function searchCatalogue(query: string, token?: string): Promise<CatalogueHits> {
  const q = encodeURIComponent(query.trim().slice(0, 100));
  const data = await authedRequest<RawSearch>('GET', `/search?q=${q}&limit=20`, token);
  return {
    events: data.events.map((e) => ({ id: e.event_id, name: e.name, startAt: e.start_at, location: e.location?.name })),
    collections: data.collections.map((c) => ({ id: c.collection_id, name: c.name, description: c.description ?? undefined })),
    items: data.items.map((i) => ({ id: i.item_id, name: i.name, collectionId: i.collection_id, collectionName: i.collection_name })),
  };
}
