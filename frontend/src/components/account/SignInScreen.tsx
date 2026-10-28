'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Checkbox } from '@/components/forms/Checkbox';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { useAuth } from '@/lib/auth';

export function SignInScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await auth.signIn(email, password, rememberMe);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Same redirect rule as a fresh sign-up: the backend's /auth/me doc
    // says onboarding_completed false means the preferences page first.
    // role === 'staff' is the one thing a visitor sign-in never returns —
    // there is no separate staff sign-in, this is it.
    if (result.role === 'staff') router.push('/staff');
    else if (!result.onboardingCompleted) router.push('/interests');
    else router.push('/account');
  }

  return (
    <AuthLayout
      title="Sign in"
      intro="Your tickets, saved objects and recommendations."
      footer={
        <p className="type-body-sm text-center text-muted">
          New here? <Link href="/register">Create an account</Link>
        </p>
      }
    >
      <Alert tone="info" title="Demo accounts" className="mb-5">
        visitor <code>amara@example.com</code> / <code>password123</code> · staff{' '}
        <code>admin@heritage.example</code> / <code>museum-demo</code>
      </Alert>
      {error && (
        <Alert tone="danger" title="We couldn't sign you in" className="mb-5">
          {error}
        </Alert>
      )}
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field label="Email address" htmlFor="si-e" required>
          <Input
            id="si-e"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password" htmlFor="si-p" required>
          <Input
            id="si-p"
            type="password"
            autoComplete="current-password"
            required
            invalid={!!error}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Checkbox
            id="si-r"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link href="/forgot-password" className="type-body-sm">
            Forgot your password?
          </Link>
        </div>
        <Button type="submit" size="lg" fullWidth>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
