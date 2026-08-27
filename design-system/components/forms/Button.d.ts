import * as React from 'react';
/**
 * @startingPoint section="Forms" subtitle="Primary, secondary, accent, ghost and danger actions" viewport="700x220"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = dark-green fill (one per view), secondary = olive outline, accent = pale-yellow (used on dark surfaces), ghost = bare, danger = destructive staff actions. */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  /** md (44px) is the touch-safe default; sm only in dense staff tables. */
  size?: 'sm' | 'md' | 'lg';
  /** Lucide slug rendered before the label. */
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  fullWidth?: boolean;
  /** Render as "a" for link actions. */
  as?: 'button' | 'a';
}
export declare function Button(props: ButtonProps): JSX.Element;
