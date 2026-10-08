import type { Metadata } from 'next';
import { RegisterScreen } from '@/components/account/RegisterScreen';

export const metadata: Metadata = { title: 'Create an account' };

export default function RegisterPage() {
  return <RegisterScreen />;
}
