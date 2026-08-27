import * as React from 'react';
export interface DrawerProps extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;
  /** left = mobile navigation, right = staff detail panels, bottom = mobile filters. */
  side?: 'left' | 'right' | 'bottom';
  title?: string;
  footer?: React.ReactNode;
  onClose?: () => void;
  /** Width in px for side drawers. */
  size?: number;
}
export declare function Drawer(props: DrawerProps): JSX.Element | null;
