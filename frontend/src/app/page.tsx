import type { Metadata } from 'next';
import { HomeContent } from '@/components/home/HomeContent';

export const metadata: Metadata = {
  title: 'Heritage Museum',
  description: 'Our past. Our stories. Our future. Plan your visit, explore the collections, and see what’s on at Heritage Museum.',
};

export default function HomePage() {
  return <HomeContent />;
}
