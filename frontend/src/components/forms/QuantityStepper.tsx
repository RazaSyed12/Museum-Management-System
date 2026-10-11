import type { HTMLAttributes } from 'react';
import { IconButton } from './IconButton';
import { cn } from '@/lib/cn';

/* Ported from design-system/components/forms/QuantityStepper.jsx + .d.ts.
   Omit 'onChange': this component's onChange(value: number) collides with
   the native div change event, same class of bug as Tabs'/Pagination's. */
export interface QuantityStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  min?: number;
  /** Cap at remaining availability (or the member allocation for member tickets). */
  max?: number;
  onChange?: (value: number) => void;
  /** Ticket type name, used to build the buttons' accessible names. */
  label?: string;
  disabled?: boolean;
}

export function QuantityStepper({ value = 0, min = 0, max = 10, onChange, label = 'Quantity', disabled, className, ...rest }: QuantityStepperProps) {
  const set = (v: number) => onChange?.(Math.max(min, Math.min(max, v)));
  return (
    <div className={cn('inline-flex items-center gap-2', className)} {...rest}>
      <IconButton icon="minus" label={`Remove one ${label}`} variant="outline" onClick={() => set(value - 1)} disabled={disabled || value <= min} />
      <input
        aria-label={label}
        value={value}
        readOnly
        inputMode="numeric"
        className="type-body h-11 w-13 rounded-md border border-line-default bg-surface-card text-center font-semibold text-heading"
      />
      <IconButton icon="plus" label={`Add one ${label}`} variant="outline" onClick={() => set(value + 1)} disabled={disabled || value >= max} />
    </div>
  );
}
