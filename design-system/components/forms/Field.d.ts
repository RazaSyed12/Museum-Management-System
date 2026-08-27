import * as React from 'react';
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** id of the control this label points at. */
  htmlFor?: string;
  hint?: string;
  /** Message text; renders the error treatment and role="alert". */
  error?: string;
  required?: boolean;
  optional?: boolean;
}
export declare function Field(props: FieldProps): JSX.Element;
