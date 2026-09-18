import type { HTMLAttributes } from 'react';
import { Icon } from '@/components/foundation/Icon';

/* Status is never communicated by colour alone: every badge carries an icon and a word.
   Ported from design-system/components/feedback/StatusBadge.jsx + StatusBadge.d.ts — keep in sync. */
type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'member' | 'olive';

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** success = published / confirmed / tickets available, warning = limited availability / pending / draft, danger = sold out / cancelled, member = membership privileges, info = free event, olive = category tag. */
  tone?: Tone;
  /** Override the tone's default Lucide glyph. */
  icon?: string;
  size?: 'sm' | 'md';
}

const TONES: Record<Tone, { bg: string; fg: string; icon: string }> = {
  neutral: { bg: 'var(--paper-100)', fg: 'var(--neutral-700)', icon: 'circle' },
  success: { bg: 'var(--success-100)', fg: '#2C5C39', icon: 'check-circle-2' },
  warning: { bg: 'var(--warning-100)', fg: '#8A6114', icon: 'alert-triangle' },
  danger: { bg: 'var(--danger-100)', fg: '#8F3124', icon: 'x-circle' },
  info: { bg: 'var(--info-100)', fg: '#2E4C5E', icon: 'info' },
  member: { bg: 'var(--sand-200)', fg: 'var(--gold-700)', icon: 'award' },
  olive: { bg: 'var(--olive-100)', fg: 'var(--olive-700)', icon: 'tag' },
};

export function StatusBadge({ children, tone = 'neutral', icon, size = 'md', style, ...rest }: StatusBadgeProps) {
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
