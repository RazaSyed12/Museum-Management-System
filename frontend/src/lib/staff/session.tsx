'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/lib/auth';
import { staffApi } from '@/lib/api/staff';
import { usesBackendAuth } from '@/lib/api/auth';
import { createStaffCatalogueApi, type StaffCatalogueApi } from '@/lib/api/staff-catalogue';
import { staffUsesBackend } from './config';
import type { StaffRole, StaffUser } from './types';

type StaffIdentity = Omit<StaffUser, 'role'> & { role?: StaffRole };

interface StaffSession {
  user: StaffIdentity | null;
  live: boolean;
  catalogue: StaffCatalogueApi;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}
const Context = createContext<StaffSession | null>(null);

/**
 * There's no staff-only sign-in any more (see lib/auth.tsx) — this just
 * watches the one unified session and, once it reports role === 'staff',
 * uses the backend identity for the available catalogue services. Only the
 * explicit demo resolves a separate roster profile and its portal tier.
 */
export function StaffSessionProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [staffUser, setStaffUser] = useState<StaffIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const live = staffUsesBackend();
  const catalogue = useMemo(() => createStaffCatalogueApi(auth.request), [auth.request]);
  const identity = auth.user;

  const refresh = useCallback(async () => {
    if (!auth.ready) return;
    if (!auth.isStaff || !identity) {
      setStaffUser(null);
      setError(identity ? 'This account does not have staff access.' : '');
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (live) {
        if (!usesBackendAuth())
          throw new Error(
            'Sign in with a museum account to use the staff portal. Demo sign-in is enabled in this environment.',
          );
        // The existing backend verifies the general staff role. It does not
        // supply a portal tier, so do not grant a made-up Admin/Manager role.
        setStaffUser({
          id: identity.id,
          name: identity.name,
          email: identity.email,
          phone: '',
          status: 'Active',
          lastLogin: null,
        });
        return;
      }
      const profile = await staffApi.myProfile(identity.email);
      if (!profile) {
        setStaffUser(null);
        setError(
          'Your account is signed in, but is not yet set up in the staff portal. Ask an administrator to add you under User management.',
        );
      } else {
        setStaffUser(profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your staff profile.');
    } finally {
      setLoading(false);
    }
  }, [auth.ready, auth.isStaff, identity, live]);

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
        live,
        catalogue,
        loading: loading || !auth.ready,
        error,
        refresh,
        logout: async () => {
          if (!live) await staffApi.clearProfile().catch(() => undefined);
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
