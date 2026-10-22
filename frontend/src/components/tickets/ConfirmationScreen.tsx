'use client';

import { Fragment } from 'react';
import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { FlowFrame } from './FlowFrame';
import { Summary } from './Summary';
import { useAuth } from '@/lib/auth';
import type { MuseumEvent } from '@/lib/api/events';
import {
  ticketTypesFor,
  computeOrder,
  ticketTypeLines,
  orderBreakdownLines,
  money,
  type TicketQty,
} from '@/lib/ticketing';

export interface ConfirmationScreenProps {
  event: MuseumEvent;
  qty: TicketQty;
  contact: { name: string; email: string };
  bookingRef: string;
}

export function ConfirmationScreen({ event, qty, contact, bookingRef }: ConfirmationScreenProps) {
  const { isMember } = useAuth();
  const types = ticketTypesFor(event);
  const order = computeOrder(qty, types, isMember);
  const ticketLine = types.find((t) => qty[t.key] > 0);

  return (
    <FlowFrame
      step={3}
      title="You're going"
      aside={
        <Summary
          lines={[...ticketTypeLines(qty, types), ...orderBreakdownLines(order)]}
          total={money(order.total)}
          note="A receipt has been emailed to you."
          footer={
            <div className="grid gap-3">
              <Button fullWidth as="a" href="/account">
                View my tickets
              </Button>
              <Button fullWidth variant="secondary" as="a" href="/events">
                Back to events
              </Button>
            </div>
          }
        />
      }
    >
      <div className="flex items-start gap-4 rounded-lg border border-[#A8CDB4] bg-success-100 p-6">
        <Icon name="check-circle-2" size={28} className="text-success-700" />
        <div className="grid gap-1.5">
          <h2 className="type-h3 text-success-700">Booking confirmed</h2>
          <p className="type-body text-body">
            We have emailed your tickets to {contact.email || 'you'}. Show the QR code on your phone
            at the entrance.
          </p>
        </div>
      </div>

      <div className="grid items-center gap-6 rounded-lg border border-line-subtle bg-surface-card p-6 md:grid-cols-[1fr_180px]">
        <div className="grid gap-3">
          <span className="type-eyebrow tracking-wider text-muted uppercase">
            Booking reference
          </span>
          <span className="font-display text-2xl/none tracking-wide text-heading">
            {bookingRef}
          </span>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 type-body-sm">
            {(
              [
                ['Event', event.title],
                ['Date', `${event.date} · ${event.time}`],
                ['Location', event.location],
                ['Tickets', `${order.count} × ${ticketLine?.name ?? 'ticket'}`],
                ['Total paid', money(order.total)],
                ['Booked by', contact.name || 'Guest'],
              ] as const
            ).map(([k, v]) => (
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
    </FlowFrame>
  );
}
