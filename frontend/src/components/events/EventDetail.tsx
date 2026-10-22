'use client';

import { useState } from 'react';
import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Alert } from '@/components/feedback/Alert';
import { Icon } from '@/components/foundation/Icon';
import { DetailHero, MetaItem } from '@/components/layout/DetailHero';
import { Container } from '@/components/layout/Container';
import { useSiteNav } from '@/lib/nav';
import type { MuseumEvent, EventAvailability } from '@/lib/api/events';

const BADGE: Record<EventAvailability, { tone: 'success' | 'warning' | 'danger'; label: string }> =
  {
    available: { tone: 'success', label: 'Tickets available' },
    limited: { tone: 'warning', label: 'Limited' },
    soldout: { tone: 'danger', label: 'Sold out' },
    cancelled: { tone: 'danger', label: 'Cancelled' },
  };

export interface EventDetailProps {
  event: MuseumEvent;
}

export function EventDetail({ event: e }: EventDetailProps) {
  const nav = useSiteNav();
  const [waitlisted, setWaitlisted] = useState(false);
  const cancelled = e.availability === 'cancelled';
  const soldout = e.availability === 'soldout';
  const badge = BADGE[e.availability];

  return (
    <>
      <DetailHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: "What's on", href: '/events' },
          { label: e.title },
        ]}
        title={e.title}
        eyebrow={
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={badge.tone} size="sm">
              {e.availability === 'limited' ? `Limited — ${e.remaining} left` : badge.label}
            </StatusBadge>
            {e.free && (
              <StatusBadge tone="info" size="sm" icon="gift">
                Free
              </StatusBadge>
            )}
            {nav.isMember && !cancelled && e.memberPrice != null && (
              <StatusBadge tone="member" size="sm">
                Member price £{e.memberPrice}
              </StatusBadge>
            )}
          </div>
        }
        description={e.description}
        meta={
          <>
            <MetaItem icon="calendar-days">{e.date}</MetaItem>
            <MetaItem icon="clock">{e.time}</MetaItem>
            <MetaItem icon="map-pin">{e.location}</MetaItem>
            <MetaItem icon="banknote">{e.free ? 'Free' : e.price}</MetaItem>
          </>
        }
      />

      <Container className="py-8 md:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6">
            {cancelled && (
              <Alert tone="danger" title="This event has been cancelled">
                Everyone who booked has been refunded in full and emailed. Nothing further is needed
                from you.
              </Alert>
            )}
            {soldout && (
              <Alert tone="warning" title="This event is sold out">
                Join the waiting list and we&rsquo;ll email you if a place is returned.
              </Alert>
            )}
            <div className="grid gap-4">
              <h2 className="type-h2">About this event</h2>
              <p className="type-body">{e.description}</p>
              <p className="type-body">
                Doors open thirty minutes before the start. The bar in the Great Hall stays open
                until close, and the exhibition galleries remain accessible throughout.
              </p>
            </div>
          </div>

          <aside className="sticky top-25 grid gap-4 self-start rounded-lg border border-line-subtle bg-surface-card p-6 shadow-sm">
            <span className="type-eyebrow tracking-wider text-muted uppercase">Tickets</span>
            <span className="font-display text-3xl/none text-heading">
              {e.free ? 'Free' : `£${e.priceValue}`}
            </span>
            {!e.free && e.memberPrice != null && (
              <span className="type-body-sm text-gold-700">Members £{e.memberPrice}</span>
            )}
            <div className="grid gap-2 border-y border-line-subtle py-4">
              <MetaItem icon="calendar-days">{e.date}</MetaItem>
              <MetaItem icon="clock">{e.time}</MetaItem>
              <MetaItem icon="map-pin">{e.location}</MetaItem>
              <MetaItem icon="users">
                {e.remaining} of {e.capacity} places left
              </MetaItem>
            </div>
            {cancelled ? (
              <Button disabled fullWidth>
                Event cancelled
              </Button>
            ) : soldout ? (
              waitlisted ? (
                <Alert tone="success" title="You&rsquo;re on the waiting list">
                  We&rsquo;ll email you if a place is returned.
                </Alert>
              ) : (
                <>
                  <Button variant="secondary" fullWidth onClick={() => setWaitlisted(true)}>
                    Join the waiting list
                  </Button>
                  <span className="type-body-sm text-muted">
                    We release returns 48 hours before.
                  </span>
                </>
              )
            ) : (
              <>
                <Button fullWidth size="lg" as="a" href={`/tickets/${e.id}`}>
                  {e.free ? 'Reserve a place' : 'Book tickets'}
                </Button>
                {nav.isMember && (
                  <span className="flex items-center gap-1.5 text-gold-700 type-body-sm">
                    <Icon name="award" size={15} />
                    Your member price is applied at checkout
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
