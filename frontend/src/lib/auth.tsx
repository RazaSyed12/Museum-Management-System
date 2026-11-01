'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '@/lib/api/auth';
import type { AuthUser, Role, Session } from '@/lib/api/auth';
import { ApiError, apiUrlAbsolute } from '@/lib/api/client';

/**
 * One sign-in for the whole site — visitors, members and staff alike (see
 * lib/api/auth.ts and backend/src/routes/session.ts). `role` on the signed-
 * in user is what tells them apart; there is no separate staff login.
 *
 * Sessions use sessionStorage for "not remembered" and localStorage for
 * "remembered". Protected staff requests share a token renewal rather than
 * reading session details themselves. Auth can also run in the local preview
 * through lib/api/auth.ts's own toggle.
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
    if (remembered) return JSON.parse(remembered) as Session;
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
  request: (path: string, init?: RequestInit) => Promise<Response>;
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
  const currentSession = useRef<Session | undefined>(undefined);
  const currentUserId = useRef<string | undefined>(undefined);
  const renewal = useRef<Promise<Session> | undefined>(undefined);
  const restoration = useRef<Promise<void> | undefined>(undefined);

  const keepSession = useCallback((next: Session | undefined) => {
    currentSession.current = next;
    setSession(next);
  }, []);

  const expireSession = useCallback(() => {
    clearStoredSession();
    currentSession.current = undefined;
    currentUserId.current = undefined;
    setSession(undefined);
    setAuthUser(undefined);
  }, []);

  const refreshSession = useCallback(async (): Promise<Session> => {
    if (renewal.current) return renewal.current;
    const previous = currentSession.current;
    if (!previous) throw new ApiError('Sign in required.', 'unauthorized', 401);
    const pending = (async () => {
      try {
        const { session: next } = await authApi.refreshSession(previous.refresh_token);
        const { user } = await authApi.getMe(next.access_token);
        if (currentSession.current !== previous)
          throw new ApiError('Your session has changed. Please try again.', 'session_changed', 401);
        const rememberMe = window.localStorage.getItem(REMEMBER_KEY) !== null;
        writeStoredSession(next, rememberMe);
        keepSession(next);
        setAuthUser(user);
        return next;
      } catch (err) {
        if (
          currentSession.current === previous &&
          err instanceof ApiError &&
          [401, 403].includes(err.status)
        )
          expireSession();
        throw err;
      }
    })();
    renewal.current = pending;
    try {
      return await pending;
    } finally {
      if (renewal.current === pending) renewal.current = undefined;
    }
  }, [keepSession, expireSession]);

  const request = useCallback(
    async (path: string, init: RequestInit = {}) => {
      let active = currentSession.current;
      const userId = currentUserId.current;
      if (!active) throw new ApiError('Sign in required.', 'unauthorized', 401);
      init.signal?.throwIfAborted();
      if (active.expires_at * 1000 <= Date.now() + 30000) active = await refreshSession();
      const send = (token: string) => {
        if (currentUserId.current !== userId)
          throw new ApiError('Your session has changed. Please try again.', 'session_changed', 401);
        const headers = new Headers(init.headers);
        headers.set('Authorization', `Bearer ${token}`);
        return fetch(apiUrlAbsolute(path), { ...init, headers, cache: 'no-store' });
      };
      init.signal?.throwIfAborted();
      let response = await send(active.access_token);
      if (response.status === 401) {
        // Concurrent requests share one renewal; a later 401 can reuse its token.
        const next =
          currentSession.current !== active && currentSession.current
            ? currentSession.current
            : await refreshSession();
        init.signal?.throwIfAborted();
        response = await send(next.access_token);
        if (response.status === 401 && currentSession.current === next) expireSession();
      }
      return response;
    },
    [refreshSession, expireSession],
  );

  useEffect(() => {
    if (restoration.current) return;
    const stored = readStoredSession();
    if (!stored) {
      setReady(true);
      return;
    }
    currentSession.current = stored;
    restoration.current = (async () => {
      try {
        // Skip straight to a refresh if the access token has already
        // expired — calling /auth/me with it would just fail anyway.
        if (stored.expires_at * 1000 <= Date.now())
          throw new ApiError('expired', 'unauthorized', 401);
        const { user } = await authApi.getMe(stored.access_token);
        if (currentSession.current !== stored) return;
        currentUserId.current = user.id;
        keepSession(stored);
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
          if (currentSession.current !== stored) return;
          currentUserId.current = user.id;
          writeStoredSession(refreshed, rememberMe);
          keepSession(refreshed);
          setAuthUser(user);
        } catch {
          if (currentSession.current === stored) expireSession();
        }
      } finally {
        setReady(true);
      }
    })();
  }, [keepSession, expireSession]);

  function applySignIn(user: AuthUser, newSession: Session, rememberMe: boolean) {
    writeStoredSession(newSession, rememberMe);
    currentUserId.current = user.id;
    keepSession(newSession);
    setAuthUser(user);
  }

  const user = useMemo(() => authUser && toView(authUser), [authUser]);
  const value: AuthContextValue = {
    user,
    isMember: authUser?.role === 'member',
    isStaff: authUser?.role === 'staff',
    ready,
    request,
    async signIn(email, password, rememberMe) {
      try {
        const { user, session: newSession } = await authApi.signIn({ email, password });
        applySignIn(user, newSession, rememberMe);
        return { ok: true, role: user.role, onboardingCompleted: user.onboarding_completed };
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof ApiError
              ? err.message
              : "We couldn't sign you in. Check your email and password.",
        };
      }
    },
    async signOut() {
      if (session) await authApi.signOut(session.access_token).catch(() => undefined);
      expireSession();
    },
    async register({ name, email, password }) {
      try {
        const { user, session: newSession } = await authApi.signUp({
          full_name: name,
          email,
          password,
        });
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
        return {
          ok: false,
          error:
            err instanceof ApiError ? err.message : 'An account with that email already exists.',
        };
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
        return {
          ok: false,
          error:
            err instanceof ApiError ? err.message : 'That reset link is invalid or has expired.',
        };
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
