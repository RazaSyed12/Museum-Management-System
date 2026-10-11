import { apiFetch, apiFetchOptional, shouldMockDirectly } from './client';
import { resolveEvents, resolveEvent } from '@/mocks/resolve';

export type EventAvailability = 'available' | 'limited' | 'soldout' | 'cancelled';

export interface MuseumEvent {
  id: string;
  title: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  price: string;
  priceValue: number;
  memberPrice?: number;
  free?: boolean;
  availability: EventAvailability;
  remaining: number;
  capacity: number;
  description: string;
}

/** GET /events — backend/API-REQUIREMENTS.md. The real endpoint sends
 *  `startAt`/`endAt` as timestamps and a computed `availability`; the
 *  fixture already has both pre-formatted and computed, so nothing to
 *  convert here yet — that conversion will live in this file once the
 *  real response shape lands. */
export async function listEvents(): Promise<MuseumEvent[]> {
  if (shouldMockDirectly()) return resolveEvents();
  return apiFetch<MuseumEvent[]>('/api/events');
}

export async function getEvent(id: string): Promise<MuseumEvent | undefined> {
  if (shouldMockDirectly()) return resolveEvent(id);
  return apiFetchOptional<MuseumEvent>(`/api/events/${id}`);
}
