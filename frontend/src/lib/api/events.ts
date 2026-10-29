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
  priceValue: number;
  memberPrice?: number;
  /** Under-18/student price; no real backing field yet. */
  childPrice?: number;
  free?: boolean;
  availability: EventAvailability;
  remaining: number;
  capacity: number;
  description: string;
}

/** Matches backend/src/routes/events.ts (openapi.yaml). Own toggle: NEXT_PUBLIC_EVENTS_API_MOCKING.
 *  No real member/child price or remaining-seats data — real events map to single-price, always-available. */
const MUSEUM_TIMEZONE = 'Australia/Adelaide'; // matches lib/staff/format.ts

function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { timeZone: MUSEUM_TIMEZONE, day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  );
}

function formatEventTime(startIso: string, endIso: string): string {
  const fmt = new Intl.DateTimeFormat('en-AU', { timeZone: MUSEUM_TIMEZONE, hour: '2-digit', minute: '2-digit', hour12: false });
  return `${fmt.format(new Date(startIso))}–${fmt.format(new Date(endIso))}`;
}

interface RawEvent {
  event_id: string;
  name: string;
  description: string | null;
  start_at: string;
  end_at: string;
  status: 'draft' | 'scheduled' | 'cancelled';
  ticket_price: number;
  capacity: number;
  location: { name: string; city: string | null } | null;
}

function mapEvent(raw: RawEvent): MuseumEvent {
  return {
    id: raw.event_id,
    title: raw.name,
    date: formatEventDate(raw.start_at),
    endDate: formatEventDate(raw.end_at),
    time: formatEventTime(raw.start_at, raw.end_at),
    location: raw.location?.name ?? '',
    priceValue: raw.ticket_price,
    free: raw.ticket_price === 0,
    availability: raw.status === 'cancelled' ? 'cancelled' : 'available',
    remaining: raw.capacity,
    capacity: raw.capacity,
    description: raw.description ?? '',
  };
}

function eventsMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_EVENTS_API_MOCKING === 'disabled';
}

/** when=all so cancelled/ended events still show — filtering happens client-side. */
export async function listEvents(): Promise<MuseumEvent[]> {
  if (eventsMockingDisabled()) {
    const data = await apiFetch<{ events: RawEvent[]; total: number; limit: number; offset: number }>(
      '/events?when=all&limit=100',
      { absolute: true },
    );
    return data.events.map(mapEvent);
  }
  if (shouldMockDirectly()) return resolveEvents();
  return apiFetch<MuseumEvent[]>('/api/events');
}

export async function getEvent(id: string): Promise<MuseumEvent | undefined> {
  if (eventsMockingDisabled()) {
    const data = await apiFetchOptional<{ event: RawEvent }>(`/events/${id}`, { absolute: true });
    return data && mapEvent(data.event);
  }
  if (shouldMockDirectly()) return resolveEvent(id);
  return apiFetchOptional<MuseumEvent>(`/api/events/${id}`);
}
