import * as React from 'react';
export interface DateTimeFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Native picker type. */
  type?: 'date' | 'time' | 'datetime-local';
  invalid?: boolean;
}
export declare function DateTimeField(props: DateTimeFieldProps): JSX.Element;
