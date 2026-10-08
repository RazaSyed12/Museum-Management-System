import type { Metadata } from 'next';
import { ForgotPasswordScreen } from '@/components/account/ForgotPasswordScreen';

export const metadata: Metadata = { title: 'Reset your password' };

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
