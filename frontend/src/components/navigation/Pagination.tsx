import { Fragment, type HTMLAttributes } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

/* Omit 'onChange': same collision class as SearchField's `size` — the
   native change event versus this component's onChange(page: number). */
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  page?: number;
  pages?: number;
  onChange?: (page: number) => void;
  /** Render the mobile / infinite-browse "Load more" affordance instead of numbers. */
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  /** e.g. "Showing 24 of 96 collections" — shown above Load more. */
  resultLabel?: string;
}

export function Pagination({ page = 1, pages = 1, onChange, showLoadMore, onLoadMore, resultLabel, className, ...rest }: PaginationProps) {
  if (showLoadMore) {
    return (
      <div className={cn('grid justify-items-center gap-3', className)} {...rest}>
        {resultLabel && <span className="type-body-sm text-muted">{resultLabel}</span>}
        <button
          type="button"
          onClick={onLoadMore}
          className="type-button min-h-11 cursor-pointer rounded-pill border border-olive-500 bg-transparent px-7 text-olive-700"
        >
          Load more
        </button>
      </div>
    );
  }

  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);

  const cell = (content: React.ReactNode, key: string | number, opts: { disabled?: boolean; current?: boolean; onClick?: () => void }) => (
    <button
      key={key}
      type="button"
      disabled={opts.disabled}
      onClick={opts.onClick}
      aria-current={opts.current ? 'page' : undefined}
      className={cn(
        'type-button grid h-11 min-w-11 place-items-center rounded-md border px-2.5 transition-control',
        opts.current ? 'border-action-primary bg-action-primary text-inverse' : 'border-line-default bg-surface-card text-heading',
        opts.disabled ? 'cursor-not-allowed text-action-disabled-text' : 'cursor-pointer',
      )}
    >
      {content}
    </button>
  );

  return (
    <nav aria-label="Pagination" className={cn('flex flex-wrap items-center gap-2', className)} {...rest}>
      {cell(<Icon name="chevron-left" size={18} />, 'prev', { disabled: page === 1, onClick: () => onChange?.(page - 1) })}
      {nums.map((n, i) => (
        <Fragment key={n}>
          {i > 0 && n - nums[i - 1]! > 1 && <span className="px-1 text-muted">…</span>}
          {cell(n, n, { current: n === page, onClick: () => onChange?.(n) })}
        </Fragment>
      ))}
      {cell(<Icon name="chevron-right" size={18} />, 'next', { disabled: page === pages, onClick: () => onChange?.(page + 1) })}
    </nav>
  );
}
