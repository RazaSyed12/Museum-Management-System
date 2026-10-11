import type { Metadata } from 'next';
import { TicketsPicker } from '@/components/tickets/TicketsPicker';

export const metadata: Metadata = { title: 'Book tickets' };

export default function TicketsPage() {
  return <TicketsPicker />;
}
