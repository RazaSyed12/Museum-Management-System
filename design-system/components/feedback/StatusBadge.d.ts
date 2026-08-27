import * as React from 'react';
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** success = published / confirmed / tickets available, warning = limited availability / pending / draft, danger = sold out / cancelled, member = membership privileges, info = free event, olive = category tag. */
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'member' | 'olive';
  /** Override the tone's default Lucide glyph. */
  icon?: string;
  size?: 'sm' | 'md';
}
export declare function StatusBadge(props: StatusBadgeProps): JSX.Element;
