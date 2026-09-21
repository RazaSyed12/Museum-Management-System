import React from 'react';
import { Card } from './Card.jsx';
import { Media } from '../foundation/Media.jsx';

export function ItemCard({ name, period, date, description, image, href = '#', style, ...rest }) {
  return (
    <Card interactive as="a" href={href} padding={0} style={style} {...rest}>
      <Media src={image} ratio="1 / 1" tone="stone" caption={name} radius="0" />
      <div style={{ display: 'grid', gap: 6, padding: 'var(--space-4)' }}>
        <h4 style={{ font: 'var(--weight-medium) var(--text-md)/var(--leading-snug) var(--font-display)', color: 'var(--text-heading)' }}>{name}</h4>
        {(period || date) && (
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-accent)', letterSpacing: 'var(--tracking-wide)' }}>
            {[period, date].filter(Boolean).join(' · ')}
          </span>
        )}
        {description && <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</p>}
      </div>
    </Card>
  );
}
