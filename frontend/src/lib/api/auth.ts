/**
 * Matches backend/src/routes/{auth,session}.ts exactly — one sign-in for
 * every visitor, staff included. `role` on the returned user ('registered'
 * | 'member' | 'staff') is what the frontend branches on after sign-in;
 * there is no separate staff endpoint to call.
 *
 * Paths are NOT under /api — the real backend mounts these at /auth/*
 * directly (see backend/src/index.ts), unlike the /api/* convention the
 * other lib/api/* files use for the mock-only collections/events layer.
 *
 * Auth has its own mocking toggle (NEXT_PUBLIC_AUTH_API_MOCKING), separate
 * from the shared NEXT_PUBLIC_API_MOCKING collections/events/etc. still
 * use — so auth can point at the real backend on its own, before those
 * other resources' schemas are ready to do the same (see the real
 * Collection/Event shapes in openapi.yaml, which don't match the mock
 * fixture's yet). Set to "disabled" once the real backend is reachable.
 * When it is, every call below goes out as an absolute URL
 * (apiUrlAbsolute) rather than a same-origin path — a relative path would
 * still get caught by MSW's browser worker, which keeps running for the
 * resources still on NEXT_PUBLIC_API_MOCKING.
 */
import { apiPost, apiGetAuthed, apiPostAuthed, shouldMockDirectly } from './client';
import {
  resolveSignUp,
  resolveSignIn,
  resolveMe,
  resolveRefreshSession,
  resolveSignOut,
  resolveForgotPassword,
  resolveResetPassword,
} from '@/mocks/resolve';

export type Role = 'registered' | 'member' | 'staff';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  onboarding_completed: boolean;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

/** openapi.yaml's SignUpResponse deliberately has no `role` on `user` — a
 *  fresh sign-up is always 'registered' by definition, so the real backend
 *  doesn't bother sending it. */
export interface NewAccountUser {
  id: string;
  email: string;
  full_name: string;
  onboarding_completed: boolean;
}

function authMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_API_MOCKING === 'disabled';
}

export async function signUp(input: {
  full_name: string;
  email: string;
  password: string;
}): Promise<{ user: NewAccountUser; session: Session | null }> {
  if (authMockingDisabled()) return apiPost('/auth/sign-up', input, { absolute: true });
  if (shouldMockDirectly()) return resolveSignUp(input);
  return apiPost('/auth/sign-up', input);
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; session: Session }> {
  if (authMockingDisabled()) return apiPost('/auth/sign-in', input, { absolute: true });
  if (shouldMockDirectly()) return resolveSignIn(input);
  return apiPost('/auth/sign-in', input);
}

export async function getMe(token: string): Promise<{ user: AuthUser }> {
  if (authMockingDisabled()) return apiGetAuthed('/auth/me', token, { absolute: true });
  if (shouldMockDirectly()) return resolveMe(token);
  return apiGetAuthed('/auth/me', token);
}

export async function refreshSession(refresh_token: string): Promise<{ session: Session }> {
  if (authMockingDisabled()) return apiPost('/auth/refresh', { refresh_token }, { absolute: true });
  if (shouldMockDirectly()) return resolveRefreshSession(refresh_token);
  return apiPost('/auth/refresh', { refresh_token });
}

export async function signOut(token: string): Promise<void> {
  if (authMockingDisabled()) {
    await apiPostAuthed('/auth/sign-out', token, undefined, { absolute: true });
    return;
  }
  if (shouldMockDirectly()) return resolveSignOut(token);
  await apiPostAuthed('/auth/sign-out', token);
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (authMockingDisabled()) {
    await apiPost('/auth/forgot-password', { email }, { absolute: true });
    return;
  }
  if (shouldMockDirectly()) return resolveForgotPassword(email);
  await apiPost('/auth/forgot-password', { email });
}

/** The mock stands in for the emailed link with a plain email lookup (see
 *  mocks/resolve.ts's resolveResetPassword) since there's no email service
 *  to actually send one — the real endpoint expects the access_token from
 *  that link's URL fragment instead (backend/src/routes/session.ts), not
 *  an email address. */
export async function resetPassword(emailOrAccessToken: string, new_password: string): Promise<void> {
  if (authMockingDisabled()) {
    await apiPost('/auth/reset-password', { access_token: emailOrAccessToken, new_password }, { absolute: true });
    return;
  }
  if (shouldMockDirectly()) return resolveResetPassword(emailOrAccessToken, new_password);
  await apiPost('/auth/reset-password', { access_token: emailOrAccessToken, new_password });
}
