'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getToken } from '@/lib/api/authed';
import { interactionsMockingDisabled, recordView } from '@/lib/api/interactions';

/** Renders nothing. Tells the backend a signed-in visitor opened this event or
 *  collection (see lib/api/interactions.ts); a no-op for guests and while the
 *  toggle is off. */
export function TrackView(props: { eventId: string } | { collectionId: string }) {
  const { ready, user } = useAuth();
  const userId = user?.id;
  const targetId = 'eventId' in props ? props.eventId : props.collectionId;
  const isEvent = 'eventId' in props;

  useEffect(() => {
    if (!interactionsMockingDisabled() || !ready || !userId) return;
    const token = getToken();
    if (!token) return;
    void recordView(token, isEvent ? { eventId: targetId } : { collectionId: targetId });
  }, [ready, userId, targetId, isEvent]);

  return null;
}
