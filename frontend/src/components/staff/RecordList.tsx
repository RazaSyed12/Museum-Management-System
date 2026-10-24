'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DataTable, type Column } from '@/components/data/DataTable';
import { SearchField } from '@/components/forms/SearchField';
import { Select } from '@/components/forms/Select';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/forms/Button';
import { Tabs } from '@/components/navigation/Tabs';
import { Pagination } from '@/components/navigation/Pagination';
import { EmptyState } from '@/components/feedback/EmptyState';
import { staffApi } from '@/lib/api/staff';
import { date, membershipStatus, money } from '@/lib/staff/format';
import type { ListQuery, References, Resource, StaffResources } from '@/lib/staff/types';
import {
  Capacity,
  Loading,
  PageHeading,
  Panel,
  RequestError,
  Status,
  useStaffData,
} from './Shared';
import { RECORDS } from './records';
import { PermissionMatrix } from './PermissionMatrix';

type DisplayRow = Record<string, unknown> & {
  id: string;
  label: string;
  status: string;
  original: StaffResources[Resource];
};

export function displayRow(
  resource: Resource,
  original: StaffResources[Resource],
  refs: References,
): DisplayRow {
  const raw = original as unknown as Record<string, unknown>;
  const visitor = refs.visitors.find((v) => v.id === raw.visitorId);
  const event = refs.events.find((e) => e.id === raw.eventId);
  return {
    ...raw,
    id: original.id,
    label: String(raw.name ?? raw.title ?? visitor?.name ?? original.id),
    status:
      resource === 'memberships'
        ? membershipStatus(original as StaffResources['memberships'])
        : String(raw.status ?? ''),
    visitor: visitor?.name ?? 'Walk-in',
    email: raw.email ?? visitor?.email ?? '',
    event: event?.title ?? '—',
    category: refs.categories.find((c) => c.id === raw.categoryId)?.name ?? '—',
    collection: refs.collections.find((c) => c.id === raw.collectionId)?.name ?? '—',
    original,
  };
}

export function RecordList({ resource }: { resource: Resource }) {
  const definition = RECORDS[resource];
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const queryKey = params.toString();
  const [search, setSearch] = useState(params.get('q') ?? '');
  const [tab, setTab] = useState('accounts');
  const query: ListQuery = Object.fromEntries(params.entries());
  query.page = Math.max(1, Number(params.get('page')) || 1);
  query.pageSize = 10;
  const result = useStaffData(
    async (signal) => {
      const [records, refs] = await Promise.all([
        staffApi.list(resource, query, signal),
        staffApi.references(),
      ]);
      return { records, refs };
    },
    [resource, queryKey],
  );

  const update = useCallback(
    (values: Record<string, string>) => {
      const next = new URLSearchParams(queryKey);
      next.delete('page');
      for (const [key, value] of Object.entries(values)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      router.replace(`${pathname}${next.size ? `?${next}` : ''}`, {
        scroll: false,
      });
    },
    [queryKey, pathname, router],
  );
  const querySearch = params.get('q') ?? '';
  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);
  useEffect(() => {
    if (search === querySearch) return;
    const timer = setTimeout(() => update({ q: search }), 250);
    return () => clearTimeout(timer);
  }, [search, querySearch, update]);
  const refs = result.data?.refs;
  const rows =
    result.data?.records.items.map((row) => displayRow(resource, row, result.data!.refs)) ?? [];
  const columns: Column<DisplayRow>[] = [
    {
      key: 'label',
      header:
        resource === 'bookings'
          ? 'Booking / visitor'
          : resource === 'memberships'
            ? 'Member'
            : resource === 'visits'
              ? 'Visitor'
              : 'name',
      sortable: resource !== 'bookings',
      render: (row) => (
        <Link
          href={`/staff/${resource}/${row.id}`}
          className="type-label text-heading no-underline hover:text-link"
        >
          <span className="block">{resource === 'bookings' ? row.id : row.label}</span>
          {resource === 'bookings' && (
            <span className="type-body-sm mt-1 block text-muted">{String(row.visitor)}</span>
          )}
        </Link>
      ),
    },
  ];
  const add = (
    key: string,
    header: string,
    render?: Column<DisplayRow>['render'],
    align?: 'right',
  ) =>
    columns.push({
      key,
      header,
      sortable: !['actions', 'capacity'].includes(key),
      render,
      align,
    });
  if (resource === 'events') {
    add('startAt', 'Dates', (r) => (
      <span className="whitespace-nowrap">
        {date(String(r.startAt))}
        <br />
        <span className="text-muted">{date(String(r.endAt))}</span>
      </span>
    ));
    add('type', 'Type');
    add('price', 'Price', (r) => money(Number(r.price)));
    add('capacity', 'Places', (r) => (
      <Capacity booked={Number(r.booked)} capacity={Number(r.capacity)} />
    ));
  }
  if (resource === 'bookings') {
    add('event', 'Event');
    add('quantity', 'Tickets', undefined, 'right');
    add('total', 'Total', (r) => money(Number(r.total)));
    add('visitDate', 'Visit date', (r) => date(String(r.visitDate)));
    add('createdAt', 'Booked', (r) => date(String(r.createdAt)));
    add('payment', 'Payment', (r) => <Status value={String(r.payment)} />);
  }
  if (resource === 'memberships') {
    add('email', 'Email');
    add('type', 'Plan');
    add('joinDate', 'Joined', (r) => date(String(r.joinDate)));
    add('expiryDate', 'Expires', (r) => date(String(r.expiryDate)));
  }
  if (resource === 'visitors') {
    add('email', 'Email');
    add('phone', 'Phone');
    add('registeredAt', 'Registered', (r) => date(String(r.registeredAt)));
  }
  if (resource === 'visits') {
    add('quantity', 'Visitors', undefined, 'right');
    add('visitedAt', 'Recorded', (r) => date(String(r.visitedAt), true));
    add('bookingId', 'Booking', (r) =>
      r.bookingId ? (
        <Link href={`/staff/bookings/${r.bookingId}`}>{String(r.bookingId)}</Link>
      ) : (
        'Walk-in'
      ),
    );
  }
  if (resource === 'collections' || resource === 'items') {
    add('category', 'Category');
    add('period', 'Period');
    if (resource === 'collections') add('catalogueTotal', 'Catalogue total', undefined, 'right');
    else {
      add('collection', 'Collection');
      add('origin', 'Origin');
    }
  }
  if (resource === 'categories') add('description', 'Description');
  if (resource === 'users') {
    add('email', 'Email');
    add('role', 'Role');
    add('lastLogin', 'Last login', (r) => date(r.lastLogin ? String(r.lastLogin) : null, true));
  }
  if (!['visitors', 'visits'].includes(resource))
    add('status', 'Status', (r) => <Status value={r.status} />);
  add('actions', 'Actions', (r) => (
    <Link href={`/staff/${resource}/${r.id}`} className="inline-flex min-h-11 items-center text-sm">
      View
    </Link>
  ));
  const actualTabs = definition.tabs ?? [];
  const currentTab =
    resource === 'memberships' ? (params.get('status') ?? '') : (params.get('tab') ?? '');
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  return (
    <>
      <PageHeading title={definition.title} description={definition.description}>
        <Button as="a" href={`/staff/${resource}/new`} iconLeft="plus">
          {resource === 'visits' ? 'Record a visit' : `Add ${definition.singular}`}
        </Button>
        {resource === 'visitors' && (
          <Button as="a" variant="secondary" href="/staff/visits">
            Recorded visits
          </Button>
        )}
      </PageHeading>
      {resource === 'users' && (
        <Tabs
          items={[
            { value: 'accounts', label: 'Staff accounts' },
            { value: 'permissions', label: 'Role permissions' },
          ]}
          value={tab}
          onChange={setTab}
        />
      )}
      {resource === 'users' && tab === 'permissions' ? (
        <PermissionMatrix />
      ) : (
        <Panel>
          {actualTabs.length > 0 && (
            <Tabs
              className="mb-5"
              items={actualTabs}
              value={currentTab}
              onChange={(value) =>
                update(resource === 'memberships' ? { status: value } : { tab: value })
              }
            />
          )}
          <div className="mb-5 flex flex-wrap items-end gap-3">
            <div className="min-w-48 flex-1">
              <label htmlFor="record-search" className="sr-only">
                Search {definition.title.toLowerCase()}
              </label>
              <SearchField
                id="record-search"
                placeholder={`Search ${definition.title.toLowerCase()}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
              />
            </div>
            {definition.statuses && (
              <label className="grid gap-1 text-xs text-muted">
                Status
                <Select
                  aria-label="Filter by status"
                  options={definition.statuses}
                  placeholder="All statuses"
                  value={params.get('status') ?? ''}
                  onChange={(e) => update({ status: e.target.value })}
                />
              </label>
            )}
            {resource === 'bookings' && (
              <label className="grid max-w-64 gap-1 text-xs text-muted">
                Event
                <Select
                  aria-label="Filter by event"
                  placeholder="All events"
                  options={refs?.events.map((e) => ({
                    value: e.id,
                    label: e.title,
                  }))}
                  value={params.get('eventId') ?? ''}
                  onChange={(e) => update({ eventId: e.target.value })}
                />
              </label>
            )}
            {['events', 'memberships', 'users'].includes(resource) && (
              <label className="grid gap-1 text-xs text-muted">
                {resource === 'users' ? 'Role' : 'Type'}
                <Select
                  aria-label="Filter by type or role"
                  placeholder="All"
                  options={
                    resource === 'events'
                      ? ['Exhibition', 'Workshop', 'Tour', 'Talk', 'Special event']
                      : resource === 'memberships'
                        ? ['Individual', 'Joint', 'Family']
                        : ['Admin', 'Manager', 'Staff']
                  }
                  value={params.get(resource === 'users' ? 'role' : 'type') ?? ''}
                  onChange={(e) =>
                    update({
                      [resource === 'users' ? 'role' : 'type']: e.target.value,
                    })
                  }
                />
              </label>
            )}
            {['collections', 'items'].includes(resource) && (
              <label className="grid gap-1 text-xs text-muted">
                Category
                <Select
                  aria-label="Filter by category"
                  placeholder="All categories"
                  options={refs?.categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={params.get('categoryId') ?? ''}
                  onChange={(e) => update({ categoryId: e.target.value })}
                />
              </label>
            )}
            {resource === 'items' && (
              <>
                <label className="grid max-w-48 gap-1 text-xs text-muted">
                  Period
                  <Input
                    aria-label="Filter by historical period"
                    value={params.get('period') ?? ''}
                    onChange={(e) => update({ period: e.target.value })}
                  />
                </label>
                <label className="grid max-w-48 gap-1 text-xs text-muted">
                  Origin
                  <Input
                    aria-label="Filter by origin"
                    value={params.get('origin') ?? ''}
                    onChange={(e) => update({ origin: e.target.value })}
                  />
                </label>
              </>
            )}
            {['bookings', 'events', 'visits'].includes(resource) && (
              <>
                <label className="grid gap-1 text-xs text-muted">
                  From
                  <Input
                    aria-label="From date"
                    type="date"
                    max={to || undefined}
                    value={from}
                    onChange={(e) => update({ from: e.target.value })}
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted">
                  To
                  <Input
                    aria-label="To date"
                    type="date"
                    min={from || undefined}
                    value={to}
                    onChange={(e) => update({ to: e.target.value })}
                  />
                </label>
              </>
            )}
            {queryKey && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch('');
                  router.replace(pathname);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
          {result.error ? (
            <RequestError error={result.error} retry={result.refresh} />
          ) : result.loading ? (
            <Loading />
          ) : (
            <>
              <p role="status" className="mb-3 text-sm text-muted">
                {result.data?.records.total ?? 0} records
              </p>
              <DataTable
                rows={rows}
                columns={columns}
                sortKey={
                  ['name', 'title'].includes(params.get('sort') ?? 'name')
                    ? 'label'
                    : (params.get('sort') ?? 'label')
                }
                sortDir={params.get('direction') === 'desc' ? 'desc' : 'asc'}
                onSort={(key) => {
                  const sort = key === 'label' ? (resource === 'events' ? 'title' : 'name') : key;
                  update({
                    sort,
                    direction:
                      (params.get('sort') ?? 'name') === sort && params.get('direction') !== 'desc'
                        ? 'desc'
                        : 'asc',
                  });
                }}
                empty={
                  <EmptyState
                    title="No matching records"
                    description="Try another search or clear the filters. You can also add the first record."
                    action={
                      <Button variant="secondary" onClick={() => router.replace(pathname)}>
                        Clear filters
                      </Button>
                    }
                  />
                }
              />
              <Pagination
                className="mt-5 justify-end"
                page={Number(query.page)}
                pages={Math.max(1, Math.ceil((result.data?.records.total ?? 0) / 10))}
                onChange={(page) => update({ page: String(page) })}
              />
            </>
          )}
        </Panel>
      )}
    </>
  );
}
