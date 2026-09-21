import * as React from 'react';
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  onDismiss?: () => void;
  /** Optional Button rendered under the message. */
  action?: React.ReactNode;
}
export declare function Alert(props: AlertProps): JSX.Element;
