// The one interface every payment provider implements. The simulated provider is the first;
// PayPal (or any other) later means one more file like it and one line in index.ts.

export interface PaymentRecord {
  payment_id: string;
  booking_id: string | null;
  amount: number;
  currency: string;
  provider: string;
  method: string | null;
  transaction_reference: string | null;
  provider_data: Record<string, unknown>;
}

// What the customer must do after the payment is started.
//  none     - nothing, it is already settled
//  confirm  - call the confirm endpoint (the simulation)
//  redirect - send the customer to the provider (e.g. the PayPal approval page), then call confirm
export type NextAction =
  | { type: 'none' }
  | { type: 'confirm'; confirm_url: string }
  | { type: 'redirect'; url: string };

export interface InitiateResult {
  reference: string;
  next_action: NextAction;
  data?: Record<string, unknown>;
}

export type ConfirmResult =
  | { outcome: 'completed'; reference?: string; data?: Record<string, unknown> }
  | { outcome: 'failed'; failure_code: string; failure_message: string; reference?: string; data?: Record<string, unknown> };

// Extra request fields the caller sent (for the simulation: which outcome to simulate).
export type ProviderInput = Record<string, unknown>;

export interface PaymentProvider {
  readonly name: string;
  // true when settling needs the server's own database access instead of the customer's
  // (every real provider; the simulation is settled by its owner)
  readonly settlesAsServer: boolean;
  // Start a payment with the provider and return its reference and the customer's next step.
  initiate(payment: PaymentRecord, input: ProviderInput): Promise<InitiateResult>;
  // Ask the provider for the final answer (simulation: the chosen outcome; PayPal: capture the order).
  confirm(payment: PaymentRecord, input: ProviderInput): Promise<ConfirmResult>;
  // Return the money for a completed payment at the provider.
  refund(payment: PaymentRecord): Promise<{ reference?: string }>;
}