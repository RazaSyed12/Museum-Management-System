import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

export function Checkbox({ label, description, checked, disabled, invalid, onChange, id, style, ...rest }) {
  return (
    <label htmlFor={id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 'var(--touch-target)', padding: '6px 0', ...style }}>
      <span style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 20, height: 20, flex: '0 0 auto', marginTop: 2,
        borderRadius: 'var(--radius-sm)',
        border: 'var(--border-width) solid ' + (invalid ? 'var(--danger-600)' : checked ? 'var(--action-primary)' : 'var(--border-default)'),
        background: disabled ? 'var(--surface-sunken)' : checked ? 'var(--action-primary)' : 'var(--surface-card)',
        transition: 'var(--transition-control)' }}>
        <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={onChange}
          style={{ position: 'absolute', inset: 0, opacity: 0, margin: 0, cursor: 'inherit' }} {...rest} />
        {checked && <Icon name="check" size={14} color="var(--paper-50)" />}
      </span>
      <span style={{ display: 'grid', gap: 2 }}>
        <span style={{ font: 'var(--type-body)', color: disabled ? 'var(--action-disabled-text)' : 'var(--text-heading)' }}>{label}</span>
        {description && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{description}</span>}
      </span>
    </label>
  );
}
