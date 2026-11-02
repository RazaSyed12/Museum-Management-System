import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/events/EventDetail';
import { TrackView } from '@/components/tracking/TrackView';
import { getEvent } from '@/lib/api/events';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).id);
  return event ? { title: event.title, description: event.description } : {};
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent((await params).id);
  if (!event) notFound();
  return (
    <>
      <TrackView eventId={event.id} />
      <EventDetail event={event} />
    </>
  );
}
