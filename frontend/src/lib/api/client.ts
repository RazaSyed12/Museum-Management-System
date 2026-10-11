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
function apiUrl(path: string): string {
  if (typeof window !== 'undefined') return path;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return new URL(path, base).toString();
}

export async function apiFetch<T>(path: string): Promise<T> {
  await ensureMockingStarted();
  const res = await fetch(apiUrl(path));
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  return res.json() as Promise<T>;
}

/** Same as apiFetch, but a 404 resolves to undefined instead of throwing —
 *  for single-resource lookups the caller treats as "might not exist"
 *  (collection/item by id) rather than an error. */
export async function apiFetchOptional<T>(path: string): Promise<T | undefined> {
  await ensureMockingStarted();
  const res = await fetch(apiUrl(path));
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  return res.json() as Promise<T>;
}
