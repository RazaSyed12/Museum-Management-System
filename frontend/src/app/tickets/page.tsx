import type { Metadata } from 'next';
import { UnderConstruction } from '@/components/shared/UnderConstruction';

export const metadata: Metadata = { title: 'Tickets' };

export default function TicketsPage() {
  return <UnderConstruction title="Tickets" description="Book your visit online. Ticketing isn't live yet — please check back soon." />;
}
