import { cn } from '@/lib/cn';

/* A single-choice group of pill buttons — the filter row above the home page's
   collections and events, and the date picker in the plan-your-visit bar.
   Selection is conveyed by aria-pressed as well as colour. */
export interface FilterPillsProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group, e.g. "Filter collections". */
  label: string;
  className?: string;
}

export function FilterPills({ options, value, onChange, label, className }: FilterPillsProps) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const on = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option)}
            className={cn(
              'type-label inline-flex h-11 cursor-pointer items-center rounded-pill border px-4 whitespace-nowrap transition-control md:h-10',
              on
                ? 'border-action-primary bg-action-primary text-inverse'
                : 'border-line-default bg-surface-card text-heading hover:border-line-strong hover:bg-olive-50',
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
