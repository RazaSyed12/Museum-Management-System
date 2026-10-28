'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as authApi from '@/lib/api/auth';
import type { AuthUser, Role, Session } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

/**
 * One sign-in for the whole site — visitors, members and staff alike (see
 * lib/api/auth.ts and backend/src/routes/session.ts). `role` on the signed-
 * in user is what tells them apart; there is no separate staff login.
 *
 * Session storage mirrors what a real httpOnly cookie would do, since this
 * still runs against the mock by default: sessionStorage for "not
 * remembered" (dies when the tab closes), localStorage with a real
 * expires_at for "remembered" (survives restarts, checked on load). Once
 * NEXT_PUBLIC_API_MOCKING=disabled, lib/api/auth.ts's functions call the
 * real backend instead — nothing here changes.
 */

export interface AuthUserView {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  onboardingCompleted: boolean;
  /** Not backed by a real endpoint yet (no /me field for it) — a purely
   *  local, client-side picks list kept for the Interests screen. */
  interests: string[];
}

const SESSION_KEY = 'hm-session';
const REMEMBER_KEY = 'hm-remember';
const INTERESTS_KEY = 'hm-interests';

function readLocalInterests(userId: string): string[] {
  try {
    const raw = window.localStorage.getItem(INTERESTS_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
    return all[userId] ?? [];
  } catch {
    return [];
  }
}

function writeLocalInterests(userId: string, interests: string[]) {
  try {
    const raw = window.localStorage.getItem(INTERESTS_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
    all[userId] = interests;
    window.localStorage.setItem(INTERESTS_KEY, JSON.stringify(all));
  } catch {
    // Best-effort only — interests editing still works for this tab's session.
  }
}

function readStoredSession(): Session | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const remembered = window.localStorage.getItem(REMEMBER_KEY);
    if (remembered) {
      const session = JSON.parse(remembered) as Session;
      if (session.expires_at * 1000 > Date.now()) return session;
      window.localStorage.removeItem(REMEMBER_KEY);
    }
    const sessionOnly = window.sessionStorage.getItem(SESSION_KEY);
    if (sessionOnly) return JSON.parse(sessionOnly) as Session;
  } catch {
    // Corrupt or inaccessible storage reads as signed out.
  }
  return undefined;
}

function writeStoredSession(session: Session, rememberMe: boolean) {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(REMEMBER_KEY);
    if (rememberMe) window.localStorage.setItem(REMEMBER_KEY, JSON.stringify(session));
    else window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // If storage is unavailable, the user stays signed in for this render
    // only (state below still updates) — not ideal, but never a crash.
  }
}

function clearStoredSession() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(REMEMBER_KEY);
  } catch {
    // Nothing to clean up if storage was never reachable.
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

function toView(user: AuthUser): AuthUserView {
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    initials: initials(user.full_name),
    role: user.role,
    onboardingCompleted: user.onboarding_completed,
    interests: readLocalInterests(user.id),
  };
}

export type AuthResult =
  | { ok: true; role: Role; onboardingCompleted: boolean }
  | { ok: false; error: string };

export interface AuthContextValue {
  user: AuthUserView | undefined;
  isMember: boolean;
  isStaff: boolean;
  /** False until the stored session has been checked once, on mount — lets
   *  callers avoid flashing a signed-out state while that check is pending. */
  ready: boolean;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<AuthResult>;
  /** Always succeeds from the caller's point of view, whether or not the
   *  email matches an account — never reveal which emails are registered. */
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<AuthResult>;
  /** Demo-only instant membership toggle — buying membership for real has
   *  no backend endpoint yet. */
  setMember: (isMember: boolean) => void;
  /** Demo-only — no backend endpoint for editing full_name yet. */
  updateProfile: (input: { name: string }) => void;
  /** Local-only (see AuthUserView.interests) until /me/preferences is wired up. */
  updateInterests: (interests: string[]) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [authUser, setAuthUser] = useState<AuthUser | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) {
      setReady(true);
      return;
    }
    (async () => {
      try {
        const { user } = await authApi.getMe(stored.access_token);
        setSession(stored);
        setAuthUser(user);
      } catch {
        // The access token (1 hour) has likely expired even though the
        // stored session (up to 30 days under "remember me") hasn't —
        // that's what the refresh token is for, same as a real app would
        // do instead of signing the visitor out every hour.
        try {
          const rememberMe = window.localStorage.getItem(REMEMBER_KEY) !== null;
          const { session: refreshed } = await authApi.refreshSession(stored.refresh_token);
          const { user } = await authApi.getMe(refreshed.access_token);
          writeStoredSession(refreshed, rememberMe);
          setSession(refreshed);
          setAuthUser(user);
        } catch {
          clearStoredSession();
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  function applySignIn(user: AuthUser, newSession: Session, rememberMe: boolean) {
    writeStoredSession(newSession, rememberMe);
    setSession(newSession);
    setAuthUser(user);
  }

  const value: AuthContextValue = {
    user: authUser && toView(authUser),
    isMember: authUser?.role === 'member',
    isStaff: authUser?.role === 'staff',
    ready,
    async signIn(email, password, rememberMe) {
      try {
        const { user, session: newSession } = await authApi.signIn({ email, password });
        applySignIn(user, newSession, rememberMe);
        return { ok: true, role: user.role, onboardingCompleted: user.onboarding_completed };
      } catch (err) {
        return { ok: false, error: err instanceof ApiError ? err.message : "We couldn't sign you in. Check your email and password." };
      }
    },
    async signOut() {
      if (session) await authApi.signOut(session.access_token).catch(() => undefined);
      clearStoredSession();
      setSession(undefined);
      setAuthUser(undefined);
    },
    async register({ name, email, password }) {
      try {
        const { user, session: newSession } = await authApi.signUp({ full_name: name, email, password });
        // SignUpResponse's user has no `role` (openapi.yaml) — a brand-new
        // account is always 'registered' by definition, so that's filled in
        // here rather than read off the response.
        const registeredUser: AuthUser = { ...user, role: 'registered' };
        // A brand-new account always goes straight to onboarding, so there's
        // nothing useful to do with session: null (email confirmation
        // required) in this demo — the mock never returns it.
        if (newSession) applySignIn(registeredUser, newSession, false);
        return { ok: true, role: 'registered', onboardingCompleted: user.onboarding_completed };
      } catch (err) {
        return { ok: false, error: err instanceof ApiError ? err.message : 'An account with that email already exists.' };
      }
    },
    async requestPasswordReset(email) {
      await authApi.requestPasswordReset(email).catch(() => undefined);
    },
    async resetPassword(email, newPassword) {
      try {
        await authApi.resetPassword(email, newPassword);
        return { ok: true, role: 'registered', onboardingCompleted: true };
      } catch (err) {
        return { ok: false, error: err instanceof ApiError ? err.message : 'That reset link is invalid or has expired.' };
      }
    },
    setMember(isMember) {
      setAuthUser((cur) => (cur ? { ...cur, role: isMember ? 'member' : 'registered' } : cur));
    },
    updateProfile({ name }) {
      setAuthUser((cur) => (cur ? { ...cur, full_name: name } : cur));
    },
    updateInterests(interests) {
      setAuthUser((cur) => {
        if (!cur) return cur;
        writeLocalInterests(cur.id, interests);
        return { ...cur }; // new reference so toView() re-reads the interests it just wrote
      });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
