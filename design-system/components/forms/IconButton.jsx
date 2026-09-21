import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

const SIZES = { sm: 36, md: 44, lg: 52 };

export function IconButton({ icon, label, variant = 'ghost', size = 'md', disabled, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const box = SIZES[size] || 44;
  const fills = {
    ghost: { bg: hover ? 'var(--paper-100)' : 'transparent', fg: 'var(--text-heading)', bd: 'transparent' },
    outline: { bg: hover ? 'var(--olive-50)' : 'var(--surface-card)', fg: 'var(--olive-700)', bd: 'var(--border-default)' },
    solid: { bg: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)', fg: 'var(--text-inverse)', bd: 'transparent' },
    inverse: { bg: hover ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.10)', fg: 'var(--paper-50)', bd: 'var(--border-inverse)' },
  }[variant];
  return (
    <button
      type="button" aria-label={label} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: box, height: box, display: 'inline-grid', placeItems: 'center',
        borderRadius: 'var(--radius-md)', border: `var(--border-width) solid ${fills.bd}`,
        background: disabled ? 'var(--action-disabled-bg)' : fills.bg,
        color: disabled ? 'var(--action-disabled-text)' : fills.fg,
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'var(--transition-control)', ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 18 : 20} />
    </button>
  );
}
