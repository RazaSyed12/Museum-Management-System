import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

// Omit 'onChange': this component's onChange(value: string) collides with
// the native div change event, same class of bug as Pagination's did.
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: (string | TabItem)[];
  value?: string;
  onChange?: (value: string) => void;
  /** underline for page sections, pill for filter-style switching (Now / Upcoming / Past). */
  variant?: 'underline' | 'pill';
}

export function Tabs({ items = [], value, onChange, variant = 'underline', className, ...rest }: TabsProps) {
  const underline = variant === 'underline';
  return (
    <div
      role="tablist"
      className={cn('flex overflow-x-auto', underline ? 'gap-6 border-b border-line-subtle' : 'gap-2', className)}
      {...rest}
    >
      {items.map((it) => {
        const v = typeof it === 'string' ? it : it.value;
        const l = typeof it === 'string' ? it : it.label;
        const count = typeof it === 'object' ? it.count : undefined;
        const on = v === value;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={on}
            type="button"
            onClick={() => onChange?.(v)}
            className={cn(
              'inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 font-body text-sm leading-none font-semibold whitespace-nowrap transition-control',
              underline
                ? cn('-mb-px border-b-2 bg-transparent px-0 pb-3', on ? 'border-olive-500 text-green-900' : 'border-transparent text-muted')
                : cn('rounded-pill px-4', on ? 'bg-green-900 text-inverse' : 'bg-paper-100 text-body'),
            )}
          >
            {l}
            {count != null && (
              <span
                className={cn(
                  'rounded-pill px-1.5 py-[3px] font-body text-2xs leading-none font-semibold',
                  on && !underline ? 'bg-white/18 text-paper-50' : 'bg-paper-200 text-muted',
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
