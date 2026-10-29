'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Checkbox } from '@/components/forms/Checkbox';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { useAuth } from '@/lib/auth';

/** Staff sign in through the same form and land on the client site like
 *  anyone else (always onboarding_completed — see backend/src/routes/me.ts);
 *  they reach the staff portal from the "Staff Portal" button on /account. */
function destinationFor(onboardingCompleted: boolean): string {
  return onboardingCompleted ? '/account' : '/interests';
}

export function SignInScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string>();

  // Already signed in (e.g. a stored session rehydrated) — don't show the form, just go.
  useEffect(() => {
    if (auth.ready && auth.user) router.replace(destinationFor(auth.user.onboardingCompleted));
  }, [auth.ready, auth.user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await auth.signIn(email, password, rememberMe);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(destinationFor(result.onboardingCompleted));
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
