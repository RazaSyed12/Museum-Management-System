'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { Media } from '@/components/foundation/Media';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useStaffSession } from '@/lib/staff/session';
import { date } from '@/lib/staff/format';
import { Loading, PageHeading, Panel, RequestError, useStaffData } from './Shared';

export function CatalogueDashboard() {
  const { catalogue } = useStaffSession();
  const result = useStaffData(async (signal) => {
    const [collections, events, categories] = await Promise.all([
      catalogue.list('collections', { pageSize: 1 }, signal),
      catalogue.list('events', { pageSize: 1 }, signal),
      catalogue.list('categories', { pageSize: 1 }, signal),
    ]);
    return [
      { id: 'collections', label: 'Collections', count: collections.total, icon: 'library-big' },
      { id: 'events', label: 'Events & exhibitions', count: events.total, icon: 'calendar-days' },
      { id: 'categories', label: 'Categories', count: categories.total, icon: 'tags' },
    ];
  });
  const upcoming = useStaffData((signal) =>
    catalogue.list(
      'events',
      {
        when: 'upcoming',
        status: 'scheduled',
        pageSize: 4,
      },
      signal,
    ),
  );
  const refreshCounts = result.refresh;
  const refreshEvents = upcoming.refresh;
  useEffect(() => {
    const timer = setInterval(() => {
      refreshCounts();
      refreshEvents();
    }, 60000);
    return () => clearInterval(timer);
  }, [refreshCounts, refreshEvents]);
  return (
    <>
      <PageHeading
        title="Dashboard"
        description="A view of the museum catalogue and upcoming programme."
      >
        <Button as="a" href="/staff/events/new" iconLeft="plus">
          Create an event
        </Button>
      </PageHeading>
      {result.error ? (
        <RequestError error={result.error} retry={result.refresh} />
      ) : !result.data ? (
        <Loading />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {result.data.map((metric) => (
            <Panel key={metric.id}>
              <Icon name={metric.icon} size={22} className="text-olive-600" />
              <p className="mt-5 font-display text-4xl text-heading">
                {metric.count.toLocaleString('en-AU')}
              </p>
              <Link
                className="type-label mt-2 inline-block text-heading"
                href={`/staff/${metric.id}`}
              >
                {metric.label}
              </Link>
              <p className="mt-3 text-xs text-muted">
                All catalogue records, including drafts and inactive records where applicable.
              </p>
            </Panel>
          ))}
        </div>
      )}
      <Panel
        title="Upcoming events"
        action={
          <Link href="/staff/events?tab=upcoming" className="text-sm">
            View all
          </Link>
        }
      >
        {upcoming.error ? (
          <RequestError error={upcoming.error} retry={upcoming.refresh} />
        ) : upcoming.loading ? (
          <Loading />
        ) : upcoming.data?.items.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {upcoming.data.items.map((event) => (
              <Link
                key={event.id}
                href={`/staff/events/${event.id}`}
                className="flex gap-4 text-body no-underline"
              >
                <Media
                  src={event.images[0]?.url}
                  alt={event.images[0]?.alt || event.name}
                  tone="green"
                  ratio="1 / 1"
                  className="w-20 flex-none"
                  caption="Event image"
                />
                <div className="grid flex-1 gap-2">
                  <span className="type-label text-heading">{event.name}</span>
                  <span className="text-xs text-muted">
                    {date(event.startAt)} – {date(event.endAt)}
                  </span>
                  <span className="text-sm text-muted">Capacity: {event.capacity}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming events"
            description="Create an event to begin the programme."
          />
        )}
      </Panel>
      <Panel title="Around the museum">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['Add a collection', '/staff/collections/new', 'library-big'],
            ['View categories', '/staff/categories', 'tags'],
            ['Create an event', '/staff/events/new', 'calendar-plus'],
          ].map(([label, href, icon]) => (
            <Link
              key={href}
              href={href!}
              className="flex min-h-20 items-center gap-3 rounded-md border border-line-subtle bg-surface-sunken p-4 text-heading no-underline transition-control hover:border-olive-300"
            >
              <Icon name={icon!} size={22} className="text-olive-600" />
              <span className="type-label">{label}</span>
            </Link>
          ))}
        </div>
      </Panel>
      <p className="text-sm text-muted">
        Visitor, booking and membership summaries are not available yet.
      </p>
    </>
  );
}
