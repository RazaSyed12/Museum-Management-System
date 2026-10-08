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

const MIN_PASSWORD_LENGTH = 10;

export function RegisterScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [error, setError] = useState<string>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) { setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    const result = auth.register({ name, email, password });
    if (!result.ok) { setError(result.error); return; }
    router.push('/interests');
  }

  return (
    <AuthLayout
      title="Create an account"
      intro="It takes a minute and keeps every booking in one place."
      footer={
        <p className="type-body-sm text-center text-muted">
          Already have one? <Link href="/sign-in">Sign in</Link>
        </p>
      }
    >
      <Alert tone="info" title="An account is not a membership" className="mb-5">
        Accounts are free. Membership is a paid supporter scheme with discounts and reserved tickets — you can add it later.
      </Alert>
      {error && <Alert tone="danger" title="Couldn't create your account" className="mb-5">{error}</Alert>}
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field label="Full name" htmlFor="r-n" required>
          <Input id="r-n" autoComplete="name" required placeholder="Amara Okafor" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email address" htmlFor="r-e" required>
          <Input id="r-e" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="r-p" required hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
          <Input id="r-p" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field label="Confirm password" htmlFor="r-p2" required>
          <Input id="r-p2" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Field>
        <Checkbox id="r-nl" label="Email me what's on" description="Monthly exhibition news. Unsubscribe any time." checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
        <Button type="submit" size="lg" fullWidth>Create account</Button>
      </form>
    </AuthLayout>
  );
}
