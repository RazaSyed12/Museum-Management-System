import React from 'react';
import { Card } from './Card.jsx';
import { Media } from '../foundation/Media.jsx';
import { Icon } from '../foundation/Icon.jsx';

/* The reason line explains a recommendation in human terms ("Because you explored
   Prehistory") — never expose scoring, models or technical logic to visitors. */
export function RecommendationCard({ title, kind = 'Collection', reason, image, tone = 'olive', href = '#', style, ...rest }) {
  return (
    <Card interactive as="a" href={href} padding={0} style={{ display: 'grid', gridTemplateColumns: '104px minmax(0,1fr)', alignItems: 'stretch', ...style }} {...rest}>
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <Media src={image} ratio="auto" tone={tone} caption={title} radius="0" style={{ width: '100%', height: '100%', aspectRatio: 'auto', minHeight: 104 }} />
      </div>
      <div style={{ display: 'grid', gap: 4, padding: 'var(--space-4)', alignContent: 'center' }}>
        <span style={{ font: 'var(--type-eyebrow)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--text-muted)' }}>{kind}</span>
        <h4 style={{ font: 'var(--weight-medium) var(--text-md)/var(--leading-snug) var(--font-display)', color: 'var(--text-heading)' }}>{title}</h4>
        {reason && (
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', font: 'var(--type-body-sm)', color: 'var(--text-accent)' }}>
            <Icon name="sparkles" size={14} />{reason}
          </span>
        )}
      </div>
    </Card>
  );
}
