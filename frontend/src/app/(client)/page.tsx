import type { Metadata } from 'next';
import { HomeContent } from '@/components/home/HomeContent';
import { listCollections } from '@/lib/api/collections';
import { listEvents } from '@/lib/api/events';
import { listHeroSlides } from '@/lib/api/hero';

export const metadata: Metadata = {
  title: 'Heritage Museum',
  description: 'Our past. Our stories. Our future. Plan your visit, explore the collections, and see what’s on at Heritage Museum.',
};

/* The homepage reads live data (hero slides, events, collections). Without
   this, Next.js renders it once at build time and serves that frozen copy, so
   slides staff add later never show. Re-fetch at most once a minute. */
export const revalidate = 60;

export default async function HomePage() {
  const [{ items: allCollections }, allEvents, heroSlides] = await Promise.all([
    listCollections({ limit: 100 }),
    listEvents(),
    listHeroSlides(),
  ]);

  return <HomeContent allCollections={allCollections} allEvents={allEvents} heroSlides={heroSlides} />;
}
