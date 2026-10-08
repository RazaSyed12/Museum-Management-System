import { bookings as ALL_BOOKINGS, type Booking } from '@/lib/sample-data';
import { mockResolve } from './client';

/** The signed-in visitor's bookings — the "read back a confirmed booking"
 *  need named under Ticketing in backend/API-REQUIREMENTS.md. Not a
 *  documented endpoint shape yet since Ticketing hasn't been scoped, so
 *  this just mirrors the fixture until that contract exists. */
export async function listBookings(): Promise<Booking[]> {
  return mockResolve(ALL_BOOKINGS);
}
