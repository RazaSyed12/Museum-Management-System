import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* Focus is a CSS variant (focus:) rather than React state. */
export interface SelectOption {
  value: string;
  label: string;
}

// Omit 'size': same collision as SearchField's — the native <select size>
// (visible rows, a number) versus this component's 'sm' | 'md'.
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Strings or {value,label} pairs. Categories are data-driven — never hard-code the museum's category list. */
  options?: (string | SelectOption)[];
  placeholder?: string;
  invalid?: boolean;
  size?: 'sm' | 'md';
}

export function Select({ options = [], invalid, size = 'md', disabled, placeholder, className, ...rest }: SelectProps) {
  return (
    <span className="relative block">
      <select
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          'type-body w-full appearance-none rounded-md border bg-surface-card pr-10 text-heading outline-none transition-control focus:shadow-focus',
          size === 'sm' ? 'min-h-9 px-2.5 py-[7px]' : 'min-h-11 px-3.5 py-2.5',
          invalid ? 'border-danger-600 focus:border-danger-600 focus:shadow-danger-ring' : 'border-line-default focus:border-olive-500',
          disabled ? 'cursor-not-allowed bg-surface-sunken text-action-disabled-text' : 'cursor-pointer',
          className,
        )}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
      <Chevron />
    </span>
  );
}

function Chevron() {
  const url = 'url("https://unpkg.com/lucide-static@0.454.0/icons/chevron-down.svg")';
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 bg-current text-muted mask-center mask-contain mask-no-repeat"
      style={{ maskImage: url, WebkitMaskImage: url }}
    />
  );
}
