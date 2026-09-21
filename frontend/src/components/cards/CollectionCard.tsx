import type { HTMLAttributes } from 'react';
import { Card } from './Card';
import { Media } from '@/components/foundation/Media';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { cn } from '@/lib/cn';

/* Ported from design-system/components/cards/CollectionCard.jsx + CollectionCard.d.ts. */
export interface CollectionCardProps extends HTMLAttributes<HTMLElement> {
  name: string;
  /** Staff-managed category — never hard-coded. */
  category?: string;
  period?: string;
  description?: string;
  itemCount?: number;
  image?: string;
  tone?: 'olive' | 'green' | 'sand' | 'stone';
  href?: string;
}

export function CollectionCard({ name, category, period, description, itemCount, image, tone = 'olive', href = '#', className, ...rest }: CollectionCardProps) {
  return (
    <Card interactive as="a" href={href} className={cn('p-0', className)} {...rest}>
      <Media src={image} ratio="4 / 3" tone={tone} caption={name} className="rounded-none" />
      <div className="grid gap-2 px-5 pt-4 pb-5">
        <div className="flex flex-wrap gap-2">
          {category && <StatusBadge tone="olive" size="sm">{category}</StatusBadge>}
          {period && <StatusBadge tone="neutral" size="sm" icon="hourglass">{period}</StatusBadge>}
        </div>
        <h3 className="type-h3 text-heading">{name}</h3>
        {description && <p className="type-body-sm line-clamp-2 text-muted">{description}</p>}
        {itemCount != null && <span className="type-body-sm font-semibold text-accent-fg">{itemCount} objects</span>}
      </div>
    </Card>
  );
}
