import * as React from 'react';
export interface ItemCardProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  period?: string;
  /** Approximate date, e.g. "c. 1450". */
  date?: string;
  description?: string;
  image?: string;
  href?: string;
}
export declare function ItemCard(props: ItemCardProps): JSX.Element;
