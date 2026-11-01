'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getToken } from '@/lib/api/authed';
import { getRecommendationRail, recommendationsMockingDisabled, type Rail } from '@/lib/api/recommendations';

export interface RailState {
  /** False while recommendations still run on the fixed examples. */
  real: boolean;
  loading: boolean;
  rail?: Rail;
}

/** The backend's recommendation row for the current visitor (real mode only).
 *  Reloads when the visitor signs in or out. */
export function useRecommendationRail(perKind = 2): RailState {
  const real = recommendationsMockingDisabled();
  const { ready, user } = useAuth();
  const [rail, setRail] = useState<Rail>();
  const [loading, setLoading] = useState(real);
  const userId = user?.id;

  useEffect(() => {
    if (!real || !ready) return;
    let cancelled = false;
    setLoading(true);
    getRecommendationRail(userId ? getToken() : undefined, perKind)
      .then((r) => !cancelled && setRail(r))
      .catch(() => !cancelled && setRail(undefined))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [real, ready, userId, perKind]);

  return { real, loading, rail };
}
