import * as React from 'react';
export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** primary = stacked temple lockup, horizontal = mark + wordmark (header default), mark = circular H badge (mobile / favicon). */
  variant?: 'primary' | 'horizontal' | 'mark';
  /** Rendered height in px. */
  height?: number;
  /** Relative path to the design system's assets/ directory. */
  assetBase?: string;
  href?: string;
}
export declare function Logo(props: LogoProps): JSX.Element;
