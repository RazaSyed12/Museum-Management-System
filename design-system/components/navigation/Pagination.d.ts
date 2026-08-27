import * as React from 'react';
export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page?: number;
  pages?: number;
  onChange?: (page: number) => void;
  /** Render the mobile / infinite-browse "Load more" affordance instead of numbers. */
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  /** e.g. "Showing 24 of 96 collections" — shown above Load more. */
  resultLabel?: string;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
