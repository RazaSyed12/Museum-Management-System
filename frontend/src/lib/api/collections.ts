import { collections as ALL_COLLECTIONS, items as ALL_ITEMS, categories as ALL_CATEGORIES, type Collection, type Item } from '@/lib/sample-data';
import { mockResolve } from './client';

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

export async function listCollections(query: ListCollectionsQuery = {}): Promise<ListCollectionsResult> {
  const { q, category, sort = 'popular', page = 1, pageSize = 24 } = query;
  let results = ALL_COLLECTIONS;
  if (q) results = results.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  if (category?.length) results = results.filter((c) => category.includes(c.category));
  if (sort === 'az') results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  const total = results.length;
  const start = (page - 1) * pageSize;
  return mockResolve({ items: results.slice(start, start + pageSize), total, page, pageSize });
}

export async function getCollection(id: string): Promise<Collection | undefined> {
  return mockResolve(ALL_COLLECTIONS.find((c) => c.id === id));
}

export async function listCollectionItems(collectionId: string): Promise<Item[]> {
  const collection = ALL_COLLECTIONS.find((c) => c.id === collectionId);
  return mockResolve(collection ? ALL_ITEMS.filter((i) => i.collection === collection.name) : []);
}

export async function getCollectionItem(collectionId: string, itemId: string): Promise<{ collection: Collection; item: Item } | undefined> {
  const collection = ALL_COLLECTIONS.find((c) => c.id === collectionId);
  const item = collection && ALL_ITEMS.find((i) => i.id === itemId && i.collection === collection.name);
  return mockResolve(collection && item ? { collection, item } : undefined);
}

/** GET /categories — staff-managed in the real API; never hard-code this
 *  list at a call site. */
export async function listCategories(): Promise<string[]> {
  return mockResolve(ALL_CATEGORIES);
}
