import * as React from 'react';
export interface SelectOption { value: string; label: string }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Strings or {value,label} pairs. Categories are data-driven — never hard-code the museum's category list. */
  options?: (string | SelectOption)[];
  placeholder?: string;
  invalid?: boolean;
  size?: 'sm' | 'md';
}
export declare function Select(props: SelectProps): JSX.Element;
