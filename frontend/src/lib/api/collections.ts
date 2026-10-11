import { apiFetch, apiFetchOptional, shouldMockDirectly } from './client';
import { resolveCollections, resolveCollection, resolveCollectionItems, resolveCollectionItem, resolveCategories } from '@/mocks/resolve';

export type Tone = 'olive' | 'green' | 'sand' | 'stone';

export interface Collection {
  id: string;
  name: string;
  category: string;
  period: string;
  items: number;
  tone: Tone;
  description: string;
  location: string;
}

export interface Item {
  id: string;
  name: string;
  period: string;
  /** Approximate date, e.g. "c. 300 BCE". */
  date: string;
  origin: string;
  description: string;
  /** The owning collection's `name` (matching the design system's own data
   *  shape) — resolve to a `Collection` with `collections.find(c => c.name === item.collection)`. */
  collection: string;
  location: string;
}

/** Matches GET /collections's query params (backend/API-REQUIREMENTS.md).
 *  `pageSize` is left high by callers that want "everything matching the
 *  filters" rather than a real page — see CollectionsBrowse for why. */
export interface ListCollectionsQuery {
  q?: string;
  category?: string[];
  sort?: 'popular' | 'az';
  page?: number;
  pageSize?: number;
}

export interface ListCollectionsResult {
  items: Collection[];
  total: number;
  page: number;
  pageSize: number;
}

function queryString(query: Record<string, string | number | string[] | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) for (const v of value) params.append(key, v);
    else params.set(key, String(value));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

export async function listCollections(query: ListCollectionsQuery = {}): Promise<ListCollectionsResult> {
  if (shouldMockDirectly()) return resolveCollections(query);
  const qs = queryString({ q: query.q, category: query.category, sort: query.sort, page: query.page, pageSize: query.pageSize });
  return apiFetch<ListCollectionsResult>(`/api/collections${qs}`);
}

export async function getCollection(id: string): Promise<Collection | undefined> {
  if (shouldMockDirectly()) return resolveCollection(id);
  return apiFetchOptional<Collection>(`/api/collections/${id}`);
}

export async function listCollectionItems(collectionId: string): Promise<Item[]> {
  if (shouldMockDirectly()) return resolveCollectionItems(collectionId);
  return (await apiFetchOptional<Item[]>(`/api/collections/${collectionId}/items`)) ?? [];
}

export async function getCollectionItem(collectionId: string, itemId: string): Promise<Item | undefined> {
  if (shouldMockDirectly()) return resolveCollectionItem(collectionId, itemId);
  return apiFetchOptional<Item>(`/api/collections/${collectionId}/items/${itemId}`);
}

/** GET /categories — staff-managed in the real API; never hard-code this
 *  list at a call site. */
export async function listCategories(): Promise<string[]> {
  if (shouldMockDirectly()) return resolveCategories();
  return apiFetch<string[]>('/api/categories');
}
