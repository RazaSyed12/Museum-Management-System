import * as React from 'react';
export interface RadioOption { value: string; label: string }
export interface RadioGroupProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  name: string;
  options?: (string | RadioOption)[];
  value?: string;
  onChange?: (value: string) => void;
  legend?: string;
  direction?: 'row' | 'column';
}
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
