import type { Metadata } from 'next';
import { InterestsScreen } from '@/components/account/InterestsScreen';

export const metadata: Metadata = { title: 'Your interests' };

export default function InterestsPage() {
  return <InterestsScreen />;
}
