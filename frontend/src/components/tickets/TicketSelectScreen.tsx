'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Alert } from '@/components/feedback/Alert';
import { QuantityStepper } from '@/components/forms/QuantityStepper';
import { Media } from '@/components/foundation/Media';
import { FlowFrame } from './FlowFrame';
import { Summary } from './Summary';
import { useAuth } from '@/lib/auth';
import { useCurrency } from '@/lib/useCurrency';
import { cn } from '@/lib/cn';
import type { MuseumEvent } from '@/lib/api/events';
import { BOOKING_CURRENCY, type Allocation } from '@/lib/api/bookings';
import { ticketTypesFor, computeOrder, ticketTypeLines, qtyToSearchParams, selectedBooking, money, type TicketQty, type TicketType } from '@/lib/ticketing';

export interface TicketSelectScreenProps {
  event: MuseumEvent;
  initialQty: TicketQty;
  /** Real backend only: the event's ticket types. Absent while the flow runs on mock data. */
  allocations?: Allocation[];
}

const NONE: TicketQty = { general: 0, member: 0, child: 0 };
/** The backend allows 1–10 tickets per booking. */
const MAX_PER_BOOKING = 10;

export function TicketSelectScreen({ event, initialQty, allocations }: TicketSelectScreenProps) {
  const router = useRouter();
  const { user, ready, isMember } = useAuth();
  const { currency: localCurrency, format: formatLocal } = useCurrency();
  const real = Boolean(allocations);
  // Real bookings are charged in AUD; the mock flow keeps labelling in the visitor's locale currency.
  const currency = real ? BOOKING_CURRENCY : localCurrency;
  const format = (n: number) => (real ? money(n, BOOKING_CURRENCY) : formatLocal(n));
  const types = ticketTypesFor(event, allocations);
  const [qty, setQty] = useState<TicketQty>(() => {
    if (!real) return initialQty;
    // One ticket type per booking: keep the first type that has a count and
    // fall back to the first type on offer (members-only types stay locked for non-members).
    const usable = types.filter((t) => (t.available ?? 0) > 0 && !(t.memberOnly && !isMember));
    const requested = types.find((t) => (t.available ?? 0) > 0 && initialQty[t.key] > 0 &&
      (!initialQty.allocationId || t.allocationId === initialQty.allocationId));
    const first = requested ?? usable[0];
    return first ? { ...NONE, allocationId: first.allocationId, [first.key]: Math.min(MAX_PER_BOOKING, first.available ?? 0, Math.max(1, initialQty[first.key])) } : NONE;
  });
  const order = computeOrder(qty, types, isMember);
  const placesLeft = real ? types.reduce((n, t) => n + (t.available ?? 0), 0) : event.remaining;
  const needsSignIn = real && ready && !user;
  const blocked = event.availability !== 'available' && event.availability !== 'limited';
  const selected = selectedBooking(qty, types);
  const canContinue = !blocked && order.count > 0 && (!real || (ready && !needsSignIn && selected &&
    selected.quantity <= (selected.type.available ?? 0) && !(selected.type.memberOnly && !isMember)));

  function setQuantity(type: TicketType, value: number) {
    // Real bookings cover one ticket type, so choosing a count on one row clears the others.
    setQty((q) => (real ? { ...NONE, allocationId: type.allocationId, [type.key]: value } : { ...q, [type.key]: value }));
  }

  function continueToCheckout() {
    if (!canContinue) return;
    router.push(`/tickets/${event.id}/checkout?${qtyToSearchParams(qty)}`);
  }

  return (
    <FlowFrame
      step={0}
      title="Choose your tickets"
      aside={
        <Summary
          lines={ticketTypeLines(qty, types, currency)}
          total={money(order.sub, currency)}
          note={real ? 'Tax, service fee and any member discount are confirmed at checkout.' : 'Fees and any member discount are shown at checkout.'}
          footer={<Button fullWidth size="lg" disabled={!canContinue} onClick={continueToCheckout}>Continue to checkout</Button>}
        />
      }
    >
      <div className="flex items-center gap-4 rounded-lg bg-surface-sunken p-4">
        <Media src={event.image} ratio="4 / 3" tone="green" caption="" className="w-27.5 flex-none" />
        <div className="grid gap-1">
          <h2 className="type-h3">{event.title}</h2>
          <span className="type-body-sm text-body">{event.date} · {event.time} · {event.location}</span>
          <div className="mt-1 flex flex-wrap gap-2">
            <StatusBadge tone={placesLeft > 0 ? 'warning' : 'danger'} size="sm">
              {event.availability === 'cancelled' ? 'Cancelled' : event.availability === 'completed' ? 'Booking closed' : types.length === 0 ? 'Not on sale' : placesLeft > 0 ? `${placesLeft} places left` : 'Sold out'}
            </StatusBadge>
            {isMember && <StatusBadge tone="member" size="sm">Member price applied below</StatusBadge>}
          </div>
        </div>
      </div>

      {needsSignIn && (
        <Alert tone="info" title="Sign in to book" action={<Button variant="secondary" size="sm" as="a" href="/sign-in">Sign in</Button>}>
          Tickets are held against your account, so you need to be signed in to continue.
        </Alert>
      )}

      {!isMember && event.memberPrice != null && (
        <Alert tone="info" title={`Members pay ${format(event.memberPrice)}`} action={<Button variant="secondary" size="sm" as="a" href="/membership">See membership</Button>}>
          Membership pays for itself in four visits, and member tickets are held until 48 hours before.
        </Alert>
      )}

      {real && types.length === 0 && (
        <Alert tone="warning" title="No tickets on sale">This event has no ticket types set up yet. Please check back soon.</Alert>
      )}

      <div className="grid gap-3">
        {types.map((t) => {
          const locked = t.memberOnly && !isMember;
          const soldOut = real && (t.available ?? 0) <= 0;
          const max = real ? Math.min(MAX_PER_BOOKING, t.available ?? 0) : Math.min(6, event.remaining);
          return (
            <div key={t.allocationId ?? t.key} className={cn('flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line-subtle bg-surface-card p-5', (locked || soldOut) && 'opacity-60')}>
              <div className="grid min-w-50 gap-1">
                <span className="type-label flex items-center gap-2 text-heading">
                  {t.name}
                  {t.memberOnly && <StatusBadge tone="member" size="sm">Members only</StatusBadge>}
                  {soldOut && <StatusBadge tone="danger" size="sm">Sold out</StatusBadge>}
                </span>
                <span className="type-body-sm text-muted">{locked ? 'Sign in with a membership to unlock this price' : t.description}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-body text-md leading-none font-semibold text-heading">{t.price === 0 ? 'Free' : format(t.price)}</span>
                <QuantityStepper label={t.name} value={!real || selected?.type.allocationId === t.allocationId ? qty[t.key] : 0} max={max} disabled={blocked || locked || soldOut}
                  onChange={(v) => setQuantity(t, v)} />
              </div>
            </div>
          );
        })}
      </div>
      {real && <p className="type-body-sm text-muted">One ticket type per booking, up to {MAX_PER_BOOKING} tickets. To buy two types, make two bookings.</p>}
      <p className="type-body-sm text-muted">Free events are reserved the same way — you will not be asked for payment details.</p>
    </FlowFrame>
  );
}
