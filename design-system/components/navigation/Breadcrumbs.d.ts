import * as React from 'react';
export interface Crumb { label: string; href?: string }
export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items?: (string | Crumb)[];
}
export declare function Breadcrumbs(props: BreadcrumbsProps): JSX.Element;
