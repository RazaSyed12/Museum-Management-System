import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

// Omit 'size': same collision as SearchField/Select — the native <input
// size> (visible character width, a number) versus this component's 'sm' | 'md'.
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Error state: red border + danger focus ring. Pair with Field's error message. */
  invalid?: boolean;
  size?: 'sm' | 'md';
  /** Lucide slug rendered inside the field. */
  iconLeft?: string;
}

export function Input({ invalid, size = 'md', iconLeft, disabled, className, ...rest }: InputProps) {
  const input = (
    <input
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        'type-body w-full rounded-md border bg-surface-card text-heading outline-none transition-control focus:shadow-focus',
        size === 'sm' ? 'min-h-9 px-2.5 py-[7px]' : 'min-h-11 px-3.5 py-2.5',
        invalid ? 'border-danger-600 focus:border-danger-600 focus:shadow-danger-ring' : 'border-line-default focus:border-olive-500',
        disabled && 'cursor-not-allowed bg-surface-sunken text-action-disabled-text',
        iconLeft && 'pl-10.5',
        className,
      )}
      {...rest}
    />
  );
  if (!iconLeft) return input;
  const url = `url("https://unpkg.com/lucide-static@0.454.0/icons/${iconLeft}.svg")`;
  return (
    <span className="relative block">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 bg-current text-muted mask-center mask-contain mask-no-repeat"
        style={{ maskImage: url, WebkitMaskImage: url }}
      />
      {input}
    </span>
  );
}
