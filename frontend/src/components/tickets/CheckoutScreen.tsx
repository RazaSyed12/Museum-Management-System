'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/forms/Button';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Checkbox } from '@/components/forms/Checkbox';
import { RadioGroup } from '@/components/forms/RadioGroup';
import { Alert } from '@/components/feedback/Alert';
import { FlowFrame } from './FlowFrame';
import { Summary } from './Summary';
import { useAuth } from '@/lib/auth';
import { useCurrency } from '@/lib/useCurrency';
import { ApiError } from '@/lib/api/client';
import { newsletterMockingDisabled, subscribeQuietly } from '@/lib/api/newsletter';
import type { MuseumEvent } from '@/lib/api/events';
import { BOOKING_CURRENCY, createBooking, getAccessToken, quoteBooking, type Allocation, type BookingQuote } from '@/lib/api/bookings';
import { ticketTypesFor, computeOrder, ticketTypeLines, orderBreakdownLines, quoteLines, selectedBooking, money, type TicketQty } from '@/lib/ticketing';

export interface CheckoutScreenProps {
  event: MuseumEvent;
  qty: TicketQty;
  /** Real backend only: the event's ticket types. Absent while the flow runs on mock data. */
  allocations?: Allocation[];
}

const HEARD_OPTIONS = ['Friend or family', 'Social media', 'Newsletter', 'Walked past'];
const ACCESS_OPTIONS = [{ value: 'none', label: 'No requirements' }, { value: 'wheel', label: 'Wheelchair space needed' }, { value: 'bsl', label: 'BSL interpretation' }];

function errorText(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 401) return 'Your session has expired. Please sign in again to continue.';
    return e.message;
  }
  return 'Something went wrong reaching the booking service. Please try again.';
}

export function CheckoutScreen({ event, qty, allocations }: CheckoutScreenProps) {
  const router = useRouter();
  const { user, ready, isMember } = useAuth();
  const { currency: localCurrency, format: formatLocal } = useCurrency();
  const real = Boolean(allocations);
  const currency = real ? BOOKING_CURRENCY : localCurrency;
  const format = (n: number) => (real ? money(n, BOOKING_CURRENCY) : formatLocal(n));
  const types = ticketTypesFor(event, allocations);
  const order = computeOrder(qty, types, isMember);
  const chosen = selectedBooking(qty, types);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [access, setAccess] = useState('none');
  const [newsletter, setNewsletter] = useState(false);

  const [quote, setQuote] = useState<BookingQuote>();
  const [quoteError, setQuoteError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const allocationId = chosen?.type.allocationId;
  const quantity = chosen?.quantity;

  // The user object arrives after the first render (session check), so fill the form once it does.
  useEffect(() => {
    if (user) {
      setName((n) => n || user.name);
      setEmail((m) => m || user.email);
    }
  }, [user]);

  // Real backend: price the order on the server (tax, service fee and member discount are its numbers).
  useEffect(() => {
    if (!real || !user || !allocationId || !quantity) return;
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    setQuote(undefined);
    setQuoteError(undefined);
    quoteBooking(token, allocationId, quantity)
      .then((q) => !cancelled && setQuote(q))
      .catch((e) => !cancelled && setQuoteError(errorText(e)));
    return () => {
      cancelled = true;
    };
  }, [real, user, allocationId, quantity]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.set('name', name);
    params.set('email', email);
    if (phone) params.set('phone', phone); else params.delete('phone');
    params.set('access', access);

    // Real newsletter backend: honour the "Email me what's on" box (best-effort, never blocks the booking).
    if (newsletter && email && newsletterMockingDisabled()) void subscribeQuietly(email, getAccessToken());

    if (real) {
      const token = getAccessToken();
      if (!token || !allocationId || !quantity) {
        setSubmitError('Please sign in again to continue.');
        return;
      }
      setSubmitting(true);
      setSubmitError(undefined);
      try {
        // Placing the booking holds the tickets for 15 minutes while the visitor pays.
        const booking = await createBooking(token, allocationId, quantity);
        params.set('booking', booking.id);
        router.push(`/tickets/${event.id}/payment?${params}`);
      } catch (err) {
        setSubmitError(errorText(err));
        setSubmitting(false);
      }
      return;
    }
    router.push(`/tickets/${event.id}/payment?${params}`);
  }

  const needsSignIn = real && ready && !user;
  const summaryLines = real
    ? [...ticketTypeLines(qty, types, currency).filter((l) => !l.muted), ...(quote ? quoteLines(quote, currency) : [])]
    : [...ticketTypeLines(qty, types, currency), ...orderBreakdownLines(order, currency)];
  const total = real ? (quote ? money(quote.total, currency) : money(order.sub, currency)) : money(order.total, currency);
  const discount = real ? (quote?.discountAmount ?? 0) : isMember ? order.discount : 0;

  return (
    <FlowFrame
      step={1}
      title="Check your order"
      aside={
        <Summary
          lines={summaryLines}
          total={total}
          note={
            real
              ? quote
                ? `Tickets are held for ${quote.holdMinutes} minutes once you continue. You will not be charged until the next step.`
                : 'Pricing your order…'
              : 'You will not be charged until the next step.'
          }
          footer={
            <Button fullWidth size="lg" type="submit" form="checkout-form" loading={submitting} disabled={real && (needsSignIn || !ready || !quote)}>
              Continue to payment
            </Button>
          }
        />
      }
    >
      {needsSignIn && (
        <Alert tone="info" title="Sign in to book" action={<Button variant="secondary" size="sm" as="a" href="/sign-in">Sign in</Button>}>
          Tickets are held against your account, so you need to be signed in to continue.
        </Alert>
      )}
      {real && !chosen && ready && (
        <Alert tone="warning" title="Choose one ticket type" action={<Button variant="secondary" size="sm" as="a" href={`/tickets/${event.id}`}>Back to tickets</Button>}>
          A booking covers one ticket type. Go back and pick a single type to continue.
        </Alert>
      )}
      {quoteError && <Alert tone="danger" title="We couldn’t price this order" action={<Button variant="secondary" size="sm" as="a" href={`/tickets/${event.id}`}>Change tickets</Button>}>{quoteError}</Alert>}
      {submitError && <Alert tone="danger" title="We couldn’t hold these tickets" onDismiss={() => setSubmitError(undefined)}>{submitError}</Alert>}

      <form id="checkout-form" className="grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 rounded-lg border border-line-subtle bg-surface-card p-6">
          <h2 className="type-h3">Your details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" htmlFor="cn" required>
              <Input id="cn" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Amara Okafor" />
            </Field>
            <Field label="Email address" htmlFor="ce" required hint="Your tickets are sent here.">
              <Input id="ce" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Phone" htmlFor="cp" optional>
              <Input id="cp" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="How did you hear about us?" htmlFor="ch" optional>
              <Select id="ch" placeholder="Select an option" options={HEARD_OPTIONS} />
            </Field>
          </div>
          <Checkbox id="nl" label="Email me what's on" description="Monthly, and never shared." checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
        </div>
        <div className="grid gap-4 rounded-lg border border-line-subtle bg-surface-card p-6">
          <h2 className="type-h3">Access requirements</h2>
          <RadioGroup name="access" value={access} onChange={setAccess} options={ACCESS_OPTIONS} />
        </div>
        {discount > 0 && (
          <Alert tone="success" title="Member discount applied">{format(discount)} has been taken off this order.</Alert>
        )}
      </form>
    </FlowFrame>
  );
}
