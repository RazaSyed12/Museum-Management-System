import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getEvent } from '@/lib/api/events';
import { CheckoutScreen } from '@/components/tickets/CheckoutScreen';
import { qtyFromParams } from '@/lib/ticketing';

interface Props {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { title: 'Checkout' };

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) notFound();

  const qty = qtyFromParams(await searchParams);
  if (!qty.general && !qty.member && !qty.child) redirect(`/tickets/${eventId}`);

  return <CheckoutScreen event={event} qty={qty} />;
}
