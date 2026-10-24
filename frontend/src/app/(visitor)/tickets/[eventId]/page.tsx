import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/api/events';
import { TicketSelectScreen } from '@/components/tickets/TicketSelectScreen';
import { qtyFromParams } from '@/lib/ticketing';

interface Props {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).eventId);
  return event ? { title: `Tickets — ${event.title}` } : {};
}

export default async function TicketSelectPage({ params, searchParams }: Props) {
  const event = await getEvent((await params).eventId);
  if (!event) notFound();

  const initialQty = qtyFromParams(await searchParams);
  if (!initialQty.general && !initialQty.member && !initialQty.child) initialQty.general = 1;

  return <TicketSelectScreen event={event} initialQty={initialQty} />;
}
