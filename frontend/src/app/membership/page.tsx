import type { Metadata } from 'next';
import { UnderConstruction } from '@/components/shared/UnderConstruction';

export const metadata: Metadata = { title: 'Membership' };

export default function MembershipPage() {
  return <UnderConstruction title="Membership" description="See more, pay less, come back often. Membership sign-up is on its way." />;
}
