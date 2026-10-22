'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { staffApi } from '@/lib/api/staff';
import type { StaffUser } from './types';

interface StaffSession {
  user: StaffUser | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
}
const Context = createContext<StaffSession | null>(null);

export function StaffSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setError('');
    try {
      setUser(await staffApi.session());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not check your session.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const expire = () => setUser(null);
    window.addEventListener('staff-session-expired', expire);
    return () => window.removeEventListener('staff-session-expired', expire);
  }, [refresh]);
  useEffect(() => {
    const update = () => void refresh();
    window.addEventListener('staff-data-changed', update);
    return () => window.removeEventListener('staff-data-changed', update);
  }, [refresh]);
  return (
    <Context.Provider
      value={{
        user,
        loading,
        error,
        refresh,
        login: async (email, password, remember) => {
          setUser(await staffApi.login(email, password, remember));
        },
        logout: async () => {
          await staffApi.logout();
          setUser(null);
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
