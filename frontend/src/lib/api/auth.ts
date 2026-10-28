/**
 * Matches backend/src/routes/{auth,session}.ts exactly — one sign-in for
 * every visitor, staff included. `role` on the returned user ('registered'
 * | 'member' | 'staff') is what the frontend branches on after sign-in;
 * there is no separate staff endpoint to call.
 *
 * Paths are NOT under /api — the real backend mounts these at /auth/*
 * directly (see backend/src/index.ts), unlike the /api/* convention the
 * other lib/api/* files use for the mock-only collections/events layer.
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

export async function signUp(input: {
  full_name: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser; session: Session | null }> {
  if (shouldMockDirectly()) return resolveSignUp(input);
  return apiPost('/auth/sign-up', input);
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; session: Session }> {
  if (shouldMockDirectly()) return resolveSignIn(input);
  return apiPost('/auth/sign-in', input);
}

export async function getMe(token: string): Promise<{ user: AuthUser }> {
  if (shouldMockDirectly()) return resolveMe(token);
  return apiGetAuthed('/auth/me', token);
}

export async function refreshSession(refresh_token: string): Promise<{ session: Session }> {
  if (shouldMockDirectly()) return resolveRefreshSession(refresh_token);
  return apiPost('/auth/refresh', { refresh_token });
}

export async function signOut(token: string): Promise<void> {
  if (shouldMockDirectly()) return resolveSignOut(token);
  await apiPostAuthed('/auth/sign-out', token);
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (shouldMockDirectly()) return resolveForgotPassword(email);
  await apiPost('/auth/forgot-password', { email });
}

/** The mock stands in for the emailed link with a plain email lookup (see
 *  mocks/resolve.ts's resolveResetPassword) since there's no email service
 *  to actually send one — the real endpoint expects the access_token from
 *  that link's URL fragment instead (backend/src/routes/session.ts), not
 *  an email address. */
export async function resetPassword(emailOrAccessToken: string, new_password: string): Promise<void> {
  if (shouldMockDirectly()) return resolveResetPassword(emailOrAccessToken, new_password);
  await apiPost('/auth/reset-password', { access_token: emailOrAccessToken, new_password });
}
