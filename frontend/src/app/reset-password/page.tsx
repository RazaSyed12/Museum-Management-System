import type { Metadata } from 'next';
import { ResetPasswordScreen } from '@/components/account/ResetPasswordScreen';

export const metadata: Metadata = { title: 'Choose a new password' };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return <ResetPasswordScreen email={email ?? ''} />;
}
