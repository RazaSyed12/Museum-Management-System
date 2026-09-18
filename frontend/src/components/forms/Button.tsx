'use client';

import { useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { Icon } from '@/components/foundation/Icon';

/* Ported from design-system/components/forms/Button.jsx + Button.d.ts — keep in sync. */
type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = dark-green fill (one per view), secondary = olive outline, accent = pale-yellow (used on dark surfaces), ghost = bare, danger = destructive staff actions. */
  variant?: Variant;
  /** md (44px) is the touch-safe default; sm only in dense staff tables. */
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

const SIZES: Record<Size, { height: number; padding: string; font: string; gap: number; icon: number }> = {
  sm: { height: 36, padding: '0 14px', font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)', gap: 6, icon: 16 },
  md: { height: 44, padding: '0 20px', font: 'var(--type-button)', gap: 8, icon: 18 },
  lg: { height: 52, padding: '0 28px', font: 'var(--weight-semibold) var(--text-base)/1 var(--font-body)', gap: 10, icon: 20 },
};

interface Palette { bg: string; fg: string; bd: string; hover: string; active: string }

const PALETTES: Record<Variant, Palette> = {
  primary: { bg: 'var(--action-primary)', fg: 'var(--text-inverse)', bd: 'var(--action-primary)',
    hover: 'var(--action-primary-hover)', active: 'var(--action-primary-active)' },
  secondary: { bg: 'transparent', fg: 'var(--olive-700)', bd: 'var(--olive-500)',
    hover: 'var(--olive-50)', active: 'var(--olive-100)' },
  accent: { bg: 'var(--action-accent)', fg: 'var(--green-900)', bd: 'var(--action-accent)',
    hover: 'var(--sand-400)', active: 'var(--sand-500)' },
  ghost: { bg: 'transparent', fg: 'var(--text-heading)', bd: 'transparent',
    hover: 'var(--paper-100)', active: 'var(--paper-200)' },
  danger: { bg: 'var(--danger-600)', fg: '#fff', bd: 'var(--danger-600)',
    hover: '#8F3124', active: '#78281E' },
};

function palette(variant: Variant, state: 'rest' | 'hover' | 'active'): Palette {
  const p = PALETTES[variant];
  if (state === 'hover') return variant === 'secondary' || variant === 'ghost' ? { ...p, bg: p.hover } : { ...p, bg: p.hover, bd: p.hover };
  if (state === 'active') return variant === 'secondary' || variant === 'ghost' ? { ...p, bg: p.active } : { ...p, bg: p.active, bd: p.active };
  return p;
}

export function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, loading, disabled, fullWidth, as = 'button', children, style, ...rest }: ButtonProps) {
  const [state, setState] = useState<'rest' | 'hover' | 'active'>('rest');
  const s = SIZES[size] || SIZES.md;
  const c = palette(variant, disabled ? 'rest' : state);

  const computedStyle = {
    display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
    alignItems: 'center', justifyContent: 'center', gap: s.gap,
    height: s.height, padding: s.padding, minWidth: s.height,
    font: s.font, letterSpacing: '0.02em', textDecoration: 'none', whiteSpace: 'nowrap',
    borderRadius: 'var(--radius-md)',
    border: `var(--border-width) solid ${disabled ? 'transparent' : c.bd}`,
    background: disabled ? 'var(--action-disabled-bg)' : c.bg,
    color: disabled ? 'var(--action-disabled-text)' : c.fg,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--transition-control)',
    ...style,
  } as const;

  const content = (
    <>
      {loading && <Icon name="loader-circle" size={s.icon} style={{ animation: 'hm-spin 900ms linear infinite' }} />}
      {!loading && iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </>
  );

  // `as` makes this a genuinely polymorphic element (<button> or <a>) — a
  // single dynamically-typed tag can't be typed cleanly against two
  // different intrinsic element attribute sets in TSX (shared handlers like
  // onMouseEnter end up wanting an impossible intersection type), so the
  // two tags are rendered explicitly instead. `rest` only ever carries
  // attributes valid on both in this codebase's actual usage (href, id,
  // aria-*, data-*, onClick), so the cast on the anchor branch is safe.
  if (as === 'a') {
    return (
      <a
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        onMouseEnter={() => setState('hover')}
        onMouseLeave={() => setState('rest')}
        onMouseDown={() => setState('active')}
        onMouseUp={() => setState('hover')}
        style={computedStyle}
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
      onMouseEnter={() => setState('hover')}
      onMouseLeave={() => setState('rest')}
      onMouseDown={() => setState('active')}
      onMouseUp={() => setState('hover')}
      style={computedStyle}
      {...rest}
    >
      {content}
    </button>
  );
}
