import * as React from 'react';
export interface StaffTopBarProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  /** Page-level Buttons, e.g. "Create event". */
  actions?: React.ReactNode;
  user?: { name: string; role: string; initials: string };
  /** Show the hamburger (tablet / mobile). */
  showMenu?: boolean;
  onMenu?: () => void;
  showSearch?: boolean;
}
export declare function StaffTopBar(props: StaffTopBarProps): JSX.Element;
