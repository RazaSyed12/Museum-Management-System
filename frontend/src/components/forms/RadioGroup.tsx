import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface RadioOption {
  value: string;
  label: string;
}

// Omit 'onChange': this component's onChange(value: string) collides with
// the native fieldset change event, same class of bug as Tabs'/Pagination's.
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  name: string;
  options?: (string | RadioOption)[];
  value?: string;
  onChange?: (value: string) => void;
  legend?: string;
  direction?: 'row' | 'column';
}

export function RadioGroup({
  name,
  options = [],
  value,
  onChange,
  legend,
  direction = 'column',
  className,
  ...rest
}: RadioGroupProps) {
  return (
    <fieldset className={cn('m-0 grid gap-2 border-0 p-0', className)} {...rest}>
      {legend && <legend className="type-label mb-1 p-0 text-heading">{legend}</legend>}
      <div className={cn('flex flex-wrap', direction === 'row' ? 'gap-5' : 'flex-col gap-1')}>
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          const on = value === v;
          return (
            <label key={v} className="flex min-h-11 cursor-pointer items-center gap-3">
              <span
                className={cn(
                  'relative grid size-5 flex-none place-items-center rounded-full border-2 bg-surface-card',
                  on ? 'border-action-primary' : 'border-line-default',
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={v}
                  checked={on}
                  onChange={() => onChange?.(v)}
                  className="absolute inset-0 m-0 cursor-pointer opacity-0"
                />
                {on && <span className="size-2.5 rounded-full bg-action-primary" />}
              </span>
              <span className="type-body text-heading">{l}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
