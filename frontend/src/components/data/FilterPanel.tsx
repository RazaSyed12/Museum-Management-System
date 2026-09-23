'use client';

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { Checkbox } from '@/components/forms/Checkbox';
import { Select } from '@/components/forms/Select';
import { cn } from '@/lib/cn';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  title: string;
  options: (string | FilterOption)[];
}

// Omit 'onToggle': the source .d.ts extends HTMLAttributes directly, but its
// onToggle(group, value) collides with the native <details> onToggle event
// React types every element with — same class of bug as SearchField's `size`.
export interface FilterPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  /** Groups are data-driven so staff-created categories appear automatically. */
  groups?: FilterGroup[];
  /** Map of group title → selected values. */
  selected?: Record<string, string[]>;
  onToggle?: (group: string, value: string) => void;
  sortOptions?: (string | { value: string; label: string })[];
  sort?: string;
  onSort?: (value: string) => void;
  onClear?: () => void;
  activeCount?: number;
}

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line-subtle pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex min-h-11 w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0"
      >
        <span className="type-label text-heading">{title}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} className="text-muted" />
      </button>
      {open && <div className="mt-1 grid gap-1">{children}</div>}
    </div>
  );
}

export function FilterPanel({ groups = [], selected = {}, onToggle, sortOptions, sort, onSort, onClear, activeCount = 0, className, ...rest }: FilterPanelProps) {
  return (
    <div className={cn('grid content-start gap-4', className)} {...rest}>
      <div className="flex items-center justify-between gap-3">
        <span className="type-label inline-flex items-center gap-2 text-heading">
          <Icon name="sliders-horizontal" size={16} className="text-olive-600" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-pill bg-olive-100 px-1.75 py-[3px] font-body text-2xs leading-none font-semibold text-olive-700">{activeCount}</span>
          )}
        </span>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="type-body-sm cursor-pointer border-0 bg-transparent p-1 text-link underline">
            Clear all
          </button>
        )}
      </div>
      {sortOptions && (
        <label className="grid gap-2">
          <span className="type-label text-heading">Sort by</span>
          <Select options={sortOptions} value={sort} onChange={(e) => onSort?.(e.target.value)} size="sm" />
        </label>
      )}
      {groups.map((g) => (
        <Group key={g.title} title={g.title}>
          {g.options.map((o) => {
            const v = typeof o === 'string' ? o : o.value;
            const l = typeof o === 'string' ? o : o.label;
            const count = typeof o === 'object' ? o.count : undefined;
            return (
              <Checkbox
                key={v}
                id={g.title + '-' + v}
                checked={!!(selected[g.title] || []).includes(v)}
                onChange={() => onToggle?.(g.title, v)}
                label={
                  <span className="flex gap-2">
                    {l}
                    {count != null && <span className="text-muted">({count})</span>}
                  </span>
                }
                className="min-h-10 py-0.5"
              />
            );
          })}
        </Group>
      ))}
    </div>
  );
}
