import * as React from 'react';
export interface Column {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  sortable?: boolean;
  /** Custom cell renderer — use for StatusBadge cells and row actions. */
  render?: (row: any) => React.ReactNode;
}
export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: Column[];
  rows?: any[];
  caption?: string;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  /** EmptyState element rendered when rows is empty. */
  empty?: React.ReactNode;
  dense?: boolean;
}
export declare function DataTable(props: DataTableProps): JSX.Element;
