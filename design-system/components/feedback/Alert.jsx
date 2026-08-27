import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

const TONES = {
  info:    { bg: 'var(--info-100)',    bd: '#A9C6D6', fg: '#2E4C5E', icon: 'info' },
  success: { bg: 'var(--success-100)', bd: '#A8CDB4', fg: '#2C5C39', icon: 'check-circle-2' },
  warning: { bg: 'var(--warning-100)', bd: '#E3C68A', fg: '#8A6114', icon: 'alert-triangle' },
  danger:  { bg: 'var(--danger-100)',  bd: '#DFA79D', fg: '#8F3124', icon: 'alert-circle' },
};

export function Alert({ tone = 'info', title, children, onDismiss, action, style, ...rest }) {
  const t = TONES[tone] || TONES.info;
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} style={{
      display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-4)',
      background: t.bg, border: `var(--border-width) solid ${t.bd}`, borderRadius: 'var(--radius-md)', ...style,
    }} {...rest}>
      <Icon name={t.icon} size={20} color={t.fg} style={{ marginTop: 1 }} />
      <div style={{ display: 'grid', gap: 4, flex: 1 }}>
        {title && <strong style={{ font: 'var(--type-label)', color: t.fg }}>{title}</strong>}
        {children && <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{children}</div>}
        {action && <div style={{ marginTop: 'var(--space-2)' }}>{action}</div>}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss"
          style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 2, height: 'fit-content' }}>
          <Icon name="x" size={16} color={t.fg} />
        </button>
      )}
    </div>
  );
}
