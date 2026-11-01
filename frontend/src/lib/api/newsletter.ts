import { authedRequest } from './authed';

/* ── Real backend (openapi.yaml: POST /newsletter/subscribe, GET and DELETE /me/newsletter) ──
 *
 * Own toggle: NEXT_PUBLIC_NEWSLETTER_API_MOCKING=disabled makes the "Email me
 * what's on" boxes on register, checkout and the profile's Settings actually
 * subscribe or unsubscribe the address. Unset, the boxes are cosmetic, as
 * before. Subscribing is best-effort at register and checkout — a failure
 * there never blocks the account or the booking. */

export function newsletterMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_NEWSLETTER_API_MOCKING === 'disabled';
}

/** Subscribes an address. Pass the token when signed in so it links to the account. */
export async function subscribeToNewsletter(email: string, token?: string): Promise<void> {
  await authedRequest('POST', '/newsletter/subscribe', token, { email });
}

/** Same, but never throws — for sign-up and checkout, where it's a side effect. */
export async function subscribeQuietly(email: string, token?: string): Promise<void> {
  try {
    await subscribeToNewsletter(email, token);
  } catch {
    // The account / booking already succeeded; they can subscribe from Settings.
  }
}

/** Whether the signed-in account's address is subscribed. */
export async function getNewsletterStatus(token: string): Promise<boolean> {
  const data = await authedRequest<{ subscribed: boolean }>('GET', '/me/newsletter', token);
  return data.subscribed;
}

export async function unsubscribeFromNewsletter(token: string): Promise<void> {
  await authedRequest('DELETE', '/me/newsletter', token);
}
