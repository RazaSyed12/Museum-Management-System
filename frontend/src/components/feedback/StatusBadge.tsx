import type { HTMLAttributes } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

/* Status is never communicated by colour alone: every badge carries an icon and a word.
   Ported from design-system/components/feedback/StatusBadge.jsx + StatusBadge.d.ts. */
type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'member' | 'olive';

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** success = published / confirmed / tickets available, warning = limited availability / pending / draft, danger = sold out / cancelled, member = membership privileges, info = free event, olive = category tag. */
  tone?: Tone;
  /** Override the tone's default Lucide glyph. */
  icon?: string;
  size?: 'sm' | 'md';
}

const TONES: Record<Tone, { classes: string; icon: string }> = {
  neutral: { classes: 'bg-paper-100 text-neutral-700', icon: 'circle' },
  success: { classes: 'bg-success-100 text-success-700', icon: 'check-circle-2' },
  warning: { classes: 'bg-warning-100 text-warning-700', icon: 'alert-triangle' },
  danger: { classes: 'bg-danger-100 text-danger-700', icon: 'x-circle' },
  info: { classes: 'bg-info-100 text-info-700', icon: 'info' },
  member: { classes: 'bg-sand-200 text-gold-700', icon: 'award' },
  olive: { classes: 'bg-olive-100 text-olive-700', icon: 'tag' },
};

export function StatusBadge({ children, tone = 'neutral', icon, size = 'md', className, ...rest }: StatusBadgeProps) {
  const t = TONES[tone];
  const sm = size === 'sm';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill font-body font-semibold tracking-wide whitespace-nowrap uppercase',
        // leading goes after the size: tailwind-merge treats a later text-* as
        // able to set line-height, so an earlier leading-* would be dropped.
        sm ? 'px-2 py-[3px] text-2xs leading-[1.2]' : 'px-2.5 py-[5px] text-xs leading-[1.2]',
        t.classes,
        className,
      )}
      {...rest}
    >
      <Icon name={icon || t.icon} size={sm ? 11 : 13} />
      {children}
    </span>
  );
}
