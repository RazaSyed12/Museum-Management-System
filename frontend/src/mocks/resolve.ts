import type {
  Category,
  Collection,
  Item,
  ListCollectionsQuery,
  ListCollectionsResult,
} from '@/lib/api/collections';
import type { MuseumEvent } from '@/lib/api/events';
import type { Booking } from '@/lib/api/bookings';
import type { AuthUser, NewAccountUser, Session } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { collections, items, categories, events, bookings, accounts, type MockAccount } from './data';

/**
 * The actual "answer this query against the fixture" logic for every
 * endpoint documented in backend/API-REQUIREMENTS.md — the one place that
 * logic lives. handlers.ts (the MSW/browser path) and lib/api/client.ts
 * (the server-render path, which never goes through a real network call —
 * see its comment for why) both call these directly, so there's no second
 * copy of the filtering/lookup rules to keep in sync.
 */
export async function resolveCollections(
  query: ListCollectionsQuery = {},
): Promise<ListCollectionsResult> {
  const { q, featured, limit = 20, offset = 0 } = query;
  // Only published collections are public, matching the real endpoint's unauthenticated view.
  let results = collections.filter((c) => c.status === 'published');
  if (q) results = results.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  if (featured !== undefined) results = results.filter((c) => c.featured === featured);
  const total = results.length;
  return { items: results.slice(offset, offset + limit), total, limit, offset };
}

export async function resolveCollection(id: string): Promise<Collection | undefined> {
  return collections.find((c) => c.id === id && c.status === 'published');
}

export async function resolveCollectionItems(collectionId: string): Promise<Item[]> {
  const collection = collections.find((c) => c.id === collectionId);
  return collection ? items.filter((i) => i.collection === collection.name) : [];
}

export async function resolveCollectionItem(
  collectionId: string,
  itemId: string,
): Promise<Item | undefined> {
  const collection = collections.find((c) => c.id === collectionId);
  return collection && items.find((i) => i.id === itemId && i.collection === collection.name);
}

export async function resolveCategories(): Promise<Category[]> {
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

/** Mirrors backend/src/routes/{auth,session}.ts. Tokens are base64 of {sub, email, role, exp} — a toy JWT stand-in. */
interface TokenPayload {
  sub: string;
  email: string;
  role: AuthUser['role'];
  exp: number;
}

const ACCESS_TOKEN_MS = 60 * 60 * 1000; // 1 hour, matches the real backend's comment in session.ts
const REFRESH_TOKEN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function encodeToken(payload: TokenPayload): string {
  return btoa(JSON.stringify(payload));
}

function decodeToken(token: string): TokenPayload | undefined {
  try {
    const payload = JSON.parse(atob(token)) as TokenPayload;
    return payload.exp > Date.now() ? payload : undefined;
  } catch {
    return undefined;
  }
}

function toAuthUser(a: MockAccount): AuthUser {
  return { id: a.id, email: a.email, full_name: a.full_name, role: a.role, onboarding_completed: a.onboardingCompleted };
}

function toNewAccountUser(a: MockAccount): NewAccountUser {
  return { id: a.id, email: a.email, full_name: a.full_name, onboarding_completed: a.onboardingCompleted };
}

function makeSession(a: MockAccount): Session {
  const base = { sub: a.id, email: a.email, role: a.role };
  return {
    access_token: encodeToken({ ...base, exp: Date.now() + ACCESS_TOKEN_MS }),
    refresh_token: encodeToken({ ...base, exp: Date.now() + REFRESH_TOKEN_MS }),
    expires_at: Math.floor((Date.now() + ACCESS_TOKEN_MS) / 1000),
  };
}

function accountFromToken(token: string): MockAccount | undefined {
  const payload = decodeToken(token);
  return payload && accounts.find((a) => a.id === payload.sub);
}

export async function resolveSignUp(input: {
  full_name: string;
  email: string;
  password: string;
}): Promise<{ user: NewAccountUser; session: Session | null }> {
  const email = input.email.trim().toLowerCase();
  if (accounts.some((a) => a.email.toLowerCase() === email))
    throw new ApiError('An account with that email already exists.', 'email_exists', 409);

  const account: MockAccount = {
    id: `u_${Math.random().toString(36).slice(2, 10)}`,
    full_name: input.full_name,
    email: input.email,
    password: input.password,
    role: 'registered',
    onboardingCompleted: false,
    interests: [],
  };
  accounts.push(account);
  // Real endpoint can return session: null (needs confirmation); mock always signs straight in.
  return { user: toNewAccountUser(account), session: makeSession(account) };
}

export async function resolveSignIn(input: { email: string; password: string }): Promise<{ user: AuthUser; session: Session }> {
  const match = accounts.find(
    (a) => a.email.toLowerCase() === input.email.trim().toLowerCase() && a.password === input.password,
  );
  // Same message for "no such user" and "wrong password" on purpose, same as the real endpoint.
  if (!match) throw new ApiError('Incorrect email or password.', 'invalid_credentials', 401);
  return { user: toAuthUser(match), session: makeSession(match) };
}

export async function resolveMe(token: string): Promise<{ user: AuthUser }> {
  const account = accountFromToken(token);
  if (!account) throw new ApiError('Your session has expired. Please sign in again.', 'unauthorized', 401);
  return { user: toAuthUser(account) };
}

export async function resolveRefreshSession(refreshToken: string): Promise<{ session: Session }> {
  const account = accountFromToken(refreshToken);
  if (!account) throw new ApiError('Your session has expired. Please sign in again.', 'invalid_refresh_token', 401);
  return { session: makeSession(account) };
}

export async function resolveSignOut(token: string): Promise<void> {
  // Nothing to revoke here; param stays to match lib/api/auth.ts's real-backend call signature.
  void token;
}

export async function resolveForgotPassword(email: string): Promise<void> {
  // No email service here; same no-op reply regardless of whether the
  // email matches an account, same anti-enumeration behaviour as the real endpoint.
  void email;
}

export async function resolveResetPassword(email: string, newPassword: string): Promise<void> {
  const account = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!account) throw new ApiError('That reset link is invalid or has expired.', 'invalid_reset_token', 401);
  account.password = newPassword;
}
