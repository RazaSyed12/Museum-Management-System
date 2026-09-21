import * as React from 'react';
export interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  size?: 'sm' | 'md';
  /** Visible label. Omit only in the site header, where the icon + placeholder carry the meaning and an aria-label is applied. */
  label?: string;
}
export declare function SearchField(props: SearchFieldProps): JSX.Element;
