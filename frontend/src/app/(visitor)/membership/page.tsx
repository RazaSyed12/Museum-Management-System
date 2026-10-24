import type { Metadata } from 'next';
import { MembershipScreen } from '@/components/account/MembershipScreen';

export const metadata: Metadata = { title: 'Membership' };

export default function MembershipPage() {
  return <MembershipScreen />;
}
