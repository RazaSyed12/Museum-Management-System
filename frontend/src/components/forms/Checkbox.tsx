import type { InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

/* Checked/focus/disabled styling is CSS (peer-*, has-*) rather than
   React-driven inline styles, so this needs no client-side state itself —
   only the caller (a controlled `checked`/`onChange`) makes it interactive. */
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  /** Secondary line under the label, e.g. newsletter explanation. */
  description?: string;
  invalid?: boolean;
}

export function Checkbox({ label, description, invalid, disabled, id, className, ...rest }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn('flex min-h-11 items-start gap-3 py-1.5', disabled ? 'cursor-not-allowed' : 'cursor-pointer', className)}
    >
      <span
        className={cn(
          // has-checked: reaches this ancestor of the input; peer-checked: (below) reaches the icon, its sibling.
          'has-checked:border-action-primary has-checked:bg-action-primary relative mt-0.5 grid size-5 flex-none place-items-center rounded-sm border bg-surface-card transition-control',
          invalid ? 'border-danger-600' : 'border-line-default',
          disabled && 'bg-surface-sunken',
        )}
      >
        <input id={id} type="checkbox" disabled={disabled} className="peer absolute inset-0 m-0 cursor-inherit opacity-0" {...rest} />
        <Icon name="check" size={14} className="hidden text-paper-50 peer-checked:block" />
      </span>
      <span className="grid gap-0.5">
        <span className={cn('type-body', disabled ? 'text-action-disabled-text' : 'text-heading')}>{label}</span>
        {description && <span className="type-body-sm text-muted">{description}</span>}
      </span>
    </label>
  );
}
