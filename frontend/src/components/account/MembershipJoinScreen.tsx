'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Icon } from '@/components/foundation/Icon';
import { Summary } from '@/components/tickets/Summary';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api/client';
import { money } from '@/lib/ticketing';
import {
  MEMBERSHIP_CURRENCY,
  formatMemberDate,
  getMemberAccessToken,
  getPlans,
  planPeriod,
  purchasePlan,
  type MembershipPlan,
  type MyMembership,
} from '@/lib/api/membership';

/** Buying a membership plan against the real backend. Payment is simulated
 *  (no card is charged); once it settles the account is refreshed so the
 *  member price applies straight away. */
export function MembershipJoinScreen({ planId }: { planId?: string }) {
  const auth = useAuth();
  const [plan, setPlan] = useState<MembershipPlan | null | undefined>(undefined); // null = not found
  const [loadError, setLoadError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [failure, setFailure] = useState<string>();
  const [done, setDone] = useState<MyMembership>();

  useEffect(() => {
    let cancelled = false;
    getPlans()
      .then((all) => !cancelled && setPlan(all.find((p) => p.id === planId) ?? null))
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, [planId]);

  async function pay(simulate?: 'success' | 'card_declined') {
    const token = getMemberAccessToken();
    if (!plan) return;
    if (!token) {
      setFailure('Your session has expired. Please sign in again.');
      setStatus('failed');
      return;
    }
    setStatus('loading');
    setFailure(undefined);
    try {
      const membership = await purchasePlan(token, plan.id, simulate);
      // Re-read the account so the member price and members-only tickets apply straight away.
      await auth.refreshUser();
      setDone(membership);
      setStatus('idle');
    } catch (err) {
      setFailure(
        err instanceof ApiError
          ? err.message
          : 'We couldn’t reach the payment service. You haven’t been charged — please try again.',
      );
      setStatus('failed');
    }
  }

  const price = plan ? (plan.price === 0 ? 'Free' : money(plan.price, MEMBERSHIP_CURRENCY)) : '';
  const alreadyMember = auth.isMember && !done;
  const blocked = !plan || !auth.ready || !auth.user || alreadyMember || Boolean(done);

  return (
    <Container className="grid gap-8 py-10 md:py-14">
      <div className="grid gap-2">
        <span className="type-eyebrow tracking-wider text-gold-700 uppercase">Membership</span>
        <h1 className="text-4xl/tight">{done ? 'Welcome, member' : 'Join the museum'}</h1>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-5">
          {loadError && (
            <Alert tone="danger" title="We couldn’t load this membership">
              Please go back and try again in a moment.
            </Alert>
          )}
          {plan === null && (
            <Alert
              tone="warning"
              title="That membership isn’t available"
              action={<Button variant="secondary" size="sm" as="a" href="/membership">See memberships</Button>}
            >
              It may no longer be on sale.
            </Alert>
          )}
          {auth.ready && !auth.user && (
            <Alert tone="info" title="Sign in to join" action={<Button variant="secondary" size="sm" as="a" href="/sign-in">Sign in</Button>}>
              Memberships belong to an account, so you need to be signed in to buy one.
            </Alert>
          )}
          {alreadyMember && (
            <Alert tone="info" title="You’re already a member" action={<Button variant="secondary" size="sm" as="a" href="/account">Your account</Button>}>
              Your membership is active. There’s nothing more to buy.
            </Alert>
          )}
          {status === 'failed' && (
            <Alert tone="danger" title="Payment didn’t go through" onDismiss={() => setStatus('idle')}>
              {failure}
            </Alert>
          )}

          {done ? (
            <div className="grid gap-4 rounded-lg border border-line-subtle bg-surface-card p-6">
              <StatusBadge tone="member" icon="badge-check">Active member</StatusBadge>
              <h2 className="type-h3">{done.plan.name}</h2>
              <p className="type-body">
                Your membership is active{done.endsAt ? ` until ${formatMemberDate(done.endsAt)}` : ''}. The member price now applies
                automatically when you book tickets, and members-only tickets are unlocked.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button as="a" href="/events">Browse events</Button>
                <Button variant="secondary" as="a" href="/account">Your account</Button>
              </div>
            </div>
          ) : (
            plan && (
              <div className="grid gap-4 rounded-lg border border-line-subtle bg-surface-card p-6">
                <h2 className="type-h3">{plan.name}</h2>
                {plan.description && <p className="type-body">{plan.description}</p>}
                {plan.benefits.length > 0 && (
                  <ul className="grid gap-2">
                    {plan.benefits.map((b) => (
                      <li key={b.id} className="type-body-sm flex gap-2">
                        <Icon name="check" size={16} className="mt-0.5 flex-none text-olive-600" />
                        {b.label}
                      </li>
                    ))}
                  </ul>
                )}
                <Alert tone="info" title="Prototype payment">
                  Payments are simulated: no card is charged. The buttons choose the simulated outcome.
                </Alert>
                <div className="flex flex-wrap gap-3 border-t border-dashed border-line-default pt-4">
                  <Button variant="secondary" size="sm" disabled={blocked} onClick={() => pay('success')}>
                    Preview successful payment
                  </Button>
                  <Button variant="ghost" size="sm" disabled={blocked} onClick={() => pay('card_declined')}>
                    Preview failed payment
                  </Button>
                </div>
              </div>
            )
          )}
        </div>

        {plan && !done && (
          <Summary
            lines={[{ label: `${plan.name} membership`, value: price }]}
            total={price}
            note={`Valid for ${plan.durationMonths === 12 ? 'one year' : planPeriod(plan.durationMonths)} from today.`}
            footer={
              <Button fullWidth size="lg" loading={status === 'loading'} disabled={blocked} onClick={() => pay()}>
                {plan.price === 0 ? 'Join for free' : `Pay ${price}`}
              </Button>
            }
          />
        )}
      </div>
    </Container>
  );
}
