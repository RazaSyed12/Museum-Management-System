import type { Collection, Item, ListCollectionsQuery, ListCollectionsResult } from '@/lib/api/collections';
import type { MuseumEvent } from '@/lib/api/events';
import type { Booking } from '@/lib/api/bookings';
import { collections, items, categories, events, bookings } from './data';

/**
 * The actual "answer this query against the fixture" logic for every
 * endpoint documented in backend/API-REQUIREMENTS.md — the one place that
 * logic lives. handlers.ts (the MSW/browser path) and lib/api/client.ts
 * (the server-render path, which never goes through a real network call —
 * see its comment for why) both call these directly, so there's no second
 * copy of the filtering/lookup rules to keep in sync.
 */
export async function resolveCollections(query: ListCollectionsQuery = {}): Promise<ListCollectionsResult> {
  const { q, category, sort = 'popular', page = 1, pageSize = 24 } = query;
  let results = collections;
  if (q) results = results.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  if (category?.length) results = results.filter((c) => category.includes(c.category));
  if (sort === 'az') results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  const total = results.length;
  const start = (page - 1) * pageSize;
  return { items: results.slice(start, start + pageSize), total, page, pageSize };
}

export async function resolveCollection(id: string): Promise<Collection | undefined> {
  return collections.find((c) => c.id === id);
}

export async function resolveCollectionItems(collectionId: string): Promise<Item[]> {
  const collection = collections.find((c) => c.id === collectionId);
  return collection ? items.filter((i) => i.collection === collection.name) : [];
}

export async function resolveCollectionItem(collectionId: string, itemId: string): Promise<Item | undefined> {
  const collection = collections.find((c) => c.id === collectionId);
  return collection && items.find((i) => i.id === itemId && i.collection === collection.name);
}

export async function resolveCategories(): Promise<string[]> {
  return categories;
}

export async function resolveEvents(): Promise<MuseumEvent[]> {
  return events;
}

export async function resolveEvent(id: string): Promise<MuseumEvent | undefined> {
  return events.find((e) => e.id === id);
}

export async function resolveBookings(): Promise<Booking[]> {
  return bookings;
}
