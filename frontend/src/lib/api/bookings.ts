import { apiFetch, shouldMockDirectly } from './client';
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
  total: string;
  status: BookingStatus;
}

/** The signed-in visitor's bookings — the "read back a confirmed booking"
 *  need named under Ticketing in backend/API-REQUIREMENTS.md. Not a
 *  documented endpoint shape yet since Ticketing hasn't been scoped, so
 *  this just mirrors the fixture until that contract exists. */
export async function listBookings(): Promise<Booking[]> {
  if (shouldMockDirectly()) return resolveBookings();
  return apiFetch<Booking[]>('/api/bookings');
}
