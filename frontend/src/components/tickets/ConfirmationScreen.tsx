'use client';

import { Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { Icon } from '@/components/foundation/Icon';
import { FlowFrame } from './FlowFrame';
import { Summary } from './Summary';
import { useAuth } from '@/lib/auth';
import { useCurrency } from '@/lib/useCurrency';
import type { MuseumEvent } from '@/lib/api/events';
import { BOOKING_CURRENCY, getAccessToken, getBooking, type Allocation, type PlacedBooking } from '@/lib/api/bookings';
import { ticketTypesFor, computeOrder, ticketTypeLines, orderBreakdownLines, quoteLines, money, type TicketQty } from '@/lib/ticketing';

export interface ConfirmationScreenProps {
  event: MuseumEvent;
  qty: TicketQty;
  contact: { name: string; email: string };
  bookingRef: string;
  /** Real backend only: read the booking back so this page shows what was actually booked. */
  allocations?: Allocation[];
  bookingId?: string;
}

export function ConfirmationScreen({ event, qty, contact, bookingRef, allocations, bookingId }: ConfirmationScreenProps) {
  const { user, isMember } = useAuth();
  const { currency: localCurrency } = useCurrency();
  const real = Boolean(allocations && bookingId);
  const currency = real ? BOOKING_CURRENCY : localCurrency;
  const types = ticketTypesFor(event, allocations);
  const order = computeOrder(qty, types, isMember);
  const ticketLine = types.find((t) => qty[t.key] > 0);

  const [booking, setBooking] = useState<PlacedBooking>();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!real || !bookingId || !user) return;
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    getBooking(token, bookingId)
      .then((b) => !cancelled && setBooking(b))
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, [real, bookingId, user]);

  // Real: the server's booking is the source of truth. Mock: the local order.
  const confirmed = !real || booking?.status === 'confirmed';
  const shownRef = booking?.ref ?? bookingRef;
  const count = booking?.quantity ?? order.count;
  const paid = booking ? booking.total : order.total;
  const summaryLines = real
    ? [...ticketTypeLines(qty, types, currency).filter((l) => !l.muted), ...(booking ? quoteLines(booking, currency) : [])]
    : [...ticketTypeLines(qty, types, currency), ...orderBreakdownLines(order, currency)];

  return (
    <FlowFrame
      step={3}
      title="You're going"
      aside={
        <Summary
          lines={summaryLines}
          total={money(paid, currency)}
          note="A receipt has been emailed to you."
          footer={
            <div className="grid gap-3">
              <Button fullWidth as="a" href="/account">View my tickets</Button>
              <Button fullWidth variant="secondary" as="a" href="/events">Back to events</Button>
            </div>
          }
        />
      }
    >
      {loadError && (
        <Alert tone="warning" title="We couldn’t load the booking details">
          Your payment may still have gone through. Check <a href="/account">your account</a> for this booking.
        </Alert>
      )}
      {real && booking && !confirmed && (
        <Alert tone="warning" title="This booking isn’t confirmed">
          Its status is “{booking.status}”. Check <a href="/account">your account</a> or start a new booking.
        </Alert>
      )}
      {confirmed && (
        <div className="flex items-start gap-4 rounded-lg border border-[#A8CDB4] bg-success-100 p-6">
          <Icon name="check-circle-2" size={28} className="text-success-700" />
          <div className="grid gap-1.5">
            <h2 className="type-h3 text-success-700">Booking confirmed</h2>
            <p className="type-body text-body">
              We have emailed your tickets to {contact.email || 'you'}. Show the QR code on your phone at the entrance.
            </p>
          </div>
        </div>
      )}

      <div className="grid items-center gap-6 rounded-lg border border-line-subtle bg-surface-card p-6 md:grid-cols-[1fr_180px]">
        <div className="grid gap-3">
          <span className="type-eyebrow tracking-wider text-muted uppercase">Booking reference</span>
          <span className="font-display text-2xl/none tracking-wide text-heading">{shownRef}</span>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 type-body-sm">
            {([
              ['Event', event.title],
              ['Date', `${event.date} · ${event.time}`],
              ['Location', event.location],
              ['Tickets', `${count} × ${ticketLine?.name ?? 'ticket'}`],
              ['Total paid', money(paid, currency)],
              ['Booked by', contact.name || 'Guest'],
            ] as const).map(([k, v]) => (
              <Fragment key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="m-0 text-heading">{v}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
        <div className="grid justify-items-center gap-2">
          <div className="grid size-35 place-items-center rounded-md border border-line-default bg-surface-sunken">
            <Icon name="qr-code" size={92} className="text-green-900" />
          </div>
          <span className="type-body-sm text-muted">Placeholder QR</span>
        </div>
      </div>

      {booking && booking.ticketCodes.length > 0 && (
        <div className="grid gap-3 rounded-lg border border-line-subtle bg-surface-card p-6">
          <h2 className="type-h3">Your ticket codes</h2>
          <ul className="m-0 grid list-none gap-2 p-0">
            {booking.ticketCodes.map((code) => (
              <li key={code} className="type-body-sm flex items-center gap-2 font-mono text-heading">
                <Icon name="ticket" size={16} className="text-olive-500" />
                {code}
              </li>
            ))}
          </ul>
        </div>
      )}
    </FlowFrame>
  );
}
