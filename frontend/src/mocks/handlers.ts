import { http, HttpResponse, delay } from 'msw';
import { staffHandlers } from './staff';
import {
  resolveCollections,
  resolveCollection,
  resolveCollectionItems,
  resolveCollectionItem,
  resolveCategories,
  resolveEvents,
  resolveEvent,
  resolveBookings,
} from './resolve';

/* MSW handlers — the browser-side half of the mock API (see
   lib/api/client.ts for the server-side half, which calls resolve.ts
   directly rather than going through a fetch MSW can intercept; Next's
   own server-side fetch patching turned out to conflict with MSW's Node
   interceptor too unreliably to depend on). Each handler just translates
   an HTTP request into a resolve.ts call and back — the actual
   filtering/lookup logic lives there, not here. The delay exercises
   loading states the way a real network call would. */
const LATENCY_MS = 300;

function notFound() {
  return new HttpResponse(null, { status: 404 });
}

export const handlers = [
  ...staffHandlers,
  http.get('/api/collections', async ({ request }) => {
    await delay(LATENCY_MS);
    const url = new URL(request.url);
    const result = await resolveCollections({
      q: url.searchParams.get('q') ?? undefined,
      category: url.searchParams.getAll('category'),
      sort: (url.searchParams.get('sort') as 'popular' | 'az' | null) ?? undefined,
      page: Number(url.searchParams.get('page') ?? '1'),
      pageSize: Number(url.searchParams.get('pageSize') ?? '24'),
    });
    return HttpResponse.json(result);
  }),

  http.get('/api/collections/:id/items/:itemId', async ({ params }) => {
    await delay(LATENCY_MS);
    const item = await resolveCollectionItem(params.id as string, params.itemId as string);
    return item ? HttpResponse.json(item) : notFound();
  }),

  http.get('/api/collections/:id/items', async ({ params }) => {
    await delay(LATENCY_MS);
    const collection = await resolveCollection(params.id as string);
    if (!collection) return notFound();
    return HttpResponse.json(await resolveCollectionItems(params.id as string));
  }),

  http.get('/api/collections/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const collection = await resolveCollection(params.id as string);
    return collection ? HttpResponse.json(collection) : notFound();
  }),

  http.get('/api/categories', async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(await resolveCategories());
  }),

  http.get('/api/events/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const event = await resolveEvent(params.id as string);
    return event ? HttpResponse.json(event) : notFound();
  }),

  http.get('/api/events', async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(await resolveEvents());
  }),

  http.get('/api/bookings', async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(await resolveBookings());
  }),
];
