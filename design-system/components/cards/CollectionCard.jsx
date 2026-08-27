import React from 'react';
import { Card } from './Card.jsx';
import { Media } from '../foundation/Media.jsx';
import { StatusBadge } from '../feedback/StatusBadge.jsx';

export function CollectionCard({ name, category, period, description, itemCount, image, tone = 'olive', href = '#', style, ...rest }) {
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
