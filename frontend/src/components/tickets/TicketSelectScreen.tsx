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
import { ticketTypesFor, computeOrder, ticketTypeLines, qtyToSearchParams, money, type TicketQty } from '@/lib/ticketing';

export interface TicketSelectScreenProps {
  event: MuseumEvent;
  initialQty: TicketQty;
}

export function TicketSelectScreen({ event, initialQty }: TicketSelectScreenProps) {
  const router = useRouter();
  const { isMember } = useAuth();
  const { currency, format } = useCurrency();
  const types = ticketTypesFor(event);
  const [qty, setQty] = useState<TicketQty>(initialQty);
  const order = computeOrder(qty, types, isMember);

  function continueToCheckout() {
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
          note="Fees and any member discount are shown at checkout."
          footer={<Button fullWidth size="lg" disabled={!order.count} onClick={continueToCheckout}>Continue to checkout</Button>}
        />
      }
    >
      <div className="flex items-center gap-4 rounded-lg bg-surface-sunken p-4">
        <Media ratio="4 / 3" tone="green" caption="" className="w-27.5 flex-none" />
        <div className="grid gap-1">
          <h2 className="type-h3">{event.title}</h2>
          <span className="type-body-sm text-body">{event.date} · {event.time} · {event.location}</span>
          <div className="mt-1 flex flex-wrap gap-2">
            <StatusBadge tone="warning" size="sm">{event.remaining} places left</StatusBadge>
            {isMember && <StatusBadge tone="member" size="sm">Member price applied below</StatusBadge>}
          </div>
        </div>
      </div>

      {!isMember && event.memberPrice != null && (
        <Alert tone="info" title={`Members pay ${format(event.memberPrice)}`} action={<Button variant="secondary" size="sm" as="a" href="/membership">See membership</Button>}>
          Membership pays for itself in four visits, and member tickets are held until 48 hours before.
        </Alert>
      )}

      <div className="grid gap-3">
        {types.map((t) => {
          const locked = t.memberOnly && !isMember;
          return (
            <div key={t.key} className={cn('flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line-subtle bg-surface-card p-5', locked && 'opacity-60')}>
              <div className="grid min-w-50 gap-1">
                <span className="type-label flex items-center gap-2 text-heading">
                  {t.name}
                  {t.memberOnly && <StatusBadge tone="member" size="sm">Members only</StatusBadge>}
                </span>
                <span className="type-body-sm text-muted">{locked ? 'Sign in with a membership to unlock this price' : t.description}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-body text-md leading-none font-semibold text-heading">{format(t.price)}</span>
                <QuantityStepper label={t.name} value={qty[t.key]} max={Math.min(6, event.remaining)} disabled={locked}
                  onChange={(v) => setQty((q) => ({ ...q, [t.key]: v }))} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="type-body-sm text-muted">Free events are reserved the same way — you will not be asked for payment details.</p>
    </FlowFrame>
  );
}
