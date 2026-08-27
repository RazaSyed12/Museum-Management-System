import * as React from 'react';
export interface FooterColumn { title: string; links: string[] }
export interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  columns?: FooterColumn[];
  assetBase?: string;
}
export declare function SiteFooter(props: SiteFooterProps): JSX.Element;
