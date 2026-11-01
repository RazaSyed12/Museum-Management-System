import { authedRequest } from './authed';

/* ── Real backend (openapi.yaml: GET /me/payments) ──
 *
 * Own toggle: NEXT_PUBLIC_PAYMENTS_API_MOCKING=disabled adds a "Payments" tab
 * to the profile listing every ticket and membership payment attempt, newest
 * first. Unset, there is no such tab, as before. */

export function paymentsMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_PAYMENTS_API_MOCKING === 'disabled';
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refund_pending' | 'refunded';

export interface PaymentRow {
  id: string;
  /** ISO date-time the attempt was made. */
  when: string;
  /** The event for a ticket payment, "Membership" otherwise. */
  what: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reference?: string;
  failureMessage?: string;
}

interface RawPayment {
  payment_id: string;
  booking_id: string | null;
  membership_id: string | null;
  payment_status: PaymentStatus;
  amount: number;
  currency: string;
  transaction_reference: string | null;
  failure_message: string | null;
  paid_at: string | null;
  created_at: string;
  event_name?: string | null;
}

export async function listMyPayments(token: string): Promise<PaymentRow[]> {
  const data = await authedRequest<{ payments: RawPayment[] }>('GET', '/me/payments?limit=100', token);
  return data.payments.map((p) => ({
    id: p.payment_id,
    when: p.paid_at ?? p.created_at,
    what: p.event_name ?? (p.membership_id ? 'Membership' : 'Ticket payment'),
    amount: p.amount,
    currency: p.currency,
    status: p.payment_status,
    reference: p.transaction_reference ?? undefined,
    failureMessage: p.failure_message ?? undefined,
  }));
}
