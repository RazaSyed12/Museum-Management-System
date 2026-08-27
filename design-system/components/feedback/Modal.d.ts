import * as React from 'react';
export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  title?: string;
  description?: string;
  /** Buttons, right-aligned. Cancel first, confirm last. */
  footer?: React.ReactNode;
  onClose?: () => void;
  width?: number;
}
export declare function Modal(props: ModalProps): JSX.Element | null;
