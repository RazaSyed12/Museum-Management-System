import * as React from 'react';
export interface CollectionCardProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  /** Staff-managed category — never hard-coded. */
  category?: string;
  period?: string;
  description?: string;
  itemCount?: number;
  image?: string;
  tone?: 'olive' | 'green' | 'sand' | 'stone';
  href?: string;
}
export declare function CollectionCard(props: CollectionCardProps): JSX.Element;
