'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useStaffSession } from '@/lib/staff/session';
import { LIVE_RESOURCES, string, title, type LiveResource } from '@/lib/staff/backend-resources';
import { adelaideInput, adelaideTimestamp } from '@/lib/staff/format';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Field } from '@/components/forms/Field';
import { Alert } from '@/components/feedback/Alert';
import { Loading, PageHeading, Panel, RequestError, useStaffData } from './Shared';
import { LiveTable, ReferenceControl } from './LiveRecordFields';
export function LiveRecordList({ resource }: { resource: LiveResource }) {
  const { backend } = useStaffSession();
  const def = LIVE_RESOURCES[resource];
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryKey = params.toString();
  const query = Object.fromEntries(params.entries());
  const [search, setSearch] = useState(query.q ?? '');
  const [filterError, setFilterError] = useState('');
  function updateDate(key: string, value: string) {
    try {
      update(key, value ? adelaideTimestamp(value) : '');
      setFilterError('');
    } catch (failure) {
      setFilterError(
        failure instanceof Error ? failure.message : 'Choose a valid Adelaide date and time.',
      );
    }
  }
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(queryKey);
    if (key !== 'page') next.delete('page');
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false });
  };
  useEffect(() => {
    setSearch(params.get('q') ?? '');
  }, [params]);
  useEffect(() => {
    if (search === (query.q ?? '')) return;
    const timer = setTimeout(() => update('q', search), 250);
    return () => clearTimeout(timer);
    // The URL is the source of truth; typing is debounced into it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, queryKey]);
  const result = useStaffData(
    (signal) => backend.list(resource, query, signal),
    [resource, queryKey],
  );
  const page = result.data?.page ?? Math.max(1, Number(query.page) || 1);
  const total = result.data?.total ?? 0;
  return (
    <>
      <PageHeading
        title={def.title}
        description={def.notice ?? `Manage the museum’s ${def.title.toLowerCase()}.`}
      >
        {def.create && (
          <Button as="a" href={`/staff/${resource}/new`} iconLeft="plus">
            New {def.singular}
          </Button>
        )}
      </PageHeading>
      <Panel>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {def.search && (
            <Field
              label={
                resource === 'bookings'
                  ? 'Search ticket codes'
                  : `Search ${def.title.toLowerCase()}`
              }
              htmlFor="live-search"
            >
              <Input
                id="live-search"
                type="search"
                value={search}
                maxLength={100}
                onChange={(event) => setSearch(event.target.value)}
              />
            </Field>
          )}
          {(def.filters ?? []).map((field) => (
            <Field key={field.key} label={field.label} htmlFor={`filter-${field.key}`}>
              {field.reference ? (
                <ReferenceControl
                  field={field}
                  value={query[field.key] ?? ''}
                  onChange={(value) => update(field.key, string(value))}
                  id={`filter-${field.key}`}
                />
              ) : field.options ? (
                <Select
                  id={`filter-${field.key}`}
                  value={query[field.key] ?? ''}
                  options={[
                    { value: '', label: `All ${field.label.toLowerCase()}` },
                    ...field.options.map((value) => ({ value, label: title(value) })),
                  ]}
                  onChange={(event) => update(field.key, event.target.value)}
                />
              ) : (
                <Input
                  id={`filter-${field.key}`}
                  type={field.type === 'datetime-local' ? 'datetime-local' : 'text'}
                  value={
                    field.type === 'datetime-local' && query[field.key]
                      ? Number.isNaN(Date.parse(query[field.key]!))
                        ? ''
                        : adelaideInput(query[field.key]!)
                      : (query[field.key] ?? '')
                  }
                  onChange={(event) =>
                    field.type === 'datetime-local'
                      ? updateDate(field.key, event.target.value)
                      : update(field.key, event.target.value)
                  }
                />
              )}
            </Field>
          ))}
        </div>
      </Panel>
      {filterError && <Alert tone="danger">{filterError}</Alert>}
      {result.error ? (
        <RequestError error={result.error} retry={result.refresh} />
      ) : result.loading ? (
        <Loading />
      ) : (
        <LiveTable resource={resource} rows={result.data?.rows ?? []} />
      )}
      {result.data && !result.error && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-muted">
            {total} records · Page {page} of {Math.max(1, Math.ceil(total / result.data.pageSize))}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={page <= 1 || result.loading}
              onClick={() => update('page', String(page - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={page * result.data.pageSize >= total || result.loading}
              onClick={() => update('page', String(page + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
