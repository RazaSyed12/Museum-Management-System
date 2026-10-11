'use client';

import { useState, type FormEvent } from 'react';
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
import type { MuseumEvent } from '@/lib/api/events';
import { ticketTypesFor, computeOrder, ticketTypeLines, orderBreakdownLines, money, type TicketQty } from '@/lib/ticketing';

export interface CheckoutScreenProps {
  event: MuseumEvent;
  qty: TicketQty;
}

const HEARD_OPTIONS = ['Friend or family', 'Social media', 'Newsletter', 'Walked past'];
const ACCESS_OPTIONS = [{ value: 'none', label: 'No requirements' }, { value: 'wheel', label: 'Wheelchair space needed' }, { value: 'bsl', label: 'BSL interpretation' }];

export function CheckoutScreen({ event, qty }: CheckoutScreenProps) {
  const router = useRouter();
  const { user, isMember } = useAuth();
  const types = ticketTypesFor(event);
  const order = computeOrder(qty, types, isMember);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [access, setAccess] = useState('none');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.set('name', name);
    params.set('email', email);
    if (phone) params.set('phone', phone); else params.delete('phone');
    params.set('access', access);
    router.push(`/tickets/${event.id}/payment?${params}`);
  }

  return (
    <FlowFrame
      step={1}
      title="Check your order"
      aside={
        <Summary
          lines={[...ticketTypeLines(qty, types), ...orderBreakdownLines(order)]}
          total={money(order.total)}
          note="You will not be charged until the next step."
          footer={<Button fullWidth size="lg" type="submit" form="checkout-form">Continue to payment</Button>}
        />
      }
    >
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
          <Checkbox id="nl" label="Email me what's on" description="Monthly, and never shared." />
        </div>
        <div className="grid gap-4 rounded-lg border border-line-subtle bg-surface-card p-6">
          <h2 className="type-h3">Access requirements</h2>
          <RadioGroup name="access" value={access} onChange={setAccess} options={ACCESS_OPTIONS} />
        </div>
        {isMember && order.discount > 0 && (
          <Alert tone="success" title="Member discount applied">£{order.discount.toFixed(2)} has been taken off this order.</Alert>
        )}
      </form>
    </FlowFrame>
  );
}
