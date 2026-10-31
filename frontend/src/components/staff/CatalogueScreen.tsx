'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Alert } from '@/components/feedback/Alert';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Modal } from '@/components/feedback/Modal';
import { Button } from '@/components/forms/Button';
import { SearchField } from '@/components/forms/SearchField';
import { Select } from '@/components/forms/Select';
import { Media } from '@/components/foundation/Media';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Pagination } from '@/components/navigation/Pagination';
import { Tabs } from '@/components/navigation/Tabs';
import {
  catalogueStatus,
  type CatalogueRecord,
  type CatalogueResource,
} from '@/lib/api/staff-catalogue';
import { useStaffSession } from '@/lib/staff/session';
import { date, money } from '@/lib/staff/format';
import {
  Loading,
  PageHeading,
  Panel,
  RequestError,
  Status,
  staffDataChanged,
  useStaffData,
} from './Shared';
import { CatalogueEditor } from './CatalogueEditor';
import { StaffUnavailable } from './Unavailable';

export const CATALOGUE_TITLES = {
  collections: 'Collections',
  events: 'Events & exhibitions',
  categories: 'Categories',
};
const SINGULAR = { collections: 'collection', events: 'event', categories: 'category' };

export function CatalogueScreen({
  resource,
  segments,
  saved,
}: {
  resource: CatalogueResource;
  segments: string[];
  saved: boolean;
}) {
  if (resource === 'categories' && (segments[0] === 'new' || segments[1] === 'edit'))
    return <StaffUnavailable title="Category editing" />;
  if (!segments.length) return <CatalogueList key={resource} resource={resource} />;
  return (
    <CatalogueRecordScreen
      key={`${resource}/${segments.join('/')}`}
      resource={resource}
      segments={segments}
      saved={saved}
    />
  );
}

function CatalogueList({ resource }: { resource: CatalogueResource }) {
  const { catalogue } = useStaffSession();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const queryKey = params.toString();
  const querySearch = params.get('q') ?? '';
  const [search, setSearch] = useState(querySearch);
  const page = Math.max(1, Math.floor(Number(params.get('page')) || 1));
  const result = useStaffData(
    (signal) =>
      catalogue.list(
        resource,
        {
          q: querySearch,
          page,
          featured: params.get('featured') ?? '',
          status: params.get('status') ?? '',
          when: params.get('tab') ?? 'all',
        },
        signal,
      ),
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
      router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false });
    },
    [queryKey, pathname, router],
  );
  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);
  useEffect(() => {
    if (search === querySearch) return;
    const timer = setTimeout(() => update({ q: search }), 250);
    return () => clearTimeout(timer);
  }, [search, querySearch, update]);

  const columns: Column<CatalogueRecord>[] = [
    {
      key: 'name',
      header: resource === 'events' ? 'Event' : 'Name',
      render: (r) => (
        <Link
          className="type-label text-heading no-underline hover:text-link"
          href={`/staff/${resource}/${r.id}`}
        >
          {r.name}
        </Link>
      ),
    },
  ];
  if (resource === 'categories') columns.push({ key: 'description', header: 'Description' });
  else
    columns.push(
      {
        key: 'categories',
        header: 'Categories',
        render: (r) => r.categories.map((c) => c.name).join(', ') || '—',
      },
      { key: 'location', header: 'Location', render: (r) => r.location || 'Unassigned' },
    );
  if (resource === 'events')
    columns.push(
      {
        key: 'startAt',
        header: 'Dates',
        render: (r) => (
          <span className="whitespace-nowrap">
            {date(r.startAt)}
            <br />
            {date(r.endAt)}
          </span>
        ),
      },
      { key: 'price', header: 'Price', render: (r) => money(r.price!) },
      { key: 'capacity', header: 'Capacity', align: 'right' },
    );
  if (resource === 'collections')
    columns.push({
      key: 'featured',
      header: 'Featured',
      render: (r) => (r.featured ? 'Yes' : 'No'),
    });
  columns.push(
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Status value={catalogueStatus(r.status)} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <Link href={`/staff/${resource}/${r.id}`} className="inline-flex min-h-11 items-center">
          View
        </Link>
      ),
    },
  );
  const total = result.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / 10));
  return (
    <>
      <PageHeading
        title={CATALOGUE_TITLES[resource]}
        description={
          resource === 'categories'
            ? 'Shared categories used across the museum catalogue.'
            : resource === 'collections'
              ? 'Organise the collections and prepare their public pages.'
              : 'Plan the programme and keep event information up to date.'
        }
      >
        {resource !== 'categories' && (
          <Button as="a" href={`/staff/${resource}/new`} iconLeft="plus">
            Add {SINGULAR[resource]}
          </Button>
        )}
      </PageHeading>
      <Panel>
        {resource === 'events' && (
          <Tabs
            className="mb-5"
            items={[
              { value: '', label: 'All events' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past events' },
            ]}
            value={params.get('tab') ?? ''}
            onChange={(tab) => update({ tab })}
          />
        )}
        <div className="mb-5 flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1">
            <label htmlFor="catalogue-search" className="sr-only">
              Search {CATALOGUE_TITLES[resource].toLowerCase()}
            </label>
            <SearchField
              id="catalogue-search"
              placeholder={`Search ${resource}…`}
              maxLength={100}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
          {resource !== 'collections' && (
            <label className="grid gap-1 text-xs text-muted">
              Status
              <Select
                aria-label="Filter by status"
                placeholder="All statuses"
                value={params.get('status') ?? ''}
                options={
                  resource === 'events'
                    ? [
                        { value: 'draft', label: 'Draft' },
                        { value: 'scheduled', label: 'Published' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ]
                    : [
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                      ]
                }
                onChange={(e) => update({ status: e.target.value })}
              />
            </label>
          )}
          {resource === 'collections' && (
            <label className="grid gap-1 text-xs text-muted">
              Home page
              <Select
                aria-label="Filter featured collections"
                placeholder="All collections"
                value={params.get('featured') ?? ''}
                options={[
                  { value: 'true', label: 'Featured' },
                  { value: 'false', label: 'Not featured' },
                ]}
                onChange={(e) => update({ featured: e.target.value })}
              />
            </label>
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
              {total} records
            </p>
            <DataTable
              rows={result.data?.items ?? []}
              columns={columns}
              empty={
                <EmptyState
                  title="No matching records"
                  description="Try another search or clear the filters."
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
              page={page}
              pages={Math.max(page, pages)}
              onChange={(next) => update({ page: String(next) })}
            />
            {page > pages && (
              <Button variant="ghost" onClick={() => update({ page: String(pages) })}>
                Return to the last page
              </Button>
            )}
          </>
        )}
      </Panel>
    </>
  );
}

function CatalogueRecordScreen({
  resource,
  segments,
  saved,
}: {
  resource: CatalogueResource;
  segments: string[];
  saved: boolean;
}) {
  const { catalogue } = useStaffSession();
  const id = segments[0]!;
  const creating = id === 'new';
  const editing = creating || segments[1] === 'edit';
  const result = useStaffData(
    (signal) => (creating ? Promise.resolve(undefined) : catalogue.get(resource, id, signal)),
    [resource, id],
  );
  if (result.error) return <RequestError error={result.error} retry={result.refresh} />;
  if (result.loading) return <Loading />;
  if (editing && resource !== 'categories') {
    if (result.data && ['archived', 'cancelled'].includes(result.data.status))
      return (
        <Alert tone="info" title="This record is read only">
          <Link href={`/staff/${resource}/${id}`}>View the record</Link> to see its current details.
        </Alert>
      );
    return <CatalogueEditor resource={resource} record={result.data} />;
  }
  if (!result.data) return null;
  return (
    <CatalogueDetail
      resource={resource}
      record={result.data}
      saved={saved}
      refresh={result.refresh}
    />
  );
}

function CatalogueDetail({
  resource,
  record,
  saved,
  refresh,
}: {
  resource: CatalogueResource;
  record: CatalogueRecord;
  saved: boolean;
  refresh: () => void;
}) {
  const { catalogue } = useStaffSession();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const editable = resource !== 'categories' && !['archived', 'cancelled'].includes(record.status);
  const details = [
    ['Description', record.description || '—'],
    ...(resource === 'categories'
      ? []
      : [
          ['Categories', record.categories.map((c) => c.name).join(', ') || '—'],
          ['Location', record.location || 'Unassigned'],
        ]),
    ...(resource === 'collections'
      ? [['Featured on the home page', record.featured ? 'Yes' : 'No']]
      : []),
    ...(resource === 'events'
      ? [
          ['Starts', date(record.startAt, true)],
          ['Ends', date(record.endAt, true)],
          ['General admission', money(record.price!)],
          ['Capacity', String(record.capacity)],
        ]
      : []),
  ];
  async function confirm() {
    if (resource === 'categories') return;
    setBusy(true);
    setError('');
    try {
      await catalogue.action(resource, record.id);
      setConfirming(false);
      staffDataChanged();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this record.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Link className="text-sm" href={`/staff/${resource}`}>
        Back to {CATALOGUE_TITLES[resource].toLowerCase()}
      </Link>
      <PageHeading title={record.name} description={CATALOGUE_TITLES[resource]}>
        {editable && (
          <>
            <Button as="a" href={`/staff/${resource}/${record.id}/edit`} iconLeft="pencil">
              Edit {SINGULAR[resource]}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setError('');
                setConfirming(true);
              }}
            >
              {resource === 'collections' ? 'Archive' : 'Cancel event'}
            </Button>
          </>
        )}
      </PageHeading>
      {saved && (
        <Alert tone="success" title="Changes saved">
          The {SINGULAR[resource]} has been updated.
        </Alert>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel title="Record details">
          <dl className="grid gap-5 md:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className={label === 'Description' ? 'md:col-span-2' : ''}>
                <dt className="type-eyebrow tracking-wide text-muted uppercase">{label}</dt>
                <dd className="mt-1.5 whitespace-pre-wrap break-words text-heading">{value}</dd>
              </div>
            ))}
            {record.collections.length > 0 && (
              <div className="md:col-span-2">
                <dt className="type-eyebrow tracking-wide text-muted uppercase">
                  Linked collections
                </dt>
                <dd className="mt-1.5 grid gap-2">
                  {record.collections.map((c) => (
                    <Link key={c.id} href={`/staff/collections/${c.id}`}>
                      {c.name}
                    </Link>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </Panel>
        <div className="grid gap-5">
          <Panel title="Status">
            <Status value={catalogueStatus(record.status)} />
          </Panel>
          {record.images.length > 0 && (
            <Panel title="Images">
              <div className="grid gap-4">
                {record.images.map((image, index) => (
                  <div key={image.id}>
                    <Media src={image.url} alt={image.alt || record.name} ratio="4 / 3" />
                    {index === 0 && <p className="mt-2 text-xs text-muted">Primary image</p>}
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
      <Modal
        open={confirming}
        title={resource === 'collections' ? 'Archive collection?' : 'Cancel event?'}
        onClose={() => {
          if (!busy) setConfirming(false);
        }}
      >
        <div className="grid gap-5">
          <p>
            {resource === 'collections'
              ? 'This collection will be hidden from the public site. Its record will be preserved.'
              : 'This event will be marked as cancelled. Existing bookings, refunds and visitor notifications need to be handled separately.'}
          </p>
          {error && <Alert tone="danger">{error}</Alert>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" disabled={busy} onClick={() => setConfirming(false)}>
              Keep record
            </Button>
            <Button variant="danger" loading={busy} onClick={() => void confirm()}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
