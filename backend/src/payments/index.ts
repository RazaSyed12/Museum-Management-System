import { PaymentProvider } from './provider';
import { simulatedProvider } from './simulated';


// Add a real provider here, e.g.  paypal: paypalProvider,  and set PAYMENT_PROVIDER=paypal.
const providers: Record<string, PaymentProvider> = {
  simulated: simulatedProvider,
};

// The provider used for new payments. Defaults to the simulation when PAYMENT_PROVIDER is not set.
export function activeProvider(): PaymentProvider {
  const name = (process.env.PAYMENT_PROVIDER ?? 'simulated').trim().toLowerCase();
  const provider = providers[name];
  if (!provider) throw new Error(`Unknown PAYMENT_PROVIDER "${name}"`);
  return provider;
}

// The provider that handled an existing payment (it may differ from the active one).
export function providerByName(name: string): PaymentProvider | undefined {
  return providers[name];
}