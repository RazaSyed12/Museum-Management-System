'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/forms/Button';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Alert } from '@/components/feedback/Alert';
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
  generateBookingRef,
  type TicketQty,
} from '@/lib/ticketing';

export interface PaymentScreenProps {
  event: MuseumEvent;
  qty: TicketQty;
  contact: { name: string; email: string };
}

export function PaymentScreen({ event, qty, contact }: PaymentScreenProps) {
  const router = useRouter();
  const { isMember } = useAuth();
  const types = ticketTypesFor(event);
  const order = computeOrder(qty, types, isMember);
  const free = order.total === 0;
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');

  function confirm() {
    setStatus('loading');
    const params = new URLSearchParams(window.location.search);
    params.set('ref', generateBookingRef());
    setTimeout(() => router.push(`/tickets/${event.id}/confirmation?${params}`), 600);
  }

  return (
    <FlowFrame
      step={2}
      title={free ? 'Confirm your free tickets' : 'Payment'}
      aside={
        <Summary
          lines={[...ticketTypeLines(qty, types), ...orderBreakdownLines(order)]}
          total={money(order.total)}
          footer={
            <Button fullWidth size="lg" loading={status === 'loading'} onClick={confirm}>
              {free ? 'Confirm reservation' : `Pay ${money(order.total)}`}
            </Button>
          }
        />
      }
    >
      <Alert tone="info" title="Prototype payment screen">
        No card is charged. Use the buttons below to preview the success and failure states.
      </Alert>
      {status === 'failed' && (
        <Alert tone="danger" title="Payment declined" onDismiss={() => setStatus('idle')}>
          {contact.name ? `${contact.name}, your` : 'Your'} card was not charged. Check the number
          and expiry date, or try another card.
        </Alert>
      )}
      {free ? (
        <div className="grid gap-3 rounded-lg border border-line-subtle bg-surface-card p-6">
          <h2 className="type-h3">No payment needed</h2>
          <p className="type-body">
            This event is free. We only need your email so we can send the tickets and let you know
            if anything changes.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 rounded-lg border border-line-subtle bg-surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="type-h3">Card details</h2>
            <span className="type-body-sm flex items-center gap-1.5 text-muted">
              <Icon name="lock" size={14} />
              Secure form
            </span>
          </div>
          <Field label="Cardholder name" htmlFor="p1" required>
            <Input id="p1" placeholder="As printed on the card" defaultValue={contact.name} />
          </Field>
          <Field
            label="Card number"
            htmlFor="p2"
            required
            error={status === 'failed' ? 'This card was declined' : undefined}
          >
            <Input
              id="p2"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              invalid={status === 'failed'}
              iconLeft="credit-card"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry" htmlFor="p3" required>
              <Input id="p3" placeholder="MM / YY" />
            </Field>
            <Field label="Security code" htmlFor="p4" required hint="Three digits on the back">
              <Input id="p4" placeholder="123" />
            </Field>
          </div>
          <Field label="Billing postcode" htmlFor="p5" required>
            <Input id="p5" placeholder="SE1 4XN" />
          </Field>
          <div className="flex flex-wrap gap-3 border-t border-dashed border-line-default pt-2">
            <Button variant="secondary" size="sm" onClick={confirm}>
              Preview successful payment
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setStatus('failed')}>
              Preview failed payment
            </Button>
          </div>
        </div>
      )}
    </FlowFrame>
  );
}
