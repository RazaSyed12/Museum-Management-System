let ready: Promise<void> | undefined;

/**
 * Starts the browser MSW worker exactly once and resolves once it's
 * actively intercepting. lib/api/client.ts awaits this before every
 * client-side fetch, so the first request fired from a mounting component
 * can't race the worker's (async) service-worker registration. A no-op on
 * the server — Server Component fetches are covered by
 * src/instrumentation.ts instead, which starts the Node interceptor.
 */
export function ensureMockingStarted(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (process.env.NEXT_PUBLIC_API_MOCKING === 'disabled') return Promise.resolve();
  if (!ready) {
    ready = import('./browser')
      .then(({ worker }) => worker.start({ onUnhandledFrame: 'bypass' }))
      .then(() => undefined);
  }
  return ready;
}
