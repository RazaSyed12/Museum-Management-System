import * as React from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Enables the hover lift + olive border. Use for anything clickable. */
  interactive?: boolean;
  /** Set to 0 when the card holds an edge-to-edge image. */
  padding?: string | number;
  as?: 'div' | 'a' | 'article' | 'li';
}
export declare function Card(props: CardProps): JSX.Element;
