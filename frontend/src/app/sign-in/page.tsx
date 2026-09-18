import type { Metadata } from 'next';
import { UnderConstruction } from '@/components/shared/UnderConstruction';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return <UnderConstruction title="Sign in" description="Account sign-in isn't available yet." />;
}
