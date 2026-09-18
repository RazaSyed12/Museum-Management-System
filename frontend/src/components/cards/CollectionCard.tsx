import type { HTMLAttributes } from 'react';
import { Card } from './Card';
import { Media } from '@/components/foundation/Media';
import { StatusBadge } from '@/components/feedback/StatusBadge';

/* Ported from design-system/components/cards/CollectionCard.jsx + CollectionCard.d.ts — keep in sync. */
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

export function CollectionCard({ name, category, period, description, itemCount, image, tone = 'olive', href = '#', style, ...rest }: CollectionCardProps) {
  return (
    <Card interactive as="a" href={href} padding={0} style={style} {...rest}>
      <Media src={image} ratio="4 / 3" tone={tone} caption={name} radius="0" />
      <div style={{ display: 'grid', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-5) var(--space-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {category && <StatusBadge tone="olive" size="sm">{category}</StatusBadge>}
          {period && <StatusBadge tone="neutral" size="sm" icon="hourglass">{period}</StatusBadge>}
        </div>
        <h3 style={{ font: 'var(--type-h3)', color: 'var(--text-heading)' }}>{name}</h3>
        {description && <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</p>}
        {itemCount != null && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-accent)', fontWeight: 'var(--weight-semibold)' }}>{itemCount} objects</span>}
      </div>
    </Card>
  );
}
