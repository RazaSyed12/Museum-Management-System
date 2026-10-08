'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { useAuth } from '@/lib/auth';

export function ForgotPasswordScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    auth.requestPasswordReset(email);
    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset your password"
      intro="We'll email you a link to choose a new one."
      footer={
        <p className="type-body-sm text-center text-muted">
          Remembered it after all? <Link href="/sign-in">Sign in</Link>
        </p>
      }
    >
      {sent ? (
        <Alert tone="success" title="Check your email">
          If an account exists for <strong>{email}</strong>, we&rsquo;ve sent a link to reset your password.
          <div className="mt-4">
            <Link href={`/reset-password?email=${encodeURIComponent(email)}`} className="type-body-sm">
              Demo shortcut: open the reset link directly
            </Link>
          </div>
        </Alert>
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Field label="Email address" htmlFor="fp-e" required>
            <Input id="fp-e" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Button type="submit" size="lg" fullWidth>Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
}
