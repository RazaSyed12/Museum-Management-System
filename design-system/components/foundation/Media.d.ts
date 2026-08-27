import * as React from 'react';
export interface MediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Real photograph URL. Omitted = duotone placeholder block. */
  src?: string;
  alt?: string;
  /** CSS aspect-ratio, e.g. "16 / 9", "4 / 3", "1 / 1". */
  ratio?: string;
  tone?: 'olive' | 'green' | 'sand' | 'stone';
  /** Placeholder label describing the intended shot. */
  caption?: string;
  radius?: string;
  /** Apply the bottom protection gradient for overlaid text. */
  scrim?: boolean;
}
export declare function Media(props: MediaProps): JSX.Element;
