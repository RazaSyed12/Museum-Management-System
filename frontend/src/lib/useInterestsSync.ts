'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { getToken } from '@/lib/api/authed';
import { getInterestPicks, profileMockingDisabled } from '@/lib/api/preferences';

/** Real backend: pulls the account's saved interest picks into the auth
 *  context once per sign-in, so every screen showing `user.interests` agrees
 *  with the server (and with the same account on another device). No-op while
 *  interests are still local. */
export function useInterestsSync() {
  const { user, updateInterests } = useAuth();
  const syncedFor = useRef<string | undefined>(undefined);
  const userId = user?.id;
  const current = user?.interests;

  useEffect(() => {
    if (!profileMockingDisabled() || !userId || syncedFor.current === userId) return;
    const token = getToken();
    if (!token) return;
    syncedFor.current = userId;
    getInterestPicks(token)
      .then((picks) => {
        const names = picks.map((p) => p.name);
        if (names.join('|') !== (current ?? []).join('|')) updateInterests(names);
      })
      .catch(() => {
        syncedFor.current = undefined; // try again next time the screen mounts
      });
  }, [userId, current, updateInterests]);
}
