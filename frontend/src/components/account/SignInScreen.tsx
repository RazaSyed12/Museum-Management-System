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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = auth.signIn(email, password, rememberMe);
    if (!result.ok) { setError(result.error); return; }
    router.push('/account');
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
      <Alert tone="info" title="Demo account" className="mb-5">
        email <code>amara@example.com</code> · password <code>password123</code>
      </Alert>
      {error && <Alert tone="danger" title="We couldn't sign you in" className="mb-5">{error}</Alert>}
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field label="Email address" htmlFor="si-e" required>
          <Input id="si-e" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="si-p" required>
          <Input id="si-p" type="password" autoComplete="current-password" required invalid={!!error} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Checkbox id="si-r" label="Remember me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <Link href="/forgot-password" className="type-body-sm">Forgot your password?</Link>
        </div>
        <Button type="submit" size="lg" fullWidth>Sign in</Button>
      </form>
    </AuthLayout>
  );
}
