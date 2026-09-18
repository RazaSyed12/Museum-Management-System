import type { Metadata } from 'next';
import { UnderConstruction } from '@/components/shared/UnderConstruction';

export const metadata: Metadata = { title: "What's on" };

export default function EventsPage() {
  return <UnderConstruction title="Events and exhibitions" description="See what's on at the museum. This page is still being built." />;
}
