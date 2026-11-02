'use client';

import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Alert } from '@/components/feedback/Alert';
import { Icon } from '@/components/foundation/Icon';
import { DetailHero, MetaItem } from '@/components/layout/DetailHero';
import { Container } from '@/components/layout/Container';
import { useSiteNav } from '@/lib/nav';
import { useCurrency } from '@/lib/useCurrency';
import type { MuseumEvent, EventAvailability } from '@/lib/api/events';

const BADGE: Record<EventAvailability, { tone: 'success' | 'warning' | 'danger'; label: string }> = {
  available: { tone: 'success', label: 'Tickets available' },
  limited: { tone: 'warning', label: 'Limited' },
  soldout: { tone: 'danger', label: 'Sold out' },
  cancelled: { tone: 'danger', label: 'Cancelled' },
  completed: { tone: 'warning', label: 'Booking closed' },
  notonsale: { tone: 'warning', label: 'Not on sale' },
};

export interface EventDetailProps {
  event: MuseumEvent;
}

export function EventDetail({ event: e }: EventDetailProps) {
  const nav = useSiteNav();
  const { format } = useCurrency();
  const cancelled = e.availability === 'cancelled';
  const soldout = e.availability === 'soldout';
  const blocked = e.availability !== 'available' && e.availability !== 'limited';
  const badge = BADGE[e.availability];
  const priceLabel = e.memberPrice != null ? `${format(e.priceValue)} · ${format(e.memberPrice)} members` : format(e.priceValue);

  return (
    <>
      <DetailHero
        crumbs={[{ label: 'Home', href: '/' }, { label: "What's on", href: '/events' }, { label: e.title }]}
        title={e.title}
        image={e.image}
        eyebrow={
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={badge.tone} size="sm">{e.availability === 'limited' ? `Limited — ${e.remaining} left` : badge.label}</StatusBadge>
            {e.free && <StatusBadge tone="info" size="sm" icon="gift">Free</StatusBadge>}
            {nav.isMember && !cancelled && e.memberPrice != null && (
              <StatusBadge tone="member" size="sm">Member price {format(e.memberPrice)}</StatusBadge>
            )}
          </div>
        }
        description={e.description}
        meta={
          <>
            <MetaItem icon="calendar-days">{e.date}</MetaItem>
            <MetaItem icon="clock">{e.time}</MetaItem>
            <MetaItem icon="map-pin">{e.location}</MetaItem>
            <MetaItem icon="banknote">{e.free ? 'Free' : priceLabel}</MetaItem>
          </>
        }
      />

      <Container className="py-8 md:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6">
            {cancelled && (
              <Alert tone="danger" title="This event has been cancelled">
                Everyone who booked has been refunded in full and emailed. Nothing further is needed from you.
              </Alert>
            )}
            {soldout && (
              <Alert tone="warning" title="This event is sold out">
                Please check back for returned tickets.
              </Alert>
            )}
            <div className="grid gap-4">
              <h2 className="type-h2">About this event</h2>
              <p className="type-body">{e.description}</p>
              <p className="type-body">
                Doors open thirty minutes before the start. The bar in the Great Hall stays open until close, and the exhibition galleries remain accessible throughout.
              </p>
            </div>
          </div>

          <aside className="sticky top-25 grid gap-4 self-start rounded-lg border border-line-subtle bg-surface-card p-6 shadow-sm">
            <span className="type-eyebrow tracking-wider text-muted uppercase">Tickets</span>
            <span className="font-display text-3xl/none text-heading">{e.free ? 'Free' : format(e.priceValue)}</span>
            {!e.free && e.memberPrice != null && <span className="type-body-sm text-gold-700">Members {format(e.memberPrice)}</span>}
            <div className="grid gap-2 border-y border-line-subtle py-4">
              <MetaItem icon="calendar-days">{e.date}</MetaItem>
              <MetaItem icon="clock">{e.time}</MetaItem>
              <MetaItem icon="map-pin">{e.location}</MetaItem>
              <MetaItem icon="users">{e.remaining} of {e.capacity} places left</MetaItem>
            </div>
            {blocked ? (
              <Button disabled fullWidth>{badge.label}</Button>
            ) : (
              <>
                <Button fullWidth size="lg" as="a" href={`/tickets/${e.id}`}>{e.free ? 'Reserve a place' : 'Book tickets'}</Button>
                {nav.isMember && (
                  <span className="flex items-center gap-1.5 text-gold-700 type-body-sm">
                    <Icon name="award" size={15} />Your member price is applied at checkout
                  </span>
                )}
              </>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
