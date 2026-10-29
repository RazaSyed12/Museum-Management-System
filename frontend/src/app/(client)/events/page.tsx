import type { Metadata } from 'next';
import { EventsBrowse } from '@/components/events/EventsBrowse';

export const metadata: Metadata = {
  title: "What's on",
  description: 'Exhibitions, talks, workshops and late openings at Heritage Museum.',
};

export default function EventsPage() {
  return <EventsBrowse />;
}
