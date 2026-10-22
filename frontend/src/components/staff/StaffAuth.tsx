'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Logo } from '@/components/foundation/Logo';
import { Icon } from '@/components/foundation/Icon';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Checkbox } from '@/components/forms/Checkbox';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { staffApi } from '@/lib/api/staff';
import { useStaffSession } from '@/lib/staff/session';

export function StaffAuth({
  mode = 'login',
  token = '',
}: {
  mode?: 'login' | 'recover' | 'reset' | 'invite';
  token?: string;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const { login, user } = useStaffSession();
  const router = useRouter();
  const demo = process.env.NEXT_PUBLIC_API_MOCKING !== 'disabled';
  const title =
    mode === 'login'
      ? 'Staff sign in'
      : mode === 'recover'
        ? 'Reset your password'
        : mode === 'invite'
          ? 'Welcome to the museum'
          : 'Choose a new password';
  useEffect(() => {
    if (user && mode === 'login') router.replace('/staff');
  }, [user, mode, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email, password, remember);
        router.replace('/staff');
      } else if (mode === 'recover') {
        await staffApi.recover(email);
        setSent(true);
      } else {
        if (password !== confirm) throw new Error('The passwords do not match.');
        if (mode === 'invite') await staffApi.accept(token, password);
        else await staffApi.reset(token, password);
        setSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-surface-staff lg:grid-cols-[0.85fr_1fr]">
      <section className="hidden flex-col justify-between bg-green-900 p-16 text-paper-50 lg:flex">
        <Logo variant="mark" height={64} className="self-start shrink-0 object-contain" />
        <div>
          <span className="type-eyebrow tracking-wider text-sand-300 uppercase">
            Heritage Museum
          </span>
          <h1 className="mt-5 max-w-110 font-display text-5xl leading-tight text-paper-50">
            Care for the stories we share.
          </h1>
          <p className="mt-6 max-w-100 text-md text-paper-100/80">
            Your place to look after the collections, welcome visitors, and shape what comes next.
          </p>
        </div>
        <span className="text-sm text-sand-300">Our past. Our stories. Our future.</span>
      </section>
      <section className="grid place-items-center p-6 md:p-12">
        <div className="grid w-full max-w-110 gap-6">
          <Link href="/" className="flex items-center gap-2 text-sm no-underline">
            <Icon name="arrow-left" size={16} />
            Heritage Museum
          </Link>
          <div>
            <p className="type-eyebrow tracking-wider text-olive-600 uppercase">Staff portal</p>
            <h2 className="mt-3 type-h1">{title}</h2>
            <p className="mt-3 text-muted">
              {mode === 'login'
                ? 'Sign in with your museum staff account.'
                : mode === 'recover'
                  ? 'We will send a password reset link if your account is registered.'
                  : 'Use at least ten characters for your password.'}
            </p>
          </div>
          {error && (
            <Alert tone="danger" title="We could not complete that request">
              {error}
            </Alert>
          )}
          {sent ? (
            <Alert
              tone="success"
              title={mode === 'recover' ? 'Check your email' : 'Your password is set'}
            >
              {mode === 'recover'
                ? demo
                  ? 'This is a preview. No email is sent until the authentication API is connected.'
                  : 'If an account exists, a reset link will arrive shortly.'
                : 'You can now sign in with your staff account.'}
            </Alert>
          ) : (
            <form onSubmit={submit} className="grid gap-5">
              {(mode === 'login' || mode === 'recover') && (
                <Field label="Email address" htmlFor="staff-email" required>
                  <Input
                    id="staff-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
              )}
              {mode !== 'recover' && (
                <Field label="Password" htmlFor="staff-password" required>
                  <Input
                    id="staff-password"
                    type="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    minLength={mode === 'login' ? undefined : 10}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
              )}
              {(mode === 'reset' || mode === 'invite') && (
                <Field label="Confirm password" htmlFor="staff-confirm" required>
                  <Input
                    id="staff-confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </Field>
              )}
              {mode === 'login' && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Checkbox
                    id="staff-remember"
                    label="Remember me"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <Link href="/staff/forgot-password" className="text-sm">
                    Forgot password?
                  </Link>
                </div>
              )}
              <Button type="submit" loading={busy} fullWidth size="lg">
                {mode === 'login'
                  ? 'Sign in'
                  : mode === 'recover'
                    ? 'Send reset link'
                    : 'Set password'}
              </Button>
            </form>
          )}
          {mode !== 'login' && (
            <Link href="/staff/login" className="text-sm">
              Back to sign in
            </Link>
          )}
          {demo && mode === 'login' && (
            <div className="rounded-lg border border-line-subtle bg-paper-100 p-4 text-sm">
              <p className="type-label text-heading">Explore the prototype</p>
              <p className="mt-2 text-muted">
                Choose a role to fill its demo credentials. Changes stay in this browser.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Admin', 'Manager', 'Staff'].map((role) => (
                  <Button
                    key={role}
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEmail(`${role.toLowerCase()}@heritage.example`);
                      setPassword('museum-demo');
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
