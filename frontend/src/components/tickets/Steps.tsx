import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

const LABELS = ['Tickets', 'Checkout', 'Payment', 'Confirmation'];

export function Steps({ step }: { step: number }) {
  return (
    <ol className="m-0 flex list-none flex-wrap gap-3 p-0 md:gap-6">
      {LABELS.map((label, i) => {
        const done = i < step;
        const on = i === step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                'grid size-6.5 place-items-center rounded-full font-body text-xs leading-none font-semibold',
                done
                  ? 'bg-olive-500 text-paper-50'
                  : on
                    ? 'bg-green-900 text-paper-50'
                    : 'bg-paper-200 text-muted',
              )}
            >
              {done ? <Icon name="check" size={13} /> : i + 1}
            </span>
            <span
              className={cn(
                'font-body text-sm leading-none font-semibold',
                on ? 'text-heading' : 'hidden text-muted md:inline',
              )}
            >
              {label}
            </span>
            {i < LABELS.length - 1 && (
              <Icon name="chevron-right" size={14} className="hidden text-neutral-400 md:inline" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
