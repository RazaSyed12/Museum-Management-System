import * as React from 'react';
/**
 * @startingPoint section="Navigation" subtitle="Responsive visitor header, signed-out and signed-in" viewport="1440x120"
 */
export interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** auto follows window width (mobile <768, tablet <1100). Force a value to preview a breakpoint. */
  mode?: 'auto' | 'desktop' | 'tablet' | 'mobile';
  items?: string[];
  active?: string;
  /** Signed-in visitor. Omit for the anonymous state. */
  user?: { name: string; initials: string };
  /** Adds the gold "Member" flag under the visitor's name. */
  isMember?: boolean;
  assetBase?: string;
  onNavigate?: (item: string) => void;
  onSearch?: () => void;
  onMenu?: () => void;
  onSignIn?: () => void;
}
export declare function SiteHeader(props: SiteHeaderProps): JSX.Element;
