import type { InputHTMLAttributes } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void;
  size?: 'sm' | 'md';
  /** Visible label. Omit only in the site header, where the icon + placeholder carry the meaning and an aria-label is applied. */
  label?: string;
}

export function SearchField({
  placeholder = 'Search collections, artefacts, events',
  value,
  onChange,
  onClear,
  size = 'md',
  id = 'search',
  label,
  className,
  ...rest
}: SearchFieldProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      {label && (
        <label htmlFor={id} className="type-label text-heading">
          {label}
        </label>
      )}
      <div
        role="search"
        className={cn(
          'flex items-center gap-2 rounded-pill border border-line-default bg-surface-card px-3 transition-control focus-within:border-olive-500 focus-within:shadow-focus',
          size === 'sm' ? 'h-9' : 'h-11',
        )}
      >
        <Icon name="search" size={18} className="text-muted" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={label ? undefined : 'Search'}
          className="type-body min-w-0 flex-1 border-0 bg-transparent text-heading outline-none"
          {...rest}
        />
        {value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="grid cursor-pointer place-items-center border-0 bg-transparent p-1"
          >
            <Icon name="x" size={16} className="text-muted" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
