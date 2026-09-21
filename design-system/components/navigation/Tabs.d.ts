import * as React from 'react';
export interface TabItem { value: string; label: string; count?: number }
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: (string | TabItem)[];
  value?: string;
  onChange?: (value: string) => void;
  /** underline for page sections, pill for filter-style switching (Now / Upcoming / Past). */
  variant?: 'underline' | 'pill';
}
export declare function Tabs(props: TabsProps): JSX.Element;
