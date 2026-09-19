import type { HTMLAttributes, ReactNode } from 'react';
import { Card } from './Card';
import { Media } from '@/components/foundation/Media';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Icon } from '@/components/foundation/Icon';
import { Button } from '@/components/forms/Button';
import { cn } from '@/lib/cn';

/* Ported from design-system/components/cards/EventCard.jsx + EventCard.d.ts. */
type Availability = 'available' | 'limited' | 'soldout' | 'cancelled';

export interface EventCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  /** Display price string, e.g. "£14 · £10 members". Ignored when free. */
  price?: string;
  free?: boolean;
  /** Drives the badge and the CTA. cancelled/soldout never render a bookable primary button. */
  availability?: Availability;
  image?: string;
  /** horizontal is the events-listing row on desktop; vertical is the home grid. */
  layout?: 'vertical' | 'horizontal';
  href?: string;
  onBook?: () => void;
}

const AVAIL: Record<Availability, { tone: 'success' | 'warning' | 'danger'; label: string }> = {
  available: { tone: 'success', label: 'Tickets available' },
  limited: { tone: 'warning', label: 'Limited availability' },
  soldout: { tone: 'danger', label: 'Sold out' },
  cancelled: { tone: 'danger', label: 'Cancelled' },
};

function Meta({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="type-body-sm inline-flex items-center gap-1.5 text-body">
      <Icon name={icon} size={15} className="text-olive-500" />
      {children}
    </span>
  );
}

export function EventCard({ title, description, date, time, location, price, free, availability = 'available', image, layout = 'vertical', href = '#', onBook, className, ...rest }: EventCardProps) {
  const a = AVAIL[availability];
  const blocked = availability === 'soldout' || availability === 'cancelled';
  const row = layout === 'horizontal';
  return (
    <Card interactive={!blocked} className={cn('p-0', row ? 'grid grid-cols-[260px_minmax(0,1fr)]' : 'block', className)} {...rest}>
      {row ? (
        <div className="min-w-0 overflow-hidden">
          <Media src={image} ratio="auto" tone="green" caption={title} className="h-full min-h-50 w-full rounded-none" />
        </div>
      ) : (
        <Media src={image} ratio="16 / 9" tone="green" caption={title} className="rounded-none" />
      )}
      <div className="grid content-start gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={a.tone} size="sm">{a.label}</StatusBadge>
          {free && <StatusBadge tone="info" size="sm" icon="gift">Free</StatusBadge>}
        </div>
        <h3 className="type-h3">{title}</h3>
        {description && <p className="type-body-sm text-muted">{description}</p>}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {date && <Meta icon="calendar-days">{date}</Meta>}
          {time && <Meta icon="clock">{time}</Meta>}
          {location && <Meta icon="map-pin">{location}</Meta>}
        </div>
        <div className="mt-1 flex items-center justify-between gap-4">
          <span className="font-body text-md leading-none font-semibold text-heading">
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
