import { ApiError, apiFetch, apiFetchOptional, apiGetAuthed, apiPostAuthed, shouldMockDirectly } from './client';
import { resolveBookings } from '@/mocks/resolve';

export type BookingStatus = 'Confirmed' | 'Cancelled';

export interface Booking {
  /** The booking reference doubles as its row id — bookings have no other
   *  unique key in this fixture. */
  id: string;
  ref: string;
  event: string;
  date: string;
  qty: number;
  /** 0 for a free booking — formatted into the visitor's currency at
   *  render time rather than baked into a display string. */
  totalValue: number;
  status: BookingStatus;
}

/* ── Real backend (openapi.yaml: /events/{id}/allocations, /bookings/*, /me/bookings) ──
 *
 * Own toggle: NEXT_PUBLIC_BOOKINGS_API_MOCKING=disabled switches the whole
 * ticket flow and the profile's bookings tab to the real backend. Unset, the
 * flow keeps running on the fixtures exactly as before.
 *
 * Differences from the mock flow that the screens have to respect:
 *  - Booking needs a signed-in account (every /bookings call takes a token).
 *  - One booking is ONE ticket type ("allocation") x 1-10 tickets.
 *  - Prices come from POST /bookings/quote (tax, service fee and the member
 *    discount are the server's numbers, in AUD), never from local maths.
 *  - A new booking is a 15-minute hold until POST /bookings/{id}/pay. */

export function bookingsMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_BOOKINGS_API_MOCKING === 'disabled';
}

/** Currency the real backend charges in (Payment.currency in openapi.yaml). */
export const BOOKING_CURRENCY = 'AUD' as const;

/* Same keys lib/auth.tsx stores the session under. Read directly rather than
   exporting from auth.tsx so this file doesn't touch the auth module. */
const SESSION_KEY = 'hm-session';
const REMEMBER_KEY = 'hm-remember';

/** The signed-in visitor's access token, if any (browser only). */
export function getAccessToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(REMEMBER_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { access_token?: string }).access_token : undefined;
  } catch {
    return undefined;
  }
}

/** A ticket type of an event (an "allocation"). */
export interface Allocation {
  id: string;
  name: string;
  membersOnly: boolean;
  kind?: 'general' | 'member' | 'child';
  /** Tickets still unreserved in this allocation. */
  available: number;
}

interface RawAllocation {
  allocation_id: string;
  allocation_name: string;
  membership_required: boolean;
  ticket_kind: 'general' | 'member' | 'child';
  available: number;
}

/** Real mode only — undefined while mocking is on, or when the event has no ticket types. */
export async function getAllocations(eventId: string): Promise<Allocation[] | undefined> {
  if (!bookingsMockingDisabled()) return undefined;
  const data = await apiFetchOptional<{ allocations: RawAllocation[] }>(`/events/${eventId}/allocations`, { absolute: true });
  if (!data) return undefined;
  return data.allocations.map((a) => ({ id: a.allocation_id, name: a.allocation_name, kind: a.ticket_kind, membersOnly: a.membership_required, available: a.available }));
}

export interface BookingQuote {
  allocationName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxAmount: number;
  serviceFee: number;
  total: number;
  isMember: boolean;
  available: number;
  holdMinutes: number;
}

interface RawQuote {
  allocation_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  tax_amount: number;
  service_fee: number;
  total_amount: number;
  is_member: boolean;
  available: number;
  hold_minutes: number;
}

export async function quoteBooking(token: string, allocationId: string, quantity: number): Promise<BookingQuote> {
  const { quote: q } = await apiPostAuthed<{ quote: RawQuote }>('/bookings/quote', token, { allocation_id: allocationId, quantity }, { absolute: true });
  return {
    allocationName: q.allocation_name,
    quantity: q.quantity,
    unitPrice: q.unit_price,
    subtotal: q.subtotal,
    discountPercent: q.discount_percent,
    discountAmount: q.discount_amount,
    taxAmount: q.tax_amount,
    serviceFee: q.service_fee,
    total: q.total_amount,
    isMember: q.is_member,
    available: q.available,
    holdMinutes: q.hold_minutes,
  };
}

export interface PlacedBooking {
  id: string;
  /** The backend has no human reference, so this is derived from the id. */
  ref: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  quantity: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceFee: number;
  total: number;
  eventName: string;
  startAt: string;
  /** While pending: when the seat hold ends. */
  expiresAt?: string;
  /** Set once paid. */
  ticketCodes: string[];
}

interface RawBooking {
  booking_id: string;
  booking_status: PlacedBooking['status'];
  quantity: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  service_fee: number;
  total_amount: number;
  expires_at: string | null;
  event: { name: string; start_at: string };
  tickets: { ticket_code: string | null }[];
}

export const bookingRef = (id: string) => `HM-${id.slice(0, 8).toUpperCase()}`;

function mapBooking(b: RawBooking): PlacedBooking {
  return {
    id: b.booking_id,
    ref: bookingRef(b.booking_id),
    status: b.booking_status,
    quantity: b.quantity,
    subtotal: b.subtotal,
    discountAmount: b.discount_amount,
    taxAmount: b.tax_amount,
    serviceFee: b.service_fee,
    total: b.total_amount,
    eventName: b.event.name,
    startAt: b.event.start_at,
    expiresAt: b.expires_at ?? undefined,
    ticketCodes: b.tickets.map((t) => t.ticket_code).filter((c): c is string => Boolean(c)),
  };
}

export async function createBooking(token: string, allocationId: string, quantity: number): Promise<PlacedBooking> {
  const { booking } = await apiPostAuthed<{ booking: RawBooking }>('/bookings', token, { allocation_id: allocationId, quantity }, { absolute: true });
  return mapBooking(booking);
}

export async function getBooking(token: string, id: string): Promise<PlacedBooking> {
  const { booking } = await apiGetAuthed<{ booking: RawBooking }>(`/bookings/${id}`, token, { absolute: true });
  return mapBooking(booking);
}

/** simulate: only honoured by the simulated payment provider (openapi.yaml PayRequest). */
export async function payBooking(token: string, id: string, simulate?: 'success' | 'card_declined'): Promise<PlacedBooking> {
  const body = { method: 'card', ...(simulate ? { simulate } : {}) };
  const out = await apiPostAuthed<{ booking?: RawBooking }>(`/bookings/${id}/pay`, token, body, { absolute: true });
  // 202 = started but not settled; the simulated provider settles immediately unless asked not to.
  if (!out.booking || out.booking.booking_status !== 'confirmed') {
    throw new ApiError('The payment has not settled yet. Please check your bookings in a moment.', 'payment_pending', 202);
  }
  return mapBooking(out.booking);
}

const MUSEUM_TIMEZONE = 'Australia/Adelaide'; // matches lib/api/events.ts

function formatBookingDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { timeZone: MUSEUM_TIMEZONE, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

/** The signed-in visitor's bookings — confirmed and cancelled only (pending
 *  holds and expired ones aren't something to show as a ticket). */
export async function listBookings(): Promise<Booking[]> {
  if (bookingsMockingDisabled()) {
    const token = getAccessToken();
    if (!token) return [];
    const data = await apiGetAuthed<{ bookings: RawBooking[] }>('/me/bookings?limit=100', token, { absolute: true });
    return data.bookings
      .filter((b) => b.booking_status === 'confirmed' || b.booking_status === 'cancelled')
      .map((b) => ({
        id: b.booking_id,
        ref: bookingRef(b.booking_id),
        event: b.event.name,
        date: formatBookingDate(b.event.start_at),
        qty: b.quantity,
        totalValue: b.total_amount,
        status: b.booking_status === 'confirmed' ? ('Confirmed' as const) : ('Cancelled' as const),
      }));
  }
  if (shouldMockDirectly()) return resolveBookings();
  return apiFetch<Booking[]>('/api/bookings');
}
