import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/** Started once, client-side only, by MockProvider in app/layout.tsx. */
export const worker = setupWorker(...handlers);
