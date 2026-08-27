import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

export function StatCard({ label, value, delta, deltaTone = 'neutral', icon, footnote, style, ...rest }) {
  const tones = { up: 'var(--success-600)', down: 'var(--danger-600)', neutral: 'var(--text-muted)' };
  return (
    <div style={{
      display: 'grid', gap: 'var(--space-2)', padding: 'var(--space-5)',
      background: 'var(--surface-card)', border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xs)', ...style,
    }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <span style={{ font: 'var(--type-eyebrow)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--text-muted)' }}>{label}</span>
        {icon && <span style={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--olive-50)' }}><Icon name={icon} size={17} color="var(--olive-600)" /></span>}
      </div>
      <strong style={{ font: 'var(--weight-regular) var(--text-3xl)/1 var(--font-display)', color: 'var(--text-heading)' }}>{value}</strong>
      {(delta || footnote) && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', font: 'var(--type-body-sm)' }}>
          {delta && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: tones[deltaTone] }}>
              <Icon name={deltaTone === 'down' ? 'trending-down' : 'trending-up'} size={14} />{delta}
            </span>
          )}
          {footnote && <span style={{ color: 'var(--text-muted)' }}>{footnote}</span>}
        </div>
      )}
    </div>
  );
}
