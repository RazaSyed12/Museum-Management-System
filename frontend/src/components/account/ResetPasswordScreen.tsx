'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { useAuth } from '@/lib/auth';

const MIN_PASSWORD_LENGTH = 10;

export function ResetPasswordScreen({ email: initialEmail }: { email: string }) {
  const auth = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) { setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    const result = auth.resetPassword(email, password);
    if (!result.ok) { setError(result.error); return; }
    setDone(true);
  }

  return (
    <AuthLayout
      title="Choose a new password"
      intro="This link stands in for the one a real email would send."
      footer={
        <p className="type-body-sm text-center text-muted">
          Remembered it after all? <Link href="/sign-in">Sign in</Link>
        </p>
      }
    >
      {done ? (
        <Alert tone="success" title="Password updated">
          Your password has been changed. <Link href="/sign-in">Sign in</Link> with your new password.
        </Alert>
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {error && <Alert tone="danger" title="Couldn't reset your password">{error}</Alert>}
          <Field label="Email address" htmlFor="rp-e" required>
            <Input id="rp-e" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="New password" htmlFor="rp-p" required hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
            <Input id="rp-p" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Field label="Confirm new password" htmlFor="rp-p2" required>
            <Input id="rp-p2" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </Field>
          <Button type="submit" size="lg" fullWidth>Update password</Button>
        </form>
      )}
    </AuthLayout>
  );
}
