'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Grid } from '@/components/layout/Grid';
import { EventCard } from '@/components/cards/EventCard';
import { SkeletonCard } from '@/components/feedback/Skeleton';
import { listEvents, type MuseumEvent } from '@/lib/api/events';

/** Reached from the primary nav and from CTAs with no specific event in
 *  mind (the hero, the membership promo) — a quick picker rather than the
 *  full filtered Events browse, since anyone landing here already wants
 *  to book, not explore. */
export function TicketsPicker() {
  const [events, setEvents] = useState<MuseumEvent[]>();

  useEffect(() => {
    listEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <Container className="py-10 md:py-16">
      <div className="mb-8 grid gap-3">
        <h1 className="text-3xl/[1.1] md:type-h1">Book tickets</h1>
        <p className="type-body max-w-140 text-muted">Choose which event you&rsquo;d like to book, or browse everything that&rsquo;s on.</p>
      </div>
      <Grid cols={3}>
        {!events
          ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
          : events.map((e) => (
              <EventCard key={e.id} title={e.title} description={e.description} date={e.date} time={e.time}
                location={e.location} priceValue={e.priceValue} memberPrice={e.memberPrice} free={e.free} availability={e.availability}
                detailHref={`/events/${e.id}`} href={`/tickets/${e.id}`} />
            ))}
      </Grid>
    </Container>
  );
}
