'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Icon } from '@/components/foundation/Icon';
import { Button } from '@/components/forms/Button';
import { DataTable } from '@/components/data/DataTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Media } from '@/components/foundation/Media';
import { staffApi } from '@/lib/api/staff';
import { date, localDay } from '@/lib/staff/format';
import { staffUsesBackend } from '@/lib/staff/config';
import { CatalogueDashboard } from './CatalogueDashboard';
import {
  Capacity,
  Loading,
  PageHeading,
  Panel,
  RequestError,
  Status,
  useStaffData,
} from './Shared';

export function DashboardScreen() {
  return staffUsesBackend() ? <CatalogueDashboard /> : <DemoDashboardScreen />;
}

function DemoDashboardScreen() {
  const { data, loading, error, refresh } = useStaffData((signal) => staffApi.dashboard(signal));
  useEffect(() => {
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, [refresh]);
  if (error) return <RequestError error={error} retry={refresh} />;
  if (loading && !data) return <Loading />;
  if (!data) return null;
  const rows = data.bookings.map((b) => ({
    ...b,
    visitor: data.references.visitors.find((v) => v.id === b.visitorId)?.name ?? 'Visitor',
    event: data.references.events.find((e) => e.id === b.eventId)?.title ?? 'Event',
  }));
  return (
    <>
      <PageHeading
        title="Dashboard"
        description={`A view of the museum, ${date(localDay())}. All times are in Adelaide.`}
      >
        <Button as="a" href="/staff/bookings/new" iconLeft="plus">
          New booking
        </Button>
      </PageHeading>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <Panel
            key={metric.label}
            className={
              ['border-info-100', 'border-success-100', 'border-sand-200', 'border-olive-100'][
                index
              ]
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-olive-50 text-olive-600">
                <Icon name={metric.icon} size={22} />
              </span>
              <span className="type-eyebrow text-muted">
                {index === 2 ? 'Current' : index === 3 ? 'Programme' : 'This month'}
              </span>
            </div>
            <p className="mt-5 font-display text-4xl text-heading">
              {metric.value.toLocaleString('en-AU')}
            </p>
            <p className="type-label mt-1 text-heading">{metric.label}</p>
            <p className="mt-3 text-xs text-muted">
              {index === 3
                ? 'Published events, including ongoing exhibitions'
                : index === 2
                  ? `${metric.previous} active at the start of this month`
                  : metric.previous
                    ? `${Math.round(((metric.value - metric.previous) / metric.previous) * 100)}% compared with last month`
                    : 'No activity recorded in the previous month'}
            </p>
          </Panel>
        ))}
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Recent bookings"
          action={
            <Link href="/staff/bookings" className="text-sm">
              View all
            </Link>
          }
        >
          <DataTable
            rows={rows}
            columns={[
              {
                key: 'visitor',
                header: 'Visitor',
                render: (r) => <Link href={`/staff/bookings/${r.id}`}>{r.visitor}</Link>,
              },
              { key: 'event', header: 'Event' },
              { key: 'quantity', header: 'Tickets', align: 'right' },
              {
                key: 'visitDate',
                header: 'Visit date',
                render: (r) => date(r.visitDate),
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => <Status value={r.status} />,
              },
            ]}
            empty={
              <EmptyState
                title="No bookings yet"
                description="Bookings will appear here when they are created."
              />
            }
          />
        </Panel>
        <Panel
          title="Upcoming events"
          action={
            <Link href="/staff/events" className="text-sm">
              View all
            </Link>
          }
        >
          <div className="grid gap-5">
            {data.events.length ? (
              data.events.map((event) => (
                <Link
                  key={event.id}
                  href={`/staff/events/${event.id}`}
                  className="flex gap-4 text-body no-underline"
                >
                  <Media
                    src={event.images[0]?.url}
                    alt={event.images[0]?.alt || event.title}
                    tone="green"
                    ratio="1 / 1"
                    className="w-20 flex-none"
                    caption="Event image"
                  />
                  <div className="grid flex-1 gap-2">
                    <span className="type-label text-heading">{event.title}</span>
                    <span className="text-xs text-muted">
                      {date(event.startAt)} – {date(event.endAt)}
                    </span>
                    <Capacity booked={event.booked} capacity={event.capacity} />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">
                No upcoming events. Create one to begin the programme.
              </p>
            )}
          </div>
        </Panel>
      </div>
      <Panel title="Around the museum">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ['Record a visit', '/staff/visits/new', 'scan-line'],
            ['Add a member', '/staff/memberships/new', 'award'],
            ['Add an artefact', '/staff/items/new', 'gem'],
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
    </>
  );
}
