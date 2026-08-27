import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

/* Status is never communicated by colour alone: every badge carries an icon and a word. */
const TONES = {
  neutral:  { bg: 'var(--paper-100)',    fg: 'var(--neutral-700)',  icon: 'circle' },
  success:  { bg: 'var(--success-100)',  fg: '#2C5C39',             icon: 'check-circle-2' },
  warning:  { bg: 'var(--warning-100)',  fg: '#8A6114',             icon: 'alert-triangle' },
  danger:   { bg: 'var(--danger-100)',   fg: '#8F3124',             icon: 'x-circle' },
  info:     { bg: 'var(--info-100)',     fg: '#2E4C5E',             icon: 'info' },
  member:   { bg: 'var(--sand-200)',     fg: 'var(--gold-700)',     icon: 'award' },
  olive:    { bg: 'var(--olive-100)',    fg: 'var(--olive-700)',    icon: 'tag' },
};

export function StatusBadge({ children, tone = 'neutral', icon, size = 'md', style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: sm ? '3px 8px' : '5px 10px', borderRadius: 'var(--radius-pill)',
      background: t.bg, color: t.fg,
      font: `var(--weight-semibold) ${sm ? 'var(--text-2xs)' : 'var(--text-xs)'}/1.2 var(--font-body)`,
      letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', whiteSpace: 'nowrap', ...style,
    }} {...rest}>
      <Icon name={icon || t.icon} size={sm ? 11 : 13} />
      {children}
    </span>
  );
}
