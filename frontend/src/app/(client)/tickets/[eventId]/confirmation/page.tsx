import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getEvent } from '@/lib/api/events';
import { ConfirmationScreen } from '@/components/tickets/ConfirmationScreen';
import { qtyFromParams, qtyToSearchParams, contactFromParams } from '@/lib/ticketing';

interface Props {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { title: "You're going" };

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) notFound();

  const sp = await searchParams;
  const qty = qtyFromParams(sp);
  if (!qty.general && !qty.member && !qty.child) redirect(`/tickets/${eventId}`);

  const bookingRef = typeof sp.ref === 'string' ? sp.ref : undefined;
  if (!bookingRef) redirect(`/tickets/${eventId}/checkout?${qtyToSearchParams(qty)}`);

  const contact = contactFromParams(sp);

  return <ConfirmationScreen event={event} qty={qty} contact={contact} bookingRef={bookingRef} />;
}
