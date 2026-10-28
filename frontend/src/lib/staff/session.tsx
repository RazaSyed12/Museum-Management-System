'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { staffApi } from '@/lib/api/staff';
import type { StaffUser } from './types';

interface StaffSession {
  user: StaffUser | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}
const Context = createContext<StaffSession | null>(null);

/**
 * There's no staff-only sign-in any more (see lib/auth.tsx) — this just
 * watches the one unified session and, once it reports role === 'staff',
 * resolves the richer staff-portal profile (tier, phone, status) that the
 * sign-in response doesn't carry. Everything under app/staff/* still reads
 * useStaffSession() exactly as before; only what's behind it changed.
 */
export function StaffSessionProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!auth.ready) return;
    if (!auth.isStaff || !auth.user) {
      setStaffUser(null);
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const profile = await staffApi.myProfile(auth.user.email);
      if (!profile) {
        setStaffUser(null);
        setError('Your account is signed in, but is not yet set up in the staff portal. Ask an administrator to add you under User management.');
      } else {
        setStaffUser(profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your staff profile.');
    } finally {
      setLoading(false);
    }
  }, [auth.ready, auth.isStaff, auth.user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    const expire = () => setStaffUser(null);
    window.addEventListener('staff-session-expired', expire);
    return () => window.removeEventListener('staff-session-expired', expire);
  }, []);
  useEffect(() => {
    const update = () => void refresh();
    window.addEventListener('staff-data-changed', update);
    return () => window.removeEventListener('staff-data-changed', update);
  }, [refresh]);

  return (
    <Context.Provider
      value={{
        user: staffUser,
        loading: loading || !auth.ready,
        error,
        refresh,
        logout: async () => {
          await staffApi.clearProfile().catch(() => undefined);
          await auth.signOut();
          setStaffUser(null);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useStaffSession() {
  const value = useContext(Context);
  if (!value) throw new Error('Staff session provider is missing.');
  return value;
}
