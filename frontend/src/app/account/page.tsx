import type { Metadata } from 'next';
import { UnderConstruction } from '@/components/shared/UnderConstruction';

export const metadata: Metadata = { title: 'Your account' };

export default function AccountPage() {
  return <UnderConstruction title="Your account" description="Manage your profile, bookings and membership here soon." />;
}
