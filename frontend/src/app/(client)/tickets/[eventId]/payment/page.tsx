import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getEvent } from '@/lib/api/events';
import { bookingsMockingDisabled, getAllocations } from '@/lib/api/bookings';
import { PaymentScreen } from '@/components/tickets/PaymentScreen';
import { qtyFromParams, qtyToSearchParams, contactFromParams } from '@/lib/ticketing';

interface Props {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { title: 'Payment' };

export default async function PaymentPage({ params, searchParams }: Props) {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) notFound();
  const allocations = await getAllocations(eventId);
  if (bookingsMockingDisabled() && !allocations) notFound();

  const sp = await searchParams;
  const qty = qtyFromParams(sp);
  if (!qty.general && !qty.member && !qty.child) redirect(`/tickets/${eventId}`);

  const contact = contactFromParams(sp);
  if (!contact.email) redirect(`/tickets/${eventId}/checkout?${qtyToSearchParams(qty)}`);

  // Real backend: checkout placed the booking and passed its id along; without it there's nothing to pay.
  const bookingId = typeof sp.booking === 'string' ? sp.booking : undefined;
  if (allocations && !bookingId) redirect(`/tickets/${eventId}/checkout?${qtyToSearchParams(qty)}`);

  return <PaymentScreen event={event} qty={qty} contact={contact} allocations={allocations} bookingId={bookingId} />;
}
