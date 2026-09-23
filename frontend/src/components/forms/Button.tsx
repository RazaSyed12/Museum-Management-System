import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

/* Hover/active/disabled are CSS variants rather than React state, so
   this is a plain server-renderable component. */
type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'fluid';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = dark-green fill (one per view), secondary = olive outline, accent = pale-yellow (used on dark surfaces), ghost = bare, danger = destructive staff actions. */
  variant?: Variant;
  /** md (44px) is the touch-safe default; sm only in dense staff tables.
   *  fluid = md on mobile, growing to lg from the tablet breakpoint (heroes). */
  size?: Size;
  /** Lucide slug rendered before the label. */
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  fullWidth?: boolean;
  /** Render as "a" for link actions. */
  as?: 'button' | 'a';
  href?: string;
}

const SIZES: Record<Size, { box: string; icon: number }> = {
  sm: { box: 'h-9 min-w-9 gap-1.5 px-3.5 font-body text-xs font-semibold leading-none', icon: 16 },
  md: { box: 'h-11 min-w-11 gap-2 px-5 type-button', icon: 18 },
  lg: { box: 'h-13 min-w-13 gap-2.5 px-7 font-body text-base font-semibold leading-none', icon: 20 },
  fluid: {
    box: 'h-11 min-w-11 gap-2 px-5 type-button md:h-13 md:min-w-13 md:gap-2.5 md:px-7 md:text-base',
    icon: 18,
  },
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'border-action-primary bg-action-primary text-inverse hover:border-action-primary-hover hover:bg-action-primary-hover active:border-action-primary-active active:bg-action-primary-active',
  secondary: 'border-olive-500 bg-transparent text-olive-700 hover:bg-olive-50 active:bg-olive-100',
  accent:
    'border-action-accent bg-action-accent text-green-900 hover:border-sand-400 hover:bg-sand-400 active:border-sand-500 active:bg-sand-500',
  ghost: 'border-transparent bg-transparent text-heading hover:bg-paper-100 active:bg-paper-200',
  danger:
    'border-danger-600 bg-danger-600 text-white hover:border-danger-700 hover:bg-danger-700 active:border-danger-800 active:bg-danger-800',
};

const DISABLED = 'cursor-not-allowed border-transparent bg-action-disabled-bg text-action-disabled-text';

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading,
  disabled,
  fullWidth,
  as = 'button',
  children,
  className,
  ...rest
}: ButtonProps) {
  const s = SIZES[size];
  const classes = cn(
    'items-center justify-center rounded-md border tracking-[0.02em] whitespace-nowrap no-underline transition-control',
    fullWidth ? 'flex w-full' : 'inline-flex',
    s.box,
    disabled ? DISABLED : ['cursor-pointer', VARIANTS[variant]],
    className,
  );

  const content = (
    <>
      {loading && <Icon name="loader-circle" size={s.icon} className="animate-spin" />}
      {!loading && iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </>
  );

  // `as` makes this a genuinely polymorphic element (<button> or <a>) — a
  // single dynamically-typed tag can't be typed cleanly against two
  // different intrinsic element attribute sets in TSX (shared handlers like
  // onClick end up wanting an impossible intersection type), so the two
  // tags are rendered explicitly instead. `rest` only ever carries
  // attributes valid on both in this codebase's actual usage (href, id,
  // aria-*, data-*, onClick), so the cast on the anchor branch is safe.
  if (as === 'a') {
    return (
      <a
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}
