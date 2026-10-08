import type { Metadata } from 'next';
import { ProfileScreen } from '@/components/account/ProfileScreen';

export const metadata: Metadata = { title: 'Your account' };

export default function AccountPage() {
  return <ProfileScreen />;
}
