import * as React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error state: red border + danger focus ring. Pair with Field's error message. */
  invalid?: boolean;
  size?: 'sm' | 'md';
  /** Lucide slug rendered inside the field. */
  iconLeft?: string;
}
export declare function Input(props: InputProps): JSX.Element;
