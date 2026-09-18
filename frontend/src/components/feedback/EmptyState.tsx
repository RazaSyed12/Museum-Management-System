import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/components/foundation/Icon';

/* Ported from design-system/components/feedback/EmptyState.jsx + EmptyState.d.ts — keep in sync. */
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Tighter padding for use inside cards and drawers. */
  compact?: boolean;
}

export function EmptyState({ icon = 'search-x', title, description, action, compact, style, ...rest }: EmptyStateProps) {
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
