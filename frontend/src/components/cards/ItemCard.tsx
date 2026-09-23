import type { HTMLAttributes } from 'react';
import { Card } from './Card';
import { Media } from '@/components/foundation/Media';
import { cn } from '@/lib/cn';

export interface ItemCardProps extends HTMLAttributes<HTMLElement> {
  name: string;
  period?: string;
  /** Approximate date, e.g. "c. 1450". */
  date?: string;
  description?: string;
  image?: string;
  href?: string;
}

export function ItemCard({ name, period, date, description, image, href = '#', className, ...rest }: ItemCardProps) {
  return (
    <Card interactive as="a" href={href} className={cn('p-0', className)} {...rest}>
      <Media src={image} ratio="1 / 1" tone="stone" caption={name} className="rounded-none" />
      <div className="grid gap-1.5 p-4">
        <h4 className="font-display text-md leading-snug font-medium text-heading">{name}</h4>
        {(period || date) && (
          <span className="type-body-sm tracking-wide text-accent-fg">{[period, date].filter(Boolean).join(' · ')}</span>
        )}
        {description && <p className="type-body-sm line-clamp-2 text-muted">{description}</p>}
      </div>
    </Card>
  );
}
