import React from 'react';
import { IconButton } from './IconButton.jsx';

export function QuantityStepper({ value = 0, min = 0, max = 10, onChange, label = 'Quantity', disabled, style, ...rest }) {
  const set = (v) => onChange && onChange(Math.max(min, Math.min(max, v)));
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', ...style }} {...rest}>
      <IconButton icon="minus" label={`Remove one ${label}`} variant="outline" onClick={() => set(value - 1)} disabled={disabled || value <= min} />
      <input aria-label={label} value={value} readOnly inputMode="numeric"
        style={{ width: 52, height: 44, textAlign: 'center', font: 'var(--weight-semibold) var(--text-base)/1 var(--font-body)',
          color: 'var(--text-heading)', background: 'var(--surface-card)', border: 'var(--border-width) solid var(--border-default)', borderRadius: 'var(--radius-md)' }} />
      <IconButton icon="plus" label={`Add one ${label}`} variant="outline" onClick={() => set(value + 1)} disabled={disabled || value >= max} />
    </div>
  );
}
