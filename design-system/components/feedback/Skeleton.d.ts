import * as React from 'react';
export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  radius?: string;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;
export interface SkeletonCardProps { style?: React.CSSProperties }
/** Card-shaped loading placeholder matching CollectionCard / EventCard geometry. */
export declare function SkeletonCard(props: SkeletonCardProps): JSX.Element;
