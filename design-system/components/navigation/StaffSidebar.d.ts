import * as React from 'react';
export interface StaffNavItem { label: string; icon: string }
export interface StaffNavSection { title: string; items: StaffNavItem[] }
export interface StaffSidebarProps extends React.HTMLAttributes<HTMLElement> {
  sections?: StaffNavSection[];
  active?: string;
  /** Icon-only rail — the tablet state. On mobile render it inside a left Drawer instead. */
  collapsed?: boolean;
  onNavigate?: (label: string) => void;
  assetBase?: string;
}
export declare function StaffSidebar(props: StaffSidebarProps): JSX.Element;
