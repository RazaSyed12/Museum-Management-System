'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/forms/Button';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Alert } from '@/components/feedback/Alert';
import { Icon } from '@/components/foundation/Icon';
import { FlowFrame } from './FlowFrame';
import { Summary } from './Summary';
import { useAuth } from '@/lib/auth';
import { useCurrency } from '@/lib/useCurrency';
import { ApiError } from '@/lib/api/client';
import type { MuseumEvent } from '@/lib/api/events';
import { BOOKING_CURRENCY, bookingRef, getAccessToken, getBooking, payBooking, type Allocation, type PlacedBooking } from '@/lib/api/bookings';
import { ticketTypesFor, computeOrder, ticketTypeLines, orderBreakdownLines, quoteLines, money, generateBookingRef, type TicketQty } from '@/lib/ticketing';

export interface PaymentScreenProps {
  event: MuseumEvent;
  qty: TicketQty;
  contact: { name: string; email: string };
  /** Real backend only. */
  allocations?: Allocation[];
  bookingId?: string;
}

function holdUntil(iso?: string): string | undefined {
  if (!iso) return undefined;
  return new Intl.DateTimeFormat('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Adelaide' }).format(new Date(iso));
}

export function PaymentScreen({ event, qty, contact, allocations, bookingId }: PaymentScreenProps) {
  const router = useRouter();
  const { user, ready, isMember } = useAuth();
  const { currency: localCurrency } = useCurrency();
  const real = Boolean(allocations && bookingId);
  const currency = real ? BOOKING_CURRENCY : localCurrency;
  const types = ticketTypesFor(event, allocations);
  const order = computeOrder(qty, types, isMember);

  const [booking, setBooking] = useState<PlacedBooking>();
  const [loadError, setLoadError] = useState<string>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [failure, setFailure] = useState<string>();

  // Real backend: load the held booking so the summary shows exactly what will be charged.
  useEffect(() => {
    if (!real || !bookingId || !user) return;
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    getBooking(token, bookingId)
      .then((b) => !cancelled && setBooking(b))
      .catch((e) => !cancelled && setLoadError(e instanceof ApiError && e.status === 404 ? 'We couldn’t find this booking. It may belong to another account.' : 'We couldn’t load this booking.'));
    return () => {
      cancelled = true;
    };
  }, [real, bookingId, user]);

  const total = real ? (booking?.total ?? order.sub) : order.total;
  const free = real ? booking?.total === 0 : order.total === 0;
  const closed = real && booking && booking.status !== 'pending' && booking.status !== 'confirmed';

  async function pay(simulate?: 'success' | 'card_declined') {
    setStatus('loading');
    setFailure(undefined);
    const params = new URLSearchParams(window.location.search);

    if (real && bookingId) {
      const token = getAccessToken();
      if (!token) {
        setFailure('Your session has expired. Please sign in again.');
        setStatus('failed');
        return;
      }
      try {
        const paid = await payBooking(token, bookingId, simulate);
        params.set('ref', paid.ref);
        router.push(`/tickets/${event.id}/confirmation?${params}`);
      } catch (err) {
        setFailure(err instanceof ApiError ? err.message : 'We couldn’t reach the payment service. You haven’t been charged — please try again.');
        setStatus('failed');
        // The hold may have run out or the payment may have been recorded as failed; refresh what we show.
        getBooking(token, bookingId).then(setBooking).catch(() => undefined);
      }
      return;
    }

    params.set('ref', generateBookingRef());
    setTimeout(() => router.push(`/tickets/${event.id}/confirmation?${params}`), 600);
  }

  const lines = real
    ? [...ticketTypeLines(qty, types, currency).filter((l) => !l.muted), ...(booking ? quoteLines(booking, currency) : [])]
    : [...ticketTypeLines(qty, types, currency), ...orderBreakdownLines(order, currency)];

  return (
    <FlowFrame
      step={2}
      title={free ? 'Confirm your free tickets' : 'Payment'}
      aside={
        <Summary
          lines={lines}
          total={money(total, currency)}
          note={real && booking?.status === 'pending' && holdUntil(booking.expiresAt) ? `Your tickets are held until ${holdUntil(booking.expiresAt)}.` : undefined}
          footer={
            <Button fullWidth size="lg" loading={status === 'loading'} disabled={Boolean(real && (!ready || !user || !booking || closed))} onClick={() => pay()}>
              {free ? 'Confirm reservation' : `Pay ${money(total, currency)}`}
            </Button>
          }
        />
      }
    >
      <Alert tone="info" title="Prototype payment screen">
        {real
          ? 'Payments are simulated: no card is charged. The success and failure buttons below choose the simulated outcome.'
          : 'No card is charged. Use the buttons below to preview the success and failure states.'}
      </Alert>
      {real && ready && !user && (
        <Alert tone="info" title="Sign in to pay" action={<Button variant="secondary" size="sm" as="a" href="/sign-in">Sign in</Button>}>
          This booking is held against your account.
        </Alert>
      )}
      {loadError && <Alert tone="danger" title="Booking not available">{loadError}</Alert>}
      {closed && (
        <Alert tone="warning" title="This booking is no longer open" action={<Button variant="secondary" size="sm" as="a" href={`/tickets/${event.id}`}>Start again</Button>}>
          The hold on these tickets has ended. Choose your tickets again to make a new booking.
        </Alert>
      )}
      {status === 'failed' && (
        <Alert tone="danger" title={real ? 'Payment didn’t go through' : 'Payment declined'} onDismiss={() => setStatus('idle')}>
          {failure ?? `${contact.name ? `${contact.name}, your` : 'Your'} card was not charged. Check the number and expiry date, or try another card.`}
        </Alert>
      )}
      {free ? (
        <div className="grid gap-3 rounded-lg border border-line-subtle bg-surface-card p-6">
          <h2 className="type-h3">No payment needed</h2>
          <p className="type-body">This event is free. We only need your email so we can send the tickets and let you know if anything changes.</p>
        </div>
      ) : (
        <div className="grid gap-5 rounded-lg border border-line-subtle bg-surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="type-h3">Card details</h2>
            <span className="type-body-sm flex items-center gap-1.5 text-muted"><Icon name="lock" size={14} />Secure form</span>
          </div>
          <Field label="Cardholder name" htmlFor="p1" required><Input id="p1" placeholder="As printed on the card" defaultValue={contact.name} /></Field>
          <Field label="Card number" htmlFor="p2" required error={status === 'failed' ? 'This card was declined' : undefined}>
            <Input id="p2" inputMode="numeric" placeholder="4242 4242 4242 4242" invalid={status === 'failed'} iconLeft="credit-card" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry" htmlFor="p3" required><Input id="p3" placeholder="MM / YY" /></Field>
            <Field label="Security code" htmlFor="p4" required hint="Three digits on the back"><Input id="p4" placeholder="123" /></Field>
          </div>
          <Field label="Billing postcode" htmlFor="p5" required><Input id="p5" placeholder="5000" /></Field>
          <div className="flex flex-wrap gap-3 border-t border-dashed border-line-default pt-2">
            <Button variant="secondary" size="sm" disabled={Boolean(real && (!booking || closed))} onClick={() => pay('success')}>Preview successful payment</Button>
            <Button variant="ghost" size="sm" disabled={Boolean(real && (!booking || closed))}
              onClick={() => (real ? pay('card_declined') : (setFailure(undefined), setStatus('failed')))}>Preview failed payment</Button>
          </div>
        </div>
      )}
      {real && booking && <p className="type-body-sm text-muted">Reference {bookingRef(booking.id)}</p>}
    </FlowFrame>
  );
}
