import { randomUUID } from 'crypto';
import { PaymentProvider } from './provider';

// A stand-in gateway that behaves like a real one: it hands out a reference, waits for a
// confirmation, and can succeed or fail in the ways a card payment fails.
const FAILURES: Record<string, { code: string; message: string }> = {
  card_declined: { code: 'card_declined', message: 'The card was declined.' },
  insufficient_funds: { code: 'insufficient_funds', message: 'The card has insufficient funds.' },
  provider_error: {
    code: 'provider_error',
    message: 'The payment provider could not process the payment. Please try again.',
  },
};

function reference(prefix: string, length: number) {
  return `${prefix}-${randomUUID().replace(/-/g, '').slice(0, length).toUpperCase()}`;
}

export const simulatedProvider: PaymentProvider = {
  name: 'simulated',
  settlesAsServer: false,

  async initiate(payment) {
    return {
      reference: reference('SIM', 12),
      next_action: { type: 'confirm', confirm_url: `/payments/${payment.payment_id}/confirm` },
    };
  },

  async confirm(_payment, input) {
    const wanted = typeof input.simulate === 'string' ? input.simulate : 'success';
    if (wanted === 'success') return { outcome: 'completed' };
    const failure = FAILURES[wanted];
    if (!failure) {
      return { outcome: 'failed', failure_code: 'payment_failed', failure_message: 'The payment failed.' };
    }
    return { outcome: 'failed', failure_code: failure.code, failure_message: failure.message };
  },

  async refund() {
    return { reference: reference('SIM-REFUND', 10) };
  },
};