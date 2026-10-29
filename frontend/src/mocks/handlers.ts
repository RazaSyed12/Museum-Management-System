import { http, HttpResponse, delay } from 'msw';
import { staffHandlers } from './staff';
import { ApiError } from '@/lib/api/client';
import {
  resolveCollections,
  resolveCollection,
  resolveCollectionItems,
  resolveCollectionItem,
  resolveCategories,
  resolveEvents,
  resolveEvent,
  resolveBookings,
  resolveSignUp,
  resolveSignIn,
  resolveMe,
  resolveRefreshSession,
  resolveSignOut,
  resolveForgotPassword,
  resolveResetPassword,
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

/** Mirrors every backend/src/routes/*.ts error reply: {"error":{"message","code"}}. */
function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return HttpResponse.json({ error: { message: err.message, code: err.code } }, { status: err.status });
  }
  return HttpResponse.json(
    { error: { message: err instanceof Error ? err.message : 'Something went wrong.', code: 'server_error' } },
    { status: 500 },
  );
}

function bearerToken(request: Request): string {
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get('authorization') ?? '');
  if (!match?.[1]) throw new ApiError('Sign in required.', 'unauthorized', 401);
  return match[1].trim();
}

export const handlers = [
  ...staffHandlers,
  http.post('/auth/sign-up', async ({ request }) => {
    await delay(LATENCY_MS);
    try {
      const body = (await request.json()) as { full_name: string; email: string; password: string };
      return HttpResponse.json(await resolveSignUp(body), { status: 201 });
    } catch (err) {
      return errorResponse(err);
    }
  }),

  http.post('/auth/sign-in', async ({ request }) => {
    await delay(LATENCY_MS);
    try {
      const body = (await request.json()) as { email: string; password: string };
      return HttpResponse.json(await resolveSignIn(body));
    } catch (err) {
      return errorResponse(err);
    }
  }),

  http.get('/auth/me', async ({ request }) => {
    await delay(LATENCY_MS);
    try {
      return HttpResponse.json(await resolveMe(bearerToken(request)));
    } catch (err) {
      return errorResponse(err);
    }
  }),

  http.post('/auth/refresh', async ({ request }) => {
    await delay(LATENCY_MS);
    try {
      const { refresh_token } = (await request.json()) as { refresh_token: string };
      return HttpResponse.json(await resolveRefreshSession(refresh_token));
    } catch (err) {
      return errorResponse(err);
    }
  }),

  http.post('/auth/sign-out', async ({ request }) => {
    await delay(LATENCY_MS);
    try {
      await resolveSignOut(bearerToken(request));
      return HttpResponse.json({ message: 'Signed out.' });
    } catch (err) {
      return errorResponse(err);
    }
  }),

  http.post('/auth/forgot-password', async ({ request }) => {
    await delay(LATENCY_MS);
    try {
      const { email } = (await request.json()) as { email: string };
      await resolveForgotPassword(email);
      return HttpResponse.json({ message: 'If an account exists for that email, a password reset link has been sent.' });
    } catch (err) {
      return errorResponse(err);
    }
  }),

  http.post('/auth/reset-password', async ({ request }) => {
    await delay(LATENCY_MS);
    try {
      const { access_token, new_password } = (await request.json()) as { access_token: string; new_password: string };
      await resolveResetPassword(access_token, new_password);
      return HttpResponse.json({ message: 'Password updated. You can now sign in.' });
    } catch (err) {
      return errorResponse(err);
    }
  }),

  http.get('/api/collections', async ({ request }) => {
    await delay(LATENCY_MS);
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    const result = await resolveCollections({
      q: url.searchParams.get('q') ?? undefined,
      featured: featured === null ? undefined : featured === 'true',
      limit: url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : undefined,
      offset: url.searchParams.has('offset') ? Number(url.searchParams.get('offset')) : undefined,
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
