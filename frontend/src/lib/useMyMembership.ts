'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getMemberAccessToken, getMyMembership, membershipMockingDisabled, type MyMembership } from '@/lib/api/membership';

/** The signed-in member's real membership (plan and end date). Stays
 *  undefined while membership runs on mock data, for non-members, and until
 *  the lookup finishes — callers fall back to their generic wording. */
export function useMyMembership(): MyMembership | undefined {
  const { user, isMember } = useAuth();
  const [membership, setMembership] = useState<MyMembership>();
  const signedIn = Boolean(user);

  useEffect(() => {
    if (!membershipMockingDisabled() || !signedIn || !isMember) {
      setMembership(undefined);
      return;
    }
    const token = getMemberAccessToken();
    if (!token) return;
    let cancelled = false;
    getMyMembership(token)
      .then((m) => !cancelled && setMembership(m))
      .catch(() => !cancelled && setMembership(undefined));
    return () => {
      cancelled = true;
    };
  }, [signedIn, isMember]);

  return membership;
}
