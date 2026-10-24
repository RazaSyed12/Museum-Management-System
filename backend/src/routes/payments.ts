import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';
import { activeProvider, providerByName } from '../payments';
import { NextAction, PaymentProvider, PaymentRecord, ProviderInput } from '../payments/provider';

// Full paths (/bookings/:id/pay, /membership/purchase, /payments/..., /me/payments, /admin/payments),
// so this router is mounted without a prefix.
const router = Router();

function send(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}
const badRequest = (res: Response, message: string) => send(res, 400, 'validation_error', message);
const serverError = (res: Response, message: string) => send(res, 500, 'server_error', message);
const notFound = (res: Response, what: string) => send(res, 404, 'not_found', `${what} not found.`);

const idSchema = z.guid();

// The columns a customer or staff member may see. provider_data (the provider's private details) never leaves.
const PAYMENT_COLUMNS =
  'payment_id, booking_id, membership_id, provider, method, payment_status, amount, currency, ' +
  'transaction_reference, failure_code, failure_message, paid_at, refunded_at, created_at';

function publicPayment(row: any) {
  const copy = { ...row };
  delete copy.provider_data;
  return copy;
}

function toRecord(row: any): PaymentRecord {
  return {
    payment_id: row.payment_id,
    booking_id: row.booking_id,
    amount: Number(row.amount),
    currency: row.currency,
    provider: row.provider,
    method: row.method ?? null,
    transaction_reference: row.transaction_reference ?? null,
    provider_data: row.provider_data ?? {},
  };
}

// Turns the database functions' error words into proper replies.
function paymentFailure(res: Response, error: { message?: string; code?: string }, fallback: string) {
  if (error.code === '23505') return send(res, 409, 'conflict', 'That payment reference is already in use.');
  switch (error.message) {
    case 'booking_not_found':
      return notFound(res, 'Booking');
    case 'payment_not_found':
      return notFound(res, 'Payment');
    case 'plan_not_found':
      return notFound(res, 'Plan');
    case 'already_member':
      return send(res, 409, 'already_member', 'You already have an active membership.');
    case 'already_paid':
      return send(res, 409, 'already_paid', 'This booking is already paid.');
    case 'booking_closed':
      return send(res, 409, 'booking_closed', 'This booking is cancelled or expired.');
    case 'payment_closed':
      return send(res, 409, 'payment_closed', 'This payment is already finished.');
    case 'simulation_disabled':
      return send(res, 403, 'simulation_disabled', 'Simulated payments are switched off.');
    case 'account_not_active':
      return send(res, 403, 'forbidden', 'Your account cannot make payments.');
    case 'forbidden':
      return send(res, 403, 'forbidden', 'You are not allowed to settle this payment.');
    case 'not_signed_in':
      return send(res, 401, 'unauthorized', 'Sign in required.');
    default:
      return serverError(res, fallback);
  }
}

// Asks the provider for the final answer, records it, and answers the caller.
// The reply carries either "booking" or "membership", depending on what was paid for.
async function settleAndReply(
  res: Response,
  db: SupabaseClient,
  provider: PaymentProvider,
  payment: any,
  input: ProviderInput,
) {
  const answer = await provider.confirm(toRecord(payment), input);
  const { data, error } = await db.rpc('payment_settle', {
    p_payment_id: payment.payment_id,
    p_outcome: answer.outcome,
    p_reference: answer.reference ?? null,
    p_failure_code: answer.outcome === 'failed' ? answer.failure_code : null,
    p_failure_message: answer.outcome === 'failed' ? answer.failure_message : null,
    p_data: answer.data ?? {},
  });
  if (error) return paymentFailure(res, error, 'Could not settle the payment.');

  const target: Record<string, unknown> = data.membership ? { membership: data.membership } : { booking: data.booking };

  switch (data.result) {
    case 'paid':
      return res.json({ ...target, payment: data.payment, next_action: { type: 'none' } });
    case 'already_settled':
      return res.json({ ...target, payment: data.payment, already_settled: true, next_action: { type: 'none' } });
    case 'failed':
      return res.status(402).json({
        error: {
          message: data.payment.failure_message ?? 'The payment failed.',
          code: data.payment.failure_code ?? 'payment_failed',
        },
        payment: data.payment,
        ...target,
      });
    case 'refunded_booking_closed':
      return res.status(409).json({
        error: {
          message: data.membership
            ? 'The purchase window ran out before the payment arrived, so the payment is being refunded. Please try again.'
            : 'The seat hold ran out before the payment arrived, so the payment is being refunded. Please book again.',
          code: data.membership ? 'membership_closed' : 'booking_closed',
        },
        payment: data.payment,
        ...target,
      });
    default:
      return serverError(res, 'Unexpected payment result.');
  }
}

const paySchema = z
  .object({
    method: z.string().trim().min(1).max(30).optional(),
    // simulation only: which outcome to simulate (default: success)
    simulate: z.enum(['success', 'card_declined', 'insufficient_funds', 'provider_error']).optional(),
    // simulation only: false = stop after starting the payment and confirm later
    confirm: z.boolean().optional(),
  })
  .strict();

// POST /bookings/:id/pay — the owner. Starts a payment for a pending booking. With the simulated
// provider it also confirms straight away (unless {"confirm": false}); a real provider answers with
// the page the customer must go to next. Safe to repeat: an open attempt is reused.
router.post('/bookings/:id/pay', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Booking');
  const parsed = paySchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  let provider: PaymentProvider;
  try {
    provider = activeProvider();
  } catch {
    return serverError(res, 'Payments are not configured.');
  }
  const db = userClient(req.auth!.token);

  const begun = await db.rpc('payment_begin', {
    p_booking_id: id,
    p_provider: provider.name,
    p_method: parsed.data.method ?? null,
  });
  if (begun.error) return paymentFailure(res, begun.error, 'Could not start the payment.');
  if (begun.data.result === 'expired') {
    return res.status(409).json({
      error: { message: 'The seat hold ran out, so the booking was released. Please book again.', code: 'hold_expired' },
      booking: begun.data.booking,
    });
  }

  let payment = begun.data.payment;
  let next: NextAction = payment.provider_data?.next_action ?? { type: 'none' };

  try {
    if (!payment.transaction_reference) {
      const init = await provider.initiate(toRecord(payment), parsed.data);
      const attached = await db.rpc('payment_attach', {
        p_payment_id: payment.payment_id,
        p_reference: init.reference,
        p_data: { ...(init.data ?? {}), next_action: init.next_action },
      });
      if (attached.error) return paymentFailure(res, attached.error, 'Could not record the payment.');
      payment = attached.data;
      next = init.next_action;
    }
    if (next.type === 'confirm' && parsed.data.confirm !== false) {
      return await settleAndReply(res, db, provider, payment, parsed.data);
    }
  } catch {
    return send(res, 502, 'provider_unavailable', 'The payment provider could not be reached. Please try again.');
  }
  return res.status(202).json({ payment: publicPayment(payment), next_action: next });
});

const purchaseSchema = z
  .object({
    plan_id: z.guid(),
    method: z.string().trim().min(1).max(30).optional(),
    // simulation only: which outcome to simulate (default: success)
    simulate: z.enum(['success', 'card_declined', 'insufficient_funds', 'provider_error']).optional(),
    // simulation only: false = stop after starting the payment and confirm later
    confirm: z.boolean().optional(),
  })
  .strict();

// POST /membership/purchase — signed in. Starts buying a plan. Same behaviour as paying for a booking:
// the simulation confirms straight away (unless {"confirm": false}); a real provider answers with the
// page the customer must go to next. The membership only becomes active once the payment is settled.
router.post('/membership/purchase', requireAuth, async (req: Request, res: Response) => {
  const parsed = purchaseSchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  let provider: PaymentProvider;
  try {
    provider = activeProvider();
  } catch {
    return serverError(res, 'Payments are not configured.');
  }
  const db = userClient(req.auth!.token);

  const begun = await db.rpc('membership_begin', {
    p_plan_id: parsed.data.plan_id,
    p_provider: provider.name,
    p_method: parsed.data.method ?? null,
  });
  if (begun.error) return paymentFailure(res, begun.error, 'Could not start the purchase.');

  // A free plan is active at once.
  if (begun.data.result === 'free') {
    return res.status(201).json({
      membership: begun.data.membership,
      payment: begun.data.payment,
      next_action: { type: 'none' },
    });
  }

  let payment = begun.data.payment;
  let next: NextAction = payment.provider_data?.next_action ?? { type: 'none' };

  try {
    if (!payment.transaction_reference) {
      const init = await provider.initiate(toRecord(payment), parsed.data);
      const attached = await db.rpc('payment_attach', {
        p_payment_id: payment.payment_id,
        p_reference: init.reference,
        p_data: { ...(init.data ?? {}), next_action: init.next_action },
      });
      if (attached.error) return paymentFailure(res, attached.error, 'Could not record the payment.');
      payment = attached.data;
      next = init.next_action;
    }
    if (next.type === 'confirm' && parsed.data.confirm !== false) {
      return await settleAndReply(res, db, provider, payment, parsed.data);
    }
  } catch {
    return send(res, 502, 'provider_unavailable', 'The payment provider could not be reached. Please try again.');
  }
  return res.status(202).json({
    membership: begun.data.membership,
    payment: publicPayment(payment),
    next_action: next,
  });
});

const confirmSchema = z
  .object({
    simulate: z.enum(['success', 'card_declined', 'insufficient_funds', 'provider_error']).optional(),
  })
  .strict();

// POST /payments/:id/confirm — the owner. Finishes a payment that was started with {"confirm": false}
// (or, with a real provider, after the customer comes back from the provider).
router.post('/payments/:id/confirm', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Payment');
  const parsed = confirmSchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const db = userClient(req.auth!.token);
  const { data: payment, error } = await db.from('payments').select('*').eq('payment_id', id).maybeSingle();
  if (error) return serverError(res, 'Could not load the payment.');
  if (!payment) return notFound(res, 'Payment');

  if (payment.payment_status !== 'pending') {
    return res.json({ payment: publicPayment(payment), already_settled: true, next_action: { type: 'none' } });
  }
  const provider = providerByName(payment.provider);
  if (!provider) return serverError(res, 'This payment provider is not available.');

  try {
    return await settleAndReply(res, db, provider, payment, parsed.data);
  } catch {
    return send(res, 502, 'provider_unavailable', 'The payment provider could not be reached. Please try again.');
  }
});

// GET /payments/:id — the owner or staff (the database hides other people's payments).
router.get('/payments/:id', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Payment');
  const { data, error } = await userClient(req.auth!.token)
    .from('payments')
    .select(`${PAYMENT_COLUMNS}, bookings(booking_id, events(name))`)
    .eq('payment_id', id)
    .maybeSingle();
  if (error) return serverError(res, 'Could not load the payment.');
  if (!data) return notFound(res, 'Payment');
  return res.json({ payment: data });
});

const meSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /me/payments — signed in. The caller's own payments (bookings and memberships), newest first.
router.get('/me/payments', requireAuth, async (req: Request, res: Response) => {
  const parsed = meSchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { limit, offset } = parsed.data;

  const { data, error } = await userClient(req.auth!.token).rpc('my_payments', { p_limit: limit, p_offset: offset });
  if (error) return serverError(res, 'Could not load your payments.');
  return res.json({ payments: data.payments, total: Number(data.total), limit, offset });
});

const adminSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'refund_pending', 'refunded']).optional(),
  provider: z.string().trim().min(1).max(30).optional(),
  booking_id: z.guid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /admin/payments — staff only. ?status=, ?provider=, ?booking_id=, ?limit=, ?offset=. Newest first.
router.get('/admin/payments', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = adminSchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const f = parsed.data;

  let query = userClient(req.auth!.token)
    .from('payments')
    .select(`${PAYMENT_COLUMNS}, bookings(user_id, events(name))`, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(f.offset, f.offset + f.limit - 1);
  if (f.status) query = query.eq('payment_status', f.status);
  if (f.provider) query = query.eq('provider', f.provider);
  if (f.booking_id) query = query.eq('booking_id', f.booking_id);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load the payments.');
  return res.json({ payments: data ?? [], total: count ?? 0, limit: f.limit, offset: f.offset });
});

export default router;