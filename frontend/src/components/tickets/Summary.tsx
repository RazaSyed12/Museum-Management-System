import type { ReactNode } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export interface SummaryLine {
  label: ReactNode;
  value: string;
  muted?: boolean;
  strong?: boolean;
  tone?: 'discount';
  icon?: string;
}

export interface SummaryProps {
  lines: SummaryLine[];
  total: string;
  footer?: ReactNode;
  note?: string;
}

export function Summary({ lines, total, footer, note }: SummaryProps) {
  return (
    <aside className="sticky top-25 grid gap-4 self-start rounded-lg border border-line-subtle bg-surface-card p-6 shadow-sm">
      <h2 className="type-h3">Order summary</h2>
      <div className="grid gap-3">
        {lines.map((l, i) => (
          <div key={i} className={cn('type-body-sm flex items-baseline justify-between gap-4', l.muted ? 'text-muted' : 'text-body')}>
            <span className="flex items-center gap-1.5">
              {l.icon && <Icon name={l.icon} size={14} className="text-gold-700" />}
              {l.label}
            </span>
            <span className={cn(l.tone === 'discount' && 'text-success-600', l.strong && 'font-semibold')}>{l.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-baseline justify-between border-t border-line-default pt-4">
        <span className="type-label text-heading">Total to pay</span>
        <span className="font-display text-2xl/none text-heading">{total}</span>
      </div>
      {note && <p className="type-body-sm text-muted">{note}</p>}
      {footer}
    </aside>
  );
}
