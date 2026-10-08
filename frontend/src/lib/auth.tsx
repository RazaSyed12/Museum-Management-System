'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Mock authentication — there is no backend yet (see backend/API-REQUIREMENTS.md).
 * This simulates what a real session-cookie-backed login feels like from the
 * frontend's side, so swapping in the real thing later is a contained change
 * to the three functions below, not a rearchitecture:
 *
 *   - Real auth: the server sets one httpOnly, Secure, SameSite cookie
 *     holding an opaque session id; "remember me" is just that cookie's
 *     maxAge (~30 days checked, session-only unchecked). The browser sends
 *     it automatically; this app never reads or writes a token.
 *   - This mock: there's no server to set a cookie, so it stores the
 *     equivalent *shape* (an email + an expiry) in storage this tab's JS can
 *     read — sessionStorage for "not remembered" (dies when the tab closes,
 *     same lifetime a session cookie would have), localStorage with a real
 *     expiresAt for "remembered" (survives restarts, checked on load).
 *
 * Passwords are plaintext in MOCK_ACCOUNTS below *only* because this is a
 * throwaway fixture standing in for a database that doesn't exist yet. Real
 * passwords must be hashed server-side (bcrypt/argon2) and never stored or
 * compared in frontend code — don't carry this file's password handling
 * forward as a pattern.
 */

export interface AuthUser {
  name: string;
  email: string;
  initials: string;
}

interface MockAccount {
  name: string;
  email: string;
  password: string;
  isMember: boolean;
  interests: string[];
}

const SEED_ACCOUNTS: MockAccount[] = [
  { name: 'Amara Okafor', email: 'amara@example.com', password: 'password123', isMember: false, interests: ['Prehistory', 'Archaeology'] },
  { name: 'Judith Clarke', email: 'judith@example.com', password: 'password123', isMember: true, interests: ['Medieval', 'Renaissance'] },
];

const SESSION_KEY = 'hm-session'; // sessionStorage: dies with the tab, like an unremembered session cookie would
const REMEMBER_KEY = 'hm-remember'; // localStorage: survives restarts, like a 30-day session cookie would
const ACCOUNTS_KEY = 'hm-accounts'; // localStorage: accounts registered during this mock, layered over the seed list
const REMEMBER_DAYS = 30;

interface StoredSession {
  email: string;
  expiresAt: number;
}

function readAccounts(): MockAccount[] {
  if (typeof window === 'undefined') return SEED_ACCOUNTS;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    const registered: MockAccount[] = raw ? JSON.parse(raw) : [];
    return [...SEED_ACCOUNTS, ...registered];
  } catch {
    return SEED_ACCOUNTS;
  }
}

function writeAccount(account: MockAccount) {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    const registered: MockAccount[] = raw ? JSON.parse(raw) : [];
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...registered, account]));
  } catch {
    // Storage unavailable (private browsing, quota) — registration still
    // works for this tab's session, it just won't survive a reload.
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

function readStoredSession(): StoredSession | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const remembered = window.localStorage.getItem(REMEMBER_KEY);
    if (remembered) {
      const session: StoredSession = JSON.parse(remembered);
      if (session.expiresAt > Date.now()) return session;
      window.localStorage.removeItem(REMEMBER_KEY);
    }
    const sessionOnly = window.sessionStorage.getItem(SESSION_KEY);
    if (sessionOnly) return JSON.parse(sessionOnly) as StoredSession;
  } catch {
    // Corrupt or inaccessible storage reads as signed out.
  }
  return undefined;
}

function writeStoredSession(email: string, rememberMe: boolean) {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(REMEMBER_KEY);
    const session: StoredSession = { email, expiresAt: Date.now() + REMEMBER_DAYS * 24 * 60 * 60 * 1000 };
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

export type AuthResult = { ok: true } | { ok: false; error: string };

export interface AuthContextValue {
  user: AuthUser | undefined;
  isMember: boolean;
  /** False until the stored session has been checked once, on mount — lets
   *  callers avoid flashing a signed-out state while that check is pending. */
  ready: boolean;
  signIn: (email: string, password: string, rememberMe: boolean) => AuthResult;
  signOut: () => void;
  register: (input: { name: string; email: string; password: string }) => AuthResult;
  setMember: (isMember: boolean) => void;
  updateProfile: (input: { name: string }) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<MockAccount | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readStoredSession();
    if (session) {
      const match = readAccounts().find((a) => a.email === session.email);
      if (match) setAccount(match);
    }
    setReady(true);
  }, []);

  const value: AuthContextValue = {
    user: account && { name: account.name, email: account.email, initials: initials(account.name) },
    isMember: account?.isMember ?? false,
    ready,
    signIn(email, password, rememberMe) {
      const match = readAccounts().find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
      if (!match) return { ok: false, error: "We couldn't sign you in. Check your email and password." };
      writeStoredSession(match.email, rememberMe);
      setAccount(match);
      return { ok: true };
    },
    signOut() {
      clearStoredSession();
      setAccount(undefined);
    },
    register({ name, email, password }) {
      if (readAccounts().some((a) => a.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: 'An account with that email already exists.' };
      }
      const created: MockAccount = { name, email, password, isMember: false, interests: [] };
      writeAccount(created);
      writeStoredSession(created.email, false);
      setAccount(created);
      return { ok: true };
    },
    setMember(isMember) {
      setAccount((cur) => (cur ? { ...cur, isMember } : cur));
    },
    updateProfile({ name }) {
      setAccount((cur) => (cur ? { ...cur, name } : cur));
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
