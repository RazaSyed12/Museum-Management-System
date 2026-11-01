import { authedRequest } from './authed';

/* ── Real backend (openapi.yaml: /categories, /me/preferences, /me/profile) ──
 *
 * Own toggle: NEXT_PUBLIC_PROFILE_API_MOCKING=disabled makes the interests
 * picker, the profile's Interests tab and the Settings name field use the real
 * backend. Unset, interests stay a local list kept in the browser, as before.
 *
 * Interests are the museum's top-level categories (staff-managed), saved by
 * category id; a save replaces the whole set and needs at least one pick. */

export function profileMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_PROFILE_API_MOCKING === 'disabled';
}

export interface InterestOption {
  id: string;
  name: string;
}

interface RawCategory {
  category_id: string;
  name: string;
  active: boolean;
}

/** Top-level categories a visitor can pick as interests, in name order. */
export async function listInterestOptions(): Promise<InterestOption[]> {
  const data = await authedRequest<{ categories: RawCategory[] }>('GET', '/categories?top_level=true', undefined);
  return data.categories
    .filter((c) => c.active)
    .map((c) => ({ id: c.category_id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The signed-in account's saved picks. */
export async function getInterestPicks(token: string): Promise<InterestOption[]> {
  const data = await authedRequest<{ categories: RawCategory[] }>('GET', '/me/preferences', token);
  return data.categories.map((c) => ({ id: c.category_id, name: c.name }));
}

/** Replaces the account's picks (1–20 category ids). */
export async function saveInterestPicks(token: string, categoryIds: string[]): Promise<InterestOption[]> {
  const data = await authedRequest<{ categories: RawCategory[] }>('PUT', '/me/preferences', token, { category_ids: categoryIds });
  return data.categories.map((c) => ({ id: c.category_id, name: c.name }));
}

/** Changes the account's display name. */
export async function saveFullName(token: string, fullName: string): Promise<string> {
  const data = await authedRequest<{ user: { full_name: string } }>('PATCH', '/me/profile', token, { full_name: fullName });
  return data.user.full_name;
}
