import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

/* Ported from design-system/components/feedback/EmptyState.jsx + EmptyState.d.ts. */
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Tighter padding for use inside cards and drawers. */
  compact?: boolean;
}

export function EmptyState({ icon = 'search-x', title, description, action, compact, className, ...rest }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'grid justify-items-center gap-3 rounded-lg border border-dashed border-line-default bg-surface-card text-center',
        compact ? 'p-8' : 'px-6 py-16',
        className,
      )}
      {...rest}
    >
      <span className="grid size-14 place-items-center rounded-full bg-olive-50">
        <Icon name={icon} size={26} className="text-olive-500" />
      </span>
      <h3 className="type-h3">{title}</h3>
      {description && <p className="type-body max-w-105 text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
