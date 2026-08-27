import React from 'react';

export function Tabs({ items = [], value, onChange, variant = 'underline', style, ...rest }) {
  return (
    <div role="tablist" style={{
      display: 'flex', gap: variant === 'pill' ? 'var(--space-2)' : 'var(--space-6)',
      borderBottom: variant === 'underline' ? 'var(--border-width) solid var(--border-subtle)' : 'none',
      overflowX: 'auto', ...style,
    }} {...rest}>
      {items.map((it) => {
        const v = typeof it === 'string' ? it : it.value;
        const l = typeof it === 'string' ? it : it.label;
        const count = typeof it === 'object' ? it.count : undefined;
        const on = v === value;
        return (
          <button key={v} role="tab" aria-selected={on} type="button" onClick={() => onChange && onChange(v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', cursor: 'pointer',
              minHeight: 44, padding: variant === 'pill' ? '0 16px' : '0 0 12px',
              border: 0, background: variant === 'pill' ? (on ? 'var(--green-900)' : 'var(--paper-100)') : 'transparent',
              borderRadius: variant === 'pill' ? 'var(--radius-pill)' : 0,
              borderBottom: variant === 'underline' ? '2px solid ' + (on ? 'var(--olive-500)' : 'transparent') : undefined,
              marginBottom: variant === 'underline' ? -1 : 0,
              color: variant === 'pill' ? (on ? 'var(--text-inverse)' : 'var(--text-body)') : (on ? 'var(--green-900)' : 'var(--text-muted)'),
              font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-body)',
              transition: 'var(--transition-control)',
            }}>
            {l}
            {count != null && (
              <span style={{ font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)', padding: '3px 6px', borderRadius: 'var(--radius-pill)', background: on && variant === 'pill' ? 'rgba(255,255,255,.18)' : 'var(--paper-200)', color: on && variant === 'pill' ? 'var(--paper-50)' : 'var(--text-muted)' }}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
