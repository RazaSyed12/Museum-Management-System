import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MembershipJoinScreen } from '@/components/account/MembershipJoinScreen';
import { membershipMockingDisabled } from '@/lib/api/membership';

export const metadata: Metadata = { title: 'Join the museum' };

export default async function MembershipJoinPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Buying is real-backend only; with mock data the membership page keeps its demo button.
  if (!membershipMockingDisabled()) redirect('/membership');
  const sp = await searchParams;
  return <MembershipJoinScreen planId={typeof sp.plan === 'string' ? sp.plan : undefined} />;
}
