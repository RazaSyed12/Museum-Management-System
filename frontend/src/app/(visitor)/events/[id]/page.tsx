import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/events/EventDetail';
import { listEvents, getEvent } from '@/lib/api/events';

interface Props {
  params: Promise<{ id: string }>;
}

/** Prerender every known event at build time; anything else 404s. */
export async function generateStaticParams() {
  const events = await listEvents();
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).id);
  return event ? { title: event.title, description: event.description } : {};
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent((await params).id);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
