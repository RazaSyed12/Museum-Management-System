/**
 * The API boundary — see backend/API-REQUIREMENTS.md for the shapes every
 * function in lib/api/* calls against.
 *
 * Client-side, every call is a real `fetch` against the documented path;
 * MSW's browser worker (src/mocks/browser.ts) intercepts it and answers
 * from fixture data today. Server-side (Server Components, both at
 * request time and at build time) there's no fetch at all while mocking
 * is enabled — see shouldMockDirectly below for why — so each lib/api/*
 * function branches to call src/mocks/resolve.ts directly instead.
 *
 * Migrating to a real backend: point NEXT_PUBLIC_API_BASE_URL at it, set
 * NEXT_PUBLIC_API_MOCKING=disabled, delete src/mocks/*. No call site
 * outside lib/api/* changes either way.
 */
import { ensureMockingStarted } from '@/mocks/init';

/**
 * True when a lib/api/* function should skip the network and read
 * src/mocks/resolve.ts directly. Only ever true server-side: Next.js's
 * own fetch patching for its Data Cache conflicts with MSW's Node
 * interceptor unreliably enough (confirmed by hand — it intercepts some
 * server-rendered requests and not others, including during
 * generateStaticParams/build-time rendering) that depending on it for SSR
 * isn't safe. The browser's MSW worker doesn't have this problem, so
 * client-side code always takes the real `fetch` path below.
 */
export function shouldMockDirectly(): boolean {
  return typeof window === 'undefined' && process.env.NEXT_PUBLIC_API_MOCKING !== 'disabled';
}

/** Browser fetches resolve relative URLs against the page's own origin;
 *  Node's fetch (the real-backend server-side case) has no such origin to
 *  resolve against and throws on a bare path, so it needs an absolute URL. */
export function apiUrl(path: string): string {
  if (typeof window !== 'undefined') return path;
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000';
  return new URL(path, base).toString();
}

/** Always resolves against NEXT_PUBLIC_API_BASE_URL, even client-side —
 *  bypasses MSW (still running for other, still-mocked resources). */
export function apiUrlAbsolute(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  return new URL(path, base).toString();
}

export async function apiFetch<T>(path: string, opts?: { absolute?: boolean }): Promise<T> {
  await ensureMockingStarted();
  const res = await fetch(opts?.absolute ? apiUrlAbsolute(path) : apiUrl(path));
  if (!res.ok) {
    const { message, code } = await parseErrorBody(res);
    throw new ApiError(message, code, res.status);
  }
  return res.json() as Promise<T>;
}

/** Same as apiFetch, but a 404 resolves to undefined instead of throwing —
 *  for single-resource lookups the caller treats as "might not exist"
 *  (collection/item by id) rather than an error. */
export async function apiFetchOptional<T>(
  path: string,
  opts?: { absolute?: boolean },
): Promise<T | undefined> {
  await ensureMockingStarted();
  const res = await fetch(opts?.absolute ? apiUrlAbsolute(path) : apiUrl(path));
  if (res.status === 404) return undefined;
  if (!res.ok) {
    const { message, code } = await parseErrorBody(res);
    throw new ApiError(message, code, res.status);
  }
  return res.json() as Promise<T>;
}

/** Carries backend/src/routes/*'s {"error":{"message","code"}} shape through,
 *  so UI can key off `code` (e.g. "session_expired") not just `message`. */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseErrorBody(res: Response): Promise<{ message: string; code: string }> {
  const body = (await res.json().catch(() => ({}))) as {
    error?: { message?: string; code?: string };
  };
  return {
    message: body.error?.message ?? `${res.status} ${res.statusText}`,
    code: body.error?.code ?? 'unknown_error',
  };
}

/** POST with a JSON body, no auth required. `absolute: true` targets the real backend (see apiUrlAbsolute). */
export async function apiPost<T>(
  path: string,
  body: unknown,
  opts?: { absolute?: boolean },
): Promise<T> {
  if (!opts?.absolute) await ensureMockingStarted();
  const res = await fetch(opts?.absolute ? apiUrlAbsolute(path) : apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const { message, code } = await parseErrorBody(res);
    throw new ApiError(message, code, res.status);
  }
  return res.json() as Promise<T>;
}

/** GET with "Authorization: Bearer <token>" — /auth/me and anything else
 *  behind requireAuth. */
export async function apiGetAuthed<T>(
  path: string,
  token: string,
  opts?: { absolute?: boolean },
): Promise<T> {
  if (!opts?.absolute) await ensureMockingStarted();
  const res = await fetch(opts?.absolute ? apiUrlAbsolute(path) : apiUrl(path), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const { message, code } = await parseErrorBody(res);
    throw new ApiError(message, code, res.status);
  }
  return res.json() as Promise<T>;
}

/** POST with "Authorization: Bearer <token>" — /auth/sign-out. */
export async function apiPostAuthed<T>(
  path: string,
  token: string,
  body?: unknown,
  opts?: { absolute?: boolean },
): Promise<T> {
  if (!opts?.absolute) await ensureMockingStarted();
  const res = await fetch(opts?.absolute ? apiUrlAbsolute(path) : apiUrl(path), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const { message, code } = await parseErrorBody(res);
    throw new ApiError(message, code, res.status);
  }
  return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>);
}
