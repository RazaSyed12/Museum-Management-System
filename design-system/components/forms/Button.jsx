import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

const SIZES = {
  sm: { height: 36, padding: '0 14px', font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-body)', gap: 6, icon: 16 },
  md: { height: 44, padding: '0 20px', font: 'var(--type-button)', gap: 8, icon: 18 },
  lg: { height: 52, padding: '0 28px', font: 'var(--weight-semibold) var(--text-base)/1 var(--font-body)', gap: 10, icon: 20 },
};

function palette(variant, state) {
  const p = {
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
  }[variant] || {};
  if (state === 'hover') return variant === 'secondary' || variant === 'ghost' ? { ...p, bg: p.hover } : { ...p, bg: p.hover, bd: p.hover };
  if (state === 'active') return variant === 'secondary' || variant === 'ghost' ? { ...p, bg: p.active } : { ...p, bg: p.active, bd: p.active };
  return p;
}

export function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, loading, disabled, fullWidth, as = 'button', children, style, ...rest }) {
  const [state, setState] = React.useState('rest');
  const s = SIZES[size] || SIZES.md;
  const c = palette(variant, disabled ? 'rest' : state);
  const Tag = as;
  return (
    <Tag
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      onMouseEnter={() => setState('hover')}
      onMouseLeave={() => setState('rest')}
      onMouseDown={() => setState('active')}
      onMouseUp={() => setState('hover')}
      style={{
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
      }}
      {...rest}
    >
      {loading && <Icon name="loader-circle" size={s.icon} style={{ animation: 'hm-spin 900ms linear infinite' }} />}
      {!loading && iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </Tag>
  );
}
