import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  onDismiss?: () => void;
  /** Optional Button rendered under the message. */
  action?: ReactNode;
}

// fg reuses the exact text-*-700 tokens StatusBadge already uses for these
// tones — no new hex values. Only the border tints are bespoke to Alert (no
// named token matches them), so those stay as Tailwind arbitrary values.
const TONES: Record<NonNullable<AlertProps['tone']>, { bg: string; border: string; fg: string; icon: string }> = {
  info: { bg: 'bg-info-100', border: 'border-[#A9C6D6]', fg: 'text-info-700', icon: 'info' },
  success: { bg: 'bg-success-100', border: 'border-[#A8CDB4]', fg: 'text-success-700', icon: 'check-circle-2' },
  warning: { bg: 'bg-warning-100', border: 'border-[#E3C68A]', fg: 'text-warning-700', icon: 'alert-triangle' },
  danger: { bg: 'bg-danger-100', border: 'border-[#DFA79D]', fg: 'text-danger-700', icon: 'alert-circle' },
};

export function Alert({ tone = 'info', title, children, onDismiss, action, className, ...rest }: AlertProps) {
  const t = TONES[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-md border p-4', t.bg, t.border, className)} {...rest}>
      <Icon name={t.icon} size={20} className={cn('mt-px', t.fg)} />
      <div className="grid flex-1 gap-1">
        {title && <strong className={cn('type-label', t.fg)}>{title}</strong>}
        {children && <div className="type-body-sm text-body">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="h-fit cursor-pointer border-0 bg-transparent p-0.5">
          <Icon name="x" size={16} className={t.fg} />
        </button>
      )}
    </div>
  );
}
