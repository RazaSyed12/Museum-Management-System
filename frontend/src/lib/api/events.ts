import { apiFetch, apiFetchOptional, shouldMockDirectly } from './client';
import { resolveEvents, resolveEvent } from '@/mocks/resolve';

export type EventAvailability = 'available' | 'limited' | 'soldout' | 'cancelled' | 'completed' | 'notonsale';

export interface MuseumEvent {
  id: string;
  title: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  priceValue: number;
  memberPrice?: number;
  /** Under-18/student admission price. */
  childPrice?: number;
  free?: boolean;
  availability: EventAvailability;
  remaining: number;
  capacity: number;
  startAt?: string;
  description: string;
  /** Cover image, if staff have uploaded one. */
  image?: string;
  collectionIds?: string[];
}

/** Matches backend/src/routes/events.ts, including authoritative allocation availability. */
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
  price_member: number | null;
  price_child: number | null;
  availability: EventAvailability;
  remaining: number;
  capacity: number;
  location: { name: string; city: string | null } | null;
  images?: { media_id: string; url: string; alt_text: string | null }[];
  collections: { collection_id: string; name: string }[];
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
    memberPrice: raw.price_member ?? undefined,
    childPrice: raw.price_child ?? undefined,
    free: raw.ticket_price === 0,
    availability: raw.availability,
    remaining: raw.remaining,
    capacity: raw.capacity,
    startAt: raw.start_at,
    description: raw.description ?? '',
    image: raw.images?.[0]?.url,
    collectionIds: (raw.collections ?? []).map((collection) => collection.collection_id),
  };
}

function eventsMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_EVENTS_API_MOCKING === 'disabled';
}

/** when=all so cancelled/ended events still show — filtering happens client-side. */
export async function listEvents(query: { collectionId?: string } = {}): Promise<MuseumEvent[]> {
  if (eventsMockingDisabled()) {
    const data = await apiFetch<{ events: RawEvent[]; total: number; limit: number; offset: number }>(
      `/events?when=all&limit=100${query.collectionId ? `&collection_id=${encodeURIComponent(query.collectionId)}` : ''}`,
      { absolute: true },
    );
    return data.events.map(mapEvent);
  }
  const events = shouldMockDirectly() ? await resolveEvents() : await apiFetch<MuseumEvent[]>('/api/events');
  return query.collectionId ? events.filter((event) => event.collectionIds?.includes(query.collectionId!)) : events;
}

export async function getEvent(id: string): Promise<MuseumEvent | undefined> {
  if (eventsMockingDisabled()) {
    const data = await apiFetchOptional<{ event: RawEvent }>(`/events/${id}`, { absolute: true });
    return data && mapEvent(data.event);
  }
  if (shouldMockDirectly()) return resolveEvent(id);
  return apiFetchOptional<MuseumEvent>(`/api/events/${id}`);
}
