import type { Metadata } from 'next';
import { HomeContent } from '@/components/home/HomeContent';
import { listCollections } from '@/lib/api/collections';
import { listEvents } from '@/lib/api/events';

export const metadata: Metadata = {
  title: 'Heritage Museum',
  description: 'Our past. Our stories. Our future. Plan your visit, explore the collections, and see what’s on at Heritage Museum.',
};

export default async function HomePage() {
  const [{ items: allCollections }, allEvents] = await Promise.all([
    listCollections({ sort: 'popular', pageSize: 999 }),
    listEvents(),
  ]);

  return <HomeContent allCollections={allCollections} allEvents={allEvents} />;
}
