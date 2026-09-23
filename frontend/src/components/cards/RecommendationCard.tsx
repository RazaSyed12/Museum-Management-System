import type { HTMLAttributes } from 'react';
import { Card } from './Card';
import { Media } from '@/components/foundation/Media';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

/* The reason line explains a recommendation in human terms ("Because you explored
   Prehistory") — never expose scoring, models or technical logic to visitors. */
export interface RecommendationCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  /** What is being recommended: "Collection", "Event", "Artefact". */
  kind?: string;
  /** Plain-English justification, e.g. "Because you explored Prehistory". */
  reason?: string;
  image?: string;
  tone?: 'olive' | 'green' | 'sand' | 'stone';
  href?: string;
}

export function RecommendationCard({ title, kind = 'Collection', reason, image, tone = 'olive', href = '#', className, ...rest }: RecommendationCardProps) {
  return (
    <Card interactive as="a" href={href} className={cn('grid grid-cols-[104px_minmax(0,1fr)] items-stretch p-0', className)} {...rest}>
      <div className="min-w-0 overflow-hidden">
        <Media src={image} ratio="auto" tone={tone} caption={title} className="h-full min-h-26 w-full rounded-none" />
      </div>
      <div className="grid content-center gap-1 p-4">
        <span className="type-eyebrow tracking-wider text-muted uppercase">{kind}</span>
        <h4 className="font-display text-md leading-snug font-medium text-heading">{title}</h4>
        {reason && (
          <span className="type-body-sm inline-flex items-center gap-1.5 text-accent-fg">
            <Icon name="sparkles" size={14} />
            {reason}
          </span>
        )}
      </div>
    </Card>
  );
}
