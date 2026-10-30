import { apiFetch, apiFetchOptional, shouldMockDirectly } from './client';
import {
  resolveCollections,
  resolveCollection,
  resolveCollectionItems,
  resolveCollectionItem,
  resolveCategories,
} from '@/mocks/resolve';

/** Matches backend/src/routes/collections.ts + categories.ts (openapi.yaml).
 *  Own toggle: NEXT_PUBLIC_COLLECTIONS_API_MOCKING. Items stay mock-only — no real /collections/{id}/items endpoint exists. */
export type CollectionStatus = 'draft' | 'published' | 'archived';

export interface LocationRef {
  name: string;
  city: string | null;
}

export interface CategoryRef {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  status: CollectionStatus;
  featured: boolean;
  location: LocationRef | null;
  categories: CategoryRef[];
  /** Cover image, if staff have uploaded one. */
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parentCategoryId: string | null;
  active: boolean;
}

export interface Item {
  id: string;
  name: string;
  period: string;
  /** Approximate date, e.g. "c. 300 BCE". */
  date: string;
  origin: string;
  description: string;
  /** The owning collection's `name` — resolve via `collections.find(c => c.name === item.collection)`. */
  collection: string;
  location: string;
}

/** Matches GET /collections — no server-side category/sort; callers filter/sort client-side. limit caps at 100. */
export interface ListCollectionsQuery {
  q?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface ListCollectionsResult {
  items: Collection[];
  total: number;
  limit: number;
  offset: number;
}

function collectionsMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_COLLECTIONS_API_MOCKING === 'disabled';
}

interface RawCategoryRef {
  category_id: string;
  name: string;
}

interface RawLocationRef {
  name: string;
  city: string | null;
}

interface RawMediaRef {
  media_id: string;
  url: string;
  alt_text: string | null;
}

interface RawCollection {
  collection_id: string;
  name: string;
  description: string | null;
  status: CollectionStatus;
  featured: boolean;
  location: RawLocationRef | null;
  categories: RawCategoryRef[];
  images: RawMediaRef[];
  created_at: string;
  updated_at: string;
}

function mapCollection(raw: RawCollection): Collection {
  return {
    id: raw.collection_id,
    name: raw.name,
    description: raw.description,
    status: raw.status,
    featured: raw.featured,
    location: raw.location,
    categories: raw.categories.map((c) => ({ id: c.category_id, name: c.name })),
    image: raw.images[0]?.url,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function queryString(query: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

export async function listCollections(query: ListCollectionsQuery = {}): Promise<ListCollectionsResult> {
  const qs = queryString({ q: query.q, featured: query.featured, limit: query.limit, offset: query.offset });
  if (collectionsMockingDisabled()) {
    // The real backend — snake_case, needs mapCollection.
    const data = await apiFetch<{ collections: RawCollection[]; total: number; limit: number; offset: number }>(
      `/collections${qs}`,
      { absolute: true },
    );
    return { items: data.collections.map(mapCollection), total: data.total, limit: data.limit, offset: data.offset };
  }
  if (shouldMockDirectly()) return resolveCollections(query);
  // MSW, answering from resolveCollections — already frontend-shaped.
  return apiFetch<ListCollectionsResult>(`/api/collections${qs}`);
}

export async function getCollection(id: string): Promise<Collection | undefined> {
  if (collectionsMockingDisabled()) {
    const data = await apiFetchOptional<{ collection: RawCollection }>(`/collections/${id}`, { absolute: true });
    return data && mapCollection(data.collection);
  }
  if (shouldMockDirectly()) return resolveCollection(id);
  return apiFetchOptional<Collection>(`/api/collections/${id}`);
}

/** Always mocks — no real /collections/{id}/items endpoint yet. */
export async function listCollectionItems(collectionId: string): Promise<Item[]> {
  if (shouldMockDirectly()) return resolveCollectionItems(collectionId);
  return (await apiFetchOptional<Item[]>(`/api/collections/${collectionId}/items`)) ?? [];
}

export async function getCollectionItem(collectionId: string, itemId: string): Promise<Item | undefined> {
  if (shouldMockDirectly()) return resolveCollectionItem(collectionId, itemId);
  return apiFetchOptional<Item>(`/api/collections/${collectionId}/items/${itemId}`);
}

/** GET /categories. topLevel: true = no-parent only; omit for the full list. */
export async function listCategories(topLevel?: boolean): Promise<Category[]> {
  if (collectionsMockingDisabled()) {
    const qs = queryString({ top_level: topLevel === undefined ? undefined : String(topLevel) });
    const data = await apiFetch<{ categories: { category_id: string; name: string; description: string | null; parent_category_id: string | null; active: boolean }[] }>(
      `/categories${qs}`,
      { absolute: true },
    );
    return data.categories.map((c) => ({
      id: c.category_id,
      name: c.name,
      description: c.description,
      parentCategoryId: c.parent_category_id,
      active: c.active,
    }));
  }
  if (shouldMockDirectly()) return resolveCategories();
  // MSW, answering from resolveCategories — already frontend-shaped.
  return apiFetch<Category[]>('/api/categories');
}
