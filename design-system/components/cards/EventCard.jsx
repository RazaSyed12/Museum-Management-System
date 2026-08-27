import React from 'react';
import { Card } from './Card.jsx';
import { Media } from '../foundation/Media.jsx';
import { StatusBadge } from '../feedback/StatusBadge.jsx';
import { Icon } from '../foundation/Icon.jsx';
import { Button } from '../forms/Button.jsx';

const AVAIL = {
  available: { tone: 'success', label: 'Tickets available' },
  limited:   { tone: 'warning', label: 'Limited availability' },
  soldout:   { tone: 'danger',  label: 'Sold out' },
  cancelled: { tone: 'danger',  label: 'Cancelled' },
};

function Meta({ icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
      <Icon name={icon} size={15} color="var(--olive-500)" />{children}
    </span>
  );
}

export function EventCard({ title, description, date, time, location, price, free, availability = 'available', image, layout = 'vertical', href = '#', onBook, style, ...rest }) {
  const a = AVAIL[availability] || AVAIL.available;
  const blocked = availability === 'soldout' || availability === 'cancelled';
  const row = layout === 'horizontal';
  return (
    <Card padding={0} interactive={!blocked} style={{ display: row ? 'grid' : 'block', gridTemplateColumns: row ? '260px minmax(0,1fr)' : undefined, ...style }} {...rest}>
      {row ? (
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <Media src={image} ratio="auto" tone="green" caption={title} radius="0" style={{ width: '100%', height: '100%', aspectRatio: 'auto', minHeight: 200 }} />
        </div>
      ) : (
        <Media src={image} ratio="16 / 9" tone="green" caption={title} radius="0" />
      )}
      <div style={{ display: 'grid', gap: 'var(--space-3)', padding: 'var(--space-5)', alignContent: 'start' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <StatusBadge tone={a.tone} size="sm">{a.label}</StatusBadge>
          {free && <StatusBadge tone="info" size="sm" icon="gift">Free</StatusBadge>}
        </div>
        <h3 style={{ font: 'var(--type-h3)' }}>{title}</h3>
        {description && <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{description}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-5)' }}>
          {date && <Meta icon="calendar-days">{date}</Meta>}
          {time && <Meta icon="clock">{time}</Meta>}
          {location && <Meta icon="map-pin">{location}</Meta>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', marginTop: 'var(--space-1)' }}>
          <span style={{ font: 'var(--weight-semibold) var(--text-md)/1 var(--font-body)', color: 'var(--text-heading)' }}>
            {free ? 'Free entry' : price}
          </span>
          <Button variant={blocked ? 'secondary' : 'primary'} size="sm" disabled={blocked} onClick={onBook} as={blocked ? 'button' : 'a'} href={blocked ? undefined : href}>
            {availability === 'cancelled' ? 'Event cancelled' : availability === 'soldout' ? 'Join waiting list' : free ? 'Reserve a place' : 'Book tickets'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
