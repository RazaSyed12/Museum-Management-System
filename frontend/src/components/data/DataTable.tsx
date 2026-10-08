import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  sortable?: boolean;
  /** Custom cell renderer — use for StatusBadge cells and row actions. */
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T extends { id?: string | number }> extends HTMLAttributes<HTMLDivElement> {
  columns: Column<T>[];
  rows: T[];
  caption?: string;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  /** Rendered instead of the table when rows is empty. */
  empty?: ReactNode;
  dense?: boolean;
}

// 'align' is a fixed 3-value enum, so it's a Tailwind class, not inline
// style; 'width' stays inline since it's an arbitrary per-column number/string
// a static class can't express.
const ALIGN: Record<NonNullable<Column<unknown>['align']>, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

export function DataTable<T extends { id?: string | number }>({ columns, rows, caption, sortKey, sortDir = 'asc', onSort, empty, dense, className, ...rest }: DataTableProps<T>) {
  if (!rows.length && empty) return empty;
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-line-subtle bg-surface-card', className)} {...rest}>
      <table className="type-body-sm w-full border-collapse">
        {caption && <caption className="type-label caption-top px-5 py-4 text-left text-muted">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => {
              const on = sortKey === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={on ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  style={{ width: c.width }}
                  className={cn(
                    'border-b border-line-subtle bg-surface-sunken font-body text-xs leading-snug font-semibold tracking-wide whitespace-nowrap text-muted uppercase',
                    dense ? 'px-3.5 py-2.5' : 'px-4.5 py-3.5',
                    ALIGN[c.align ?? 'left'],
                  )}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort?.(c.key)}
                      className={cn('inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-inherit tracking-inherit uppercase', on && 'text-heading')}
                    >
                      {c.header}
                      <Icon name={on ? (sortDir === 'asc' ? 'arrow-up' : 'arrow-down') : 'chevrons-up-down'} size={13} />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id ?? i} className={i === rows.length - 1 ? '' : 'border-b border-line-subtle'}>
              {columns.map((c) => (
                <td key={c.key} className={cn('align-middle text-body', dense ? 'px-3.5 py-2.5' : 'px-4.5 py-3.5', ALIGN[c.align ?? 'left'])}>
                  {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
