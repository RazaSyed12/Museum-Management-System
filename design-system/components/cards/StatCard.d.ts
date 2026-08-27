import * as React from 'react';
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  /** Change text, e.g. "+12% vs last week". Always paired with an arrow icon. */
  delta?: string;
  deltaTone?: 'up' | 'down' | 'neutral';
  icon?: string;
  footnote?: string;
}
export declare function StatCard(props: StatCardProps): JSX.Element;
