import * as React from 'react';
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  /** Secondary line under the label, e.g. newsletter explanation. */
  description?: string;
  invalid?: boolean;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
