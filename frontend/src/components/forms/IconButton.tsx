import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

/* Hover is a CSS variant rather than React state. */
type Size = 'sm' | 'md' | 'lg';
type Variant = 'ghost' | 'outline' | 'solid' | 'inverse';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide slug. */
  icon: string;
  /** Required accessible name — icon buttons never ship without one. */
  label: string;
  variant?: Variant;
  size?: Size;
}

const SIZES: Record<Size, string> = { sm: 'size-9', md: 'size-11', lg: 'size-13' };

// `rest` is the resting look; `hover` is kept apart so a disabled button can
// drop it (a disabled control shouldn't react to the pointer).
const VARIANTS: Record<Variant, { rest: string; hover: string }> = {
  ghost: { rest: 'border-transparent bg-transparent text-heading', hover: 'hover:bg-paper-100' },
  outline: { rest: 'border-line-default bg-surface-card text-olive-700', hover: 'hover:bg-olive-50' },
  solid: { rest: 'border-transparent bg-action-primary text-inverse', hover: 'hover:bg-action-primary-hover' },
  inverse: { rest: 'border-line-inverse bg-white/10 text-paper-50', hover: 'hover:bg-white/18' },
};

export function IconButton({ icon, label, variant = 'ghost', size = 'md', disabled, className, ...rest }: IconButtonProps) {
  const v = VARIANTS[variant];
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={cn(
        'inline-grid place-items-center rounded-md border transition-control',
        SIZES[size],
        v.rest,
        disabled ? 'cursor-not-allowed bg-action-disabled-bg text-action-disabled-text' : ['cursor-pointer', v.hover],
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 18 : 20} />
    </button>
  );
}
