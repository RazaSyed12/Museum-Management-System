import { authedRequest } from './authed';

/* ── Real backend (openapi.yaml: POST /me/interactions) ──
 *
 * Own toggle: NEXT_PUBLIC_INTERACTIONS_API_MOCKING=disabled records which
 * events and collections a signed-in visitor opens, which the backend uses to
 * rank their recommendations. Unset, nothing is recorded. Guests are never
 * tracked. The backend ignores the same view within 10 minutes, and a failed
 * call is never shown to the visitor. */

export function interactionsMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_INTERACTIONS_API_MOCKING === 'disabled';
}

export type ViewTarget = { eventId: string } | { collectionId: string };

export async function recordView(token: string, target: ViewTarget): Promise<void> {
  const body = 'eventId' in target
    ? { type: 'view', event_id: target.eventId }
    : { type: 'view', collection_id: target.collectionId };
  try {
    await authedRequest('POST', '/me/interactions', token, body);
  } catch {
    // Best-effort: recommendations just have one less signal.
  }
}
