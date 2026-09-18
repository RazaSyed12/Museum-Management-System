'use client';

import { useState, type ButtonHTMLAttributes } from 'react';
import { Icon } from '@/components/foundation/Icon';

/* Ported from design-system/components/forms/IconButton.jsx + IconButton.d.ts — keep in sync. */
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

const SIZES: Record<Size, number> = { sm: 36, md: 44, lg: 52 };

export function IconButton({ icon, label, variant = 'ghost', size = 'md', disabled, style, ...rest }: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const box = SIZES[size] || 44;
  const fills: Record<Variant, { bg: string; fg: string; bd: string }> = {
    ghost: { bg: hover ? 'var(--paper-100)' : 'transparent', fg: 'var(--text-heading)', bd: 'transparent' },
    outline: { bg: hover ? 'var(--olive-50)' : 'var(--surface-card)', fg: 'var(--olive-700)', bd: 'var(--border-default)' },
    solid: { bg: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)', fg: 'var(--text-inverse)', bd: 'transparent' },
    inverse: { bg: hover ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.10)', fg: 'var(--paper-50)', bd: 'var(--border-inverse)' },
  };
  const fill = fills[variant];
  return (
    <button
      type="button" aria-label={label} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: box, height: box, display: 'inline-grid', placeItems: 'center',
        borderRadius: 'var(--radius-md)', border: `var(--border-width) solid ${fill.bd}`,
        background: disabled ? 'var(--action-disabled-bg)' : fill.bg,
        color: disabled ? 'var(--action-disabled-text)' : fill.fg,
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'var(--transition-control)', ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 18 : 20} />
    </button>
  );
}
