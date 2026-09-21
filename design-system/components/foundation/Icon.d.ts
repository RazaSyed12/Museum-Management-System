import * as React from 'react';
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon slug, e.g. "calendar-days", "ticket", "search". */
  name: string;
  /** Pixel box. 16 inline, 20 default, 24 nav, 32 feature. */
  size?: number;
  strokeWidth?: 'light' | 'normal';
  /** Any CSS colour; defaults to currentColor. */
  color?: string;
  /** Accessible name. Omit for purely decorative icons (renders aria-hidden). */
  label?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
