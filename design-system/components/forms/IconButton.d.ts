import * as React from 'react';
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide slug. */
  icon: string;
  /** Required accessible name — icon buttons never ship without one. */
  label: string;
  variant?: 'ghost' | 'outline' | 'solid' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
