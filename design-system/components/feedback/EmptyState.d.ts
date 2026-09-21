import * as React from 'react';
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** Tighter padding for use inside cards and drawers. */
  compact?: boolean;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
