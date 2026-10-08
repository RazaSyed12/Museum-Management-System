import { events as ALL_EVENTS, type MuseumEvent } from '@/lib/sample-data';
import { mockResolve } from './client';

/** GET /events — backend/API-REQUIREMENTS.md. The real endpoint sends
 *  `startAt`/`endAt` as timestamps and a computed `availability`; the
 *  fixture already has both pre-formatted and computed, so nothing to
 *  convert here yet — this function is the seam where that conversion
 *  will live once the real response shape lands. */
export async function listEvents(): Promise<MuseumEvent[]> {
  return mockResolve(ALL_EVENTS);
}

export async function getEvent(id: string): Promise<MuseumEvent | undefined> {
  return mockResolve(ALL_EVENTS.find((e) => e.id === id));
}
