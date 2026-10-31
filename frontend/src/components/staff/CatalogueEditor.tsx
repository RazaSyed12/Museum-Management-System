'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/forms/Button';
import { Checkbox } from '@/components/forms/Checkbox';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Media } from '@/components/foundation/Media';
import type { CatalogueRecord, CatalogueReferences } from '@/lib/api/staff-catalogue';
import { useStaffSession } from '@/lib/staff/session';
import { adelaideInput, adelaideTimestamp } from '@/lib/staff/format';
import {
  Loading,
  PageHeading,
  Panel,
  RequestError,
  staffDataChanged,
  useStaffData,
} from './Shared';

type EditableResource = 'collections' | 'events';

export function CatalogueEditor({
  resource,
  record,
}: {
  resource: EditableResource;
  record?: CatalogueRecord;
}) {
  const { catalogue } = useStaffSession();
  const result = useStaffData((signal) => catalogue.references(resource, signal), [resource]);
  if (result.error) return <RequestError error={result.error} retry={result.refresh} />;
  if (!result.data) return <Loading />;
  return <CatalogueForm resource={resource} record={record} references={result.data} />;
}

function CatalogueForm({
  resource,
  record,
  references,
}: {
  resource: EditableResource;
  record?: CatalogueRecord;
  references: CatalogueReferences;
}) {
  const { catalogue } = useStaffSession();
  const router = useRouter();
  const singular = resource === 'collections' ? 'collection' : 'event';
  const [name, setName] = useState(record?.name ?? '');
  const [description, setDescription] = useState(record?.description ?? '');
  const [status, setStatus] = useState(record?.status ?? 'draft');
  const [locationId, setLocationId] = useState(record?.locationId ?? '');
  const [featured, setFeatured] = useState(record?.featured ?? false);
  const [categoryIds, setCategoryIds] = useState(record?.categories.map((c) => c.id) ?? []);
  const [collectionIds, setCollectionIds] = useState(record?.collections.map((c) => c.id) ?? []);
  const [startAt, setStartAt] = useState(record?.startAt ? adelaideInput(record.startAt) : '');
  const [endAt, setEndAt] = useState(record?.endAt ? adelaideInput(record.endAt) : '');
  const [price, setPrice] = useState(record?.price !== undefined ? String(record.price / 100) : '');
  const [capacity, setCapacity] = useState(
    record?.capacity !== undefined ? String(record.capacity) : '',
  );
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const saved = useRef(false);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (!saved.current) event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function change(update: () => void) {
    setDirty(true);
    update();
  }
  function toggle(values: string[], id: string) {
    return values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
  }
  const categories = new Map(
    references.categories.map((c) => [
      c.id,
      { id: c.id, name: c.name, inactive: c.status !== 'active' },
    ]),
  );
  for (const ref of record?.categories ?? [])
    if (!categories.has(ref.id)) categories.set(ref.id, { ...ref, inactive: true });
  const collections = new Map(
    references.collections.map((c) => [
      c.id,
      { id: c.id, name: c.name, inactive: c.status === 'archived' },
    ]),
  );
  for (const ref of record?.collections ?? [])
    if (!collections.has(ref.id)) collections.set(ref.id, { ...ref, inactive: true });
  const locations = new Map(references.locations.map((location) => [location.id, location]));
  if (record?.locationId && !locations.has(record.locationId))
    locations.set(record.locationId, {
      id: record.locationId,
      name: record.location || 'Current location',
    });

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError('');
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Enter a name.';
    if (resource === 'events') {
      if (!categoryIds.length) errors.categories = 'Choose at least one category.';
      if (!startAt) errors.start = 'Enter the start date and time.';
      if (!endAt || endAt <= startAt) errors.end = 'End time must be after start time.';
      if (!price.trim() || !Number.isFinite(Number(price)) || Number(price) < 0)
        errors.price = 'Enter a price of zero or greater.';
      if (!capacity.trim() || !Number.isInteger(Number(capacity)) || Number(capacity) < 0)
        errors.capacity = 'Enter a whole capacity of zero or greater.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      document.getElementById(`catalogue-${Object.keys(errors)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const input: Record<string, unknown> = {
        name: name.trim(),
        description:
          description === (record?.description ?? '')
            ? (record?.description ?? null)
            : description.trim(),
        status,
        location_id: locationId || null,
      };
      const sameIds = (left: string[], right: string[]) =>
        left.length === right.length && left.every((id) => right.includes(id));
      // Omitted links are preserved by PATCH. In particular, leave unchanged
      // inactive category links alone when editing an event's other fields.
      if (
        !record ||
        !sameIds(
          categoryIds,
          record.categories.map((c) => c.id),
        )
      )
        input.category_ids = categoryIds;
      if (resource === 'collections') input.featured = featured;
      else {
        input.start_at =
          startAt === (record?.startAt ? adelaideInput(record.startAt) : '')
            ? record!.startAt
            : adelaideTimestamp(startAt);
        input.end_at =
          endAt === (record?.endAt ? adelaideInput(record.endAt) : '')
            ? record!.endAt
            : adelaideTimestamp(endAt);
        if (Date.parse(String(input.end_at)) <= Date.parse(String(input.start_at)))
          throw new Error('End time must be after start time.');
        input.ticket_price = Math.round(Number(price) * 100) / 100;
        input.capacity = Number(capacity);
        if (
          !record ||
          !sameIds(
            collectionIds,
            record.collections.map((c) => c.id),
          )
        )
          input.collection_ids = collectionIds;
      }
      const result = await catalogue.save(resource, input, record?.id);
      saved.current = true;
      setDirty(false);
      staffDataChanged();
      router.push(`/staff/${resource}/${result.id}?saved=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this record.');
    } finally {
      setBusy(false);
    }
  }

  function leave() {
    if (!dirty || window.confirm('Discard your unsaved changes?'))
      router.push(record ? `/staff/${resource}/${record.id}` : `/staff/${resource}`);
  }
  return (
    <>
      <Link
        href={`/staff/${resource}`}
        className="text-sm"
        onClick={(event) => {
          if (dirty && !window.confirm('Discard your unsaved changes?')) event.preventDefault();
        }}
      >
        Back to {resource === 'collections' ? 'collections' : 'events & exhibitions'}
      </Link>
      <PageHeading
        title={`${record ? 'Edit' : 'Add'} ${singular}`}
        description={
          resource === 'events'
            ? 'Dates and times use Australia/Adelaide.'
            : 'Keep the museum’s collection information up to date.'
        }
      />
      <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Panel title="Details">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label={resource === 'events' ? 'Event name' : 'Collection name'}
              htmlFor="catalogue-name"
              required
              error={fieldErrors.name}
              className="md:col-span-2"
            >
              <Input
                id="catalogue-name"
                required
                maxLength={200}
                value={name}
                invalid={Boolean(fieldErrors.name)}
                onChange={(e) => change(() => setName(e.target.value))}
              />
            </Field>
            <Field label="Description" htmlFor="catalogue-description" className="md:col-span-2">
              <textarea
                id="catalogue-description"
                rows={4}
                maxLength={5000}
                value={description}
                onChange={(e) => change(() => setDescription(e.target.value))}
                className="w-full rounded-md border border-line-default bg-surface-card px-3.5 py-2.5 text-heading outline-none focus:border-olive-500 focus:shadow-focus"
              />
            </Field>
            <Field label="Status" htmlFor="catalogue-status" required>
              <Select
                id="catalogue-status"
                value={status}
                options={
                  resource === 'events'
                    ? [
                        { value: 'draft', label: 'Draft' },
                        { value: 'scheduled', label: 'Published' },
                      ]
                    : [
                        { value: 'draft', label: 'Draft' },
                        { value: 'published', label: 'Published' },
                      ]
                }
                onChange={(e) => change(() => setStatus(e.target.value as typeof status))}
              />
            </Field>
            <Field
              label="Gallery location"
              htmlFor="catalogue-location"
              hint="Choose a gallery already used in the catalogue, or leave it unassigned."
            >
              <Select
                id="catalogue-location"
                placeholder="Unassigned"
                value={locationId}
                options={[...locations.values()].map((l) => ({ value: l.id, label: l.name }))}
                onChange={(e) => change(() => setLocationId(e.target.value))}
              />
            </Field>
            {resource === 'events' && (
              <>
                <Field
                  label="Start date and time"
                  htmlFor="catalogue-start"
                  required
                  hint="Adelaide local time"
                  error={fieldErrors.start}
                >
                  <Input
                    id="catalogue-start"
                    type="datetime-local"
                    required
                    value={startAt}
                    onChange={(e) => change(() => setStartAt(e.target.value))}
                  />
                </Field>
                <Field
                  label="End date and time"
                  htmlFor="catalogue-end"
                  required
                  hint="Adelaide local time"
                  error={fieldErrors.end}
                >
                  <Input
                    id="catalogue-end"
                    type="datetime-local"
                    required
                    value={endAt}
                    onChange={(e) => change(() => setEndAt(e.target.value))}
                  />
                </Field>
                <Field
                  label="General admission (AUD)"
                  htmlFor="catalogue-price"
                  required
                  hint="Enter zero for a free event."
                  error={fieldErrors.price}
                >
                  <Input
                    id="catalogue-price"
                    type="number"
                    min={0}
                    max={99999999.99}
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => change(() => setPrice(e.target.value))}
                  />
                </Field>
                <Field
                  label="Total event capacity"
                  htmlFor="catalogue-capacity"
                  required
                  error={fieldErrors.capacity}
                >
                  <Input
                    id="catalogue-capacity"
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={capacity}
                    onChange={(e) => change(() => setCapacity(e.target.value))}
                  />
                </Field>
              </>
            )}
            <fieldset
              id="catalogue-categories"
              tabIndex={-1}
              aria-describedby={fieldErrors.categories ? 'catalogue-categories-error' : undefined}
              className="min-w-0 md:col-span-2"
            >
              <legend className="type-label mb-3 text-heading">
                Categories{resource === 'events' ? ' (choose at least one)' : ''}
              </legend>
              <div className="grid gap-3 md:grid-cols-2">
                {[...categories.values()].map((c) => (
                  <Checkbox
                    key={c.id}
                    id={`category-${c.id}`}
                    label={`${c.name}${c.inactive ? ' (inactive)' : ''}`}
                    checked={categoryIds.includes(c.id)}
                    disabled={
                      !categoryIds.includes(c.id) && (c.inactive || categoryIds.length >= 20)
                    }
                    onChange={() => change(() => setCategoryIds(toggle(categoryIds, c.id)))}
                  />
                ))}
              </div>
              {!categories.size && (
                <p className="text-sm text-muted">No categories are available.</p>
              )}
              {fieldErrors.categories && (
                <p
                  id="catalogue-categories-error"
                  role="alert"
                  className="mt-2 text-sm text-danger-700"
                >
                  {fieldErrors.categories}
                </p>
              )}
            </fieldset>
            {resource === 'events' && (
              <fieldset className="min-w-0 md:col-span-2">
                <legend className="type-label mb-3 text-heading">Linked collections</legend>
                <div className="grid gap-3 md:grid-cols-2">
                  {[...collections.values()].map((c) => (
                    <Checkbox
                      key={c.id}
                      id={`collection-${c.id}`}
                      label={`${c.name}${c.inactive ? ' (archived)' : ''}`}
                      checked={collectionIds.includes(c.id)}
                      disabled={
                        !collectionIds.includes(c.id) && (c.inactive || collectionIds.length >= 20)
                      }
                      onChange={() => change(() => setCollectionIds(toggle(collectionIds, c.id)))}
                    />
                  ))}
                </div>
                {!collections.size && (
                  <p className="text-sm text-muted">No collections are available to link.</p>
                )}
              </fieldset>
            )}
            {resource === 'collections' && (
              <div className="md:col-span-2">
                <Checkbox
                  id="catalogue-featured"
                  label="Feature on the public home page"
                  checked={featured}
                  onChange={(e) => change(() => setFeatured(e.target.checked))}
                />
              </div>
            )}
            {Boolean(record?.images.length) && (
              <div className="grid gap-4 border-t border-line-subtle pt-5 md:col-span-2">
                <h2 className="type-h3">Images</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {record!.images.map((image) => (
                    <Media
                      key={image.id}
                      src={image.url}
                      alt={image.alt || record!.name}
                      ratio="4 / 3"
                    />
                  ))}
                </div>
              </div>
            )}
            <p className="text-sm text-muted md:col-span-2">
              Image changes are not available yet. Existing images will be kept.
            </p>
          </div>
        </Panel>
        <div className="grid gap-4 lg:sticky lg:top-26">
          <Panel title="Save changes">
            <div className="grid gap-4">
              {error && (
                <Alert tone="danger" title="Could not save">
                  {error}
                </Alert>
              )}
              <Button type="submit" fullWidth loading={busy}>
                Save {singular}
              </Button>
              <Button variant="ghost" fullWidth disabled={busy} onClick={leave}>
                Cancel
              </Button>
            </div>
          </Panel>
        </div>
      </form>
    </>
  );
}
