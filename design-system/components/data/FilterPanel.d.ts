import * as React from 'react';
export interface FilterOption { value: string; label: string; count?: number }
export interface FilterGroup { title: string; options: (string | FilterOption)[] }
export interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Groups are data-driven so staff-created categories appear automatically. */
  groups?: FilterGroup[];
  /** Map of group title → selected values. */
  selected?: Record<string, string[]>;
  onToggle?: (group: string, value: string) => void;
  sortOptions?: (string | { value: string; label: string })[];
  sort?: string;
  onSort?: (value: string) => void;
  onClear?: () => void;
  activeCount?: number;
}
export declare function FilterPanel(props: FilterPanelProps): JSX.Element;
