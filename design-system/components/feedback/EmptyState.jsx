import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

export function EmptyState({ icon = 'search-x', title, description, action, compact, style, ...rest }) {
  return (
    <div style={{
      display: 'grid', justifyItems: 'center', textAlign: 'center', gap: 'var(--space-3)',
      padding: compact ? 'var(--space-8)' : 'var(--space-16) var(--space-6)',
      background: 'var(--surface-card)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-lg)', ...style,
    }} {...rest}>
      <span style={{ display: 'grid', placeItems: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--olive-50)' }}>
        <Icon name={icon} size={26} color="var(--olive-500)" />
      </span>
      <h3 style={{ font: 'var(--type-h3)' }}>{title}</h3>
      {description && <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', maxWidth: 420 }}>{description}</p>}
      {action && <div style={{ marginTop: 'var(--space-2)' }}>{action}</div>}
    </div>
  );
}
