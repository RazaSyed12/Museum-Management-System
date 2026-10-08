/**
 * The mock API boundary — see backend/API-REQUIREMENTS.md for the shapes
 * every function in lib/api/* is matching. Each one is mocked against the
 * static fixtures in lib/sample-data.ts today; swapping a function's body
 * for a real `fetch` call against that same documented shape is meant to be
 * the entire migration for that resource — no call site outside lib/api/*
 * should need to change.
 *
 * Nothing here should be imported directly by a page or component; import
 * the functions from the resource module instead (lib/api/collections.ts,
 * etc).
 */

/** Real requests have latency; resolving mock calls after a short delay
 *  means loading states get exercised now, not only once a real network
 *  is in the picture. */
const MOCK_LATENCY_MS = 300;

export function mockResolve<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}
