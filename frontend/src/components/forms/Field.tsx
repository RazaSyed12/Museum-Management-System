import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* Shared label + hint + error shell. Every form control in this system is
   labelled — placeholder-only fields are not permitted. */
export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** id of the control this label points at. */
  htmlFor?: string;
  hint?: string;
  /** Message text; renders the error treatment and role="alert". */
  error?: string;
  required?: boolean;
  optional?: boolean;
  children?: ReactNode;
}

export function Field({ label, htmlFor, hint, error, required, optional, children, className, ...rest }: FieldProps) {
  return (
    <div className={cn('grid gap-2', className)} {...rest}>
      {label && (
        <label htmlFor={htmlFor} className="type-label flex items-baseline gap-1.5 text-heading">
          {label}
          {required && <span aria-hidden="true" className="text-danger-600">*</span>}
          {optional && <span className="type-body-sm text-muted">Optional</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="type-body-sm text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="type-body-sm flex items-center gap-1.5 text-danger-600">
          <span aria-hidden="true">⚠</span>{error}
        </p>
      )}
    </div>
  );
}
