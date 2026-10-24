'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Checkbox } from '@/components/forms/Checkbox';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { staffApi, StaffApiError } from '@/lib/api/staff';
import { adelaideInput, adelaideTimestamp, localDay, money } from '@/lib/staff/format';
import type { Asset, References, Resource, StaffResources } from '@/lib/staff/types';
import { ImageGallery } from './ImageGallery';
import { defaults, RECORDS } from './records';
import { PageHeading, Panel, staffDataChanged } from './Shared';

export function RecordEditor({
  resource,
  references,
  record,
}: {
  resource: Resource;
  references: References;
  record?: StaffResources[Resource];
}) {
  const router = useRouter();
  const definition = RECORDS[resource];
  const [values, setValues] = useState<Record<string, string>>(() => {
    const result = defaults(resource, references);
    if (record)
      for (const [key, value] of Object.entries(record)) {
        const field = definition.fields.find((f) => f.key === key);
        result[key] =
          field?.type === 'datetime-local' && value
            ? adelaideInput(String(value))
            : field?.type === 'money'
              ? String(Number(value) / 100)
              : Array.isArray(value)
                ? value.join(', ')
                : String(value ?? '');
      }
    return result;
  });
  const [images, setImages] = useState<Asset[]>(record && 'images' in record ? record.images : []);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const saved = useRef(false);
  const [quote, setQuote] = useState<{ total: number; remaining: number }>();
  const [quoteError, setQuoteError] = useState('');
  const [quoting, setQuoting] = useState(false);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (!saved.current) event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    if (resource !== 'bookings') return;
    const controller = new AbortController();
    setQuote(undefined);
    setQuoteError('');
    if (!values.eventId || !values.visitorId || !values.visitDate || !values.quantity) return;
    setQuoting(true);
    const timer = setTimeout(
      () =>
        staffApi
          .quote(
            { ...values, id: record?.id, quantity: Number(values.quantity) },
            controller.signal,
          )
          .then(setQuote)
          .catch((err: unknown) => {
            if (!controller.signal.aborted)
              setQuoteError(err instanceof Error ? err.message : 'Could not calculate the total.');
          })
          .finally(() => {
            if (!controller.signal.aborted) setQuoting(false);
          }),
      200,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [resource, values, record?.id]);

  function change(key: string, value: string) {
    setDirty(true);
    setValues((previous) => {
      const next = { ...previous, [key]: value };
      if (resource === 'memberships' && key === 'joinDate' && value) {
        const expiry = new Date(`${value}T12:00:00Z`);
        if (!Number.isNaN(expiry.getTime())) {
          expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);
          next.expiryDate = localDay(expiry);
        }
      }
      if (resource === 'items' && key === 'collectionId')
        next.categoryId =
          references.collections.find((c) => c.id === value)?.categoryId ??
          previous.categoryId ??
          '';
      if (resource === 'bookings' && key === 'eventId') {
        const event = references.events.find((e) => e.id === value);
        if (event)
          next.visitDate =
            localDay(event.startAt) < localDay() ? localDay() : localDay(event.startAt);
      }
      return next;
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    if (uploading) {
      setError('Wait for the image upload to finish.');
      return;
    }
    const errors: Record<string, string> = {};
    for (const field of definition.fields) {
      if (field.required && !values[field.key]?.trim())
        errors[field.key] = `${field.label} is required.`;
      if (
        ['number', 'money'].includes(field.type ?? '') &&
        (!Number.isFinite(Number(values[field.key])) ||
          Number(values[field.key]) < (field.min ?? 0))
      )
        errors[field.key] = `${field.label} must be ${field.min ?? 0} or greater.`;
    }
    if (values.startAt && values.endAt && values.endAt <= values.startAt)
      errors.endAt = 'End time must be after start time.';
    if (values.joinDate && values.expiryDate && values.expiryDate < values.joinDate)
      errors.expiryDate = 'Expiry date must be on or after the join date.';
    if (resource === 'events' && Number(values.capacity) < Number(values.memberAllocation))
      errors.memberAllocation = 'Reserved places cannot exceed total capacity.';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      document.getElementById(`record-${Object.keys(errors)[0]}`)?.focus();
      return;
    }
    if (resource === 'bookings' && (!quote || quoting || quoteError)) {
      setError(quoteError || 'Wait for a valid ticket quote before saving.');
      return;
    }
    setBusy(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const field of definition.fields) {
        const value = values[field.key] ?? '';
        payload[field.key] =
          field.type === 'number'
            ? Number(value)
            : field.type === 'money'
              ? Math.round(Number(value) * 100)
              : field.type === 'datetime-local'
                ? adelaideTimestamp(value)
                : field.type === 'checkbox'
                  ? value === 'true'
                  : field.type === 'tags'
                    ? [
                        ...new Set(
                          value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        ),
                      ]
                    : value.trim();
      }
      if (['events', 'collections', 'items'].includes(resource)) payload.images = images;
      if (resource === 'events' && !record) payload.booked = 0;
      if (resource === 'categories' && !record) payload.status = 'Active';
      const result = await staffApi.save(
        resource,
        payload as Partial<StaffResources[Resource]>,
        record?.id,
      );
      saved.current = true;
      setDirty(false);
      staffDataChanged();
      router.push(`/staff/${resource}/${result.id}?saved=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this record.');
      if (err instanceof StaffApiError) setFieldErrors(err.fields);
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    if (!dirty || window.confirm('Discard your unsaved changes?'))
      router.push(record ? `/staff/${resource}/${record.id}` : `/staff/${resource}`);
  }
  const planPrice =
    values.type === 'Joint'
      ? references.settings.jointPrice
      : values.type === 'Family'
        ? references.settings.familyPrice
        : references.settings.individualPrice;
  return (
    <>
      <Link href={`/staff/${resource}`} className="text-sm">
        Back to {definition.title.toLowerCase()}
      </Link>
      <PageHeading
        title={`${record ? 'Edit' : 'Add'} ${definition.singular}`}
        description={
          resource === 'events'
            ? 'Dates and times use Australia/Adelaide.'
            : `Keep the museum’s ${definition.singular} information up to date.`
        }
      />
      <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Panel title="Details">
          <div className="grid gap-5 md:grid-cols-2">
            {definition.fields.map((field) => {
              const value = values[field.key] ?? '';
              let options =
                field.options?.map((option) => ({
                  value: option,
                  label: option,
                })) ?? [];
              if (field.reference)
                options = references[field.reference]
                  .filter(
                    (row) =>
                      !('status' in row) ||
                      ![
                        'Archived',
                        'Cancelled',
                        ...(field.reference === 'events' ? ['Draft', 'Completed'] : []),
                      ].includes(String(row.status)) ||
                      row.id === value,
                  )
                  .map((row) => ({
                    value: row.id,
                    label: 'name' in row ? row.name : row.title,
                  }));
              return field.type === 'checkbox' ? (
                <div key={field.key} className="md:col-span-2">
                  <Checkbox
                    id={`record-${field.key}`}
                    label={field.label}
                    checked={value === 'true'}
                    onChange={(e) => change(field.key, String(e.target.checked))}
                  />
                </div>
              ) : (
                <Field
                  key={field.key}
                  label={field.label}
                  htmlFor={`record-${field.key}`}
                  hint={field.hint}
                  error={fieldErrors[field.key]}
                  required={field.required}
                  className={
                    field.type === 'textarea' || field.type === 'tags' ? 'md:col-span-2' : undefined
                  }
                >
                  {field.type === 'select' ? (
                    <Select
                      id={`record-${field.key}`}
                      options={options}
                      placeholder="Select…"
                      required={field.required}
                      value={value}
                      invalid={Boolean(fieldErrors[field.key])}
                      onChange={(e) => change(field.key, e.target.value)}
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={`record-${field.key}`}
                      value={value}
                      required={field.required}
                      rows={4}
                      onChange={(e) => change(field.key, e.target.value)}
                      className="w-full rounded-md border border-line-default bg-surface-card px-3.5 py-2.5 text-heading outline-none focus:border-olive-500 focus:shadow-focus"
                    />
                  ) : (
                    <Input
                      id={`record-${field.key}`}
                      type={
                        field.type === 'money'
                          ? 'number'
                          : field.type === 'tags'
                            ? 'text'
                            : (field.type ?? 'text')
                      }
                      required={field.required}
                      value={value}
                      min={field.type === 'money' ? 0 : field.min}
                      step={
                        field.type === 'money' ? '0.01' : field.type === 'number' ? '1' : undefined
                      }
                      invalid={Boolean(fieldErrors[field.key])}
                      onChange={(e) => change(field.key, e.target.value)}
                    />
                  )}
                </Field>
              );
            })}
          </div>
          {['events', 'collections', 'items'].includes(resource) && (
            <div className="mt-7 border-t border-line-subtle pt-6">
              <ImageGallery
                onBusyChange={setUploading}
                images={images}
                onChange={(value) => {
                  setDirty(true);
                  setImages(value);
                }}
              />
            </div>
          )}
        </Panel>
        <div className="grid gap-4 lg:sticky lg:top-26">
          <Panel title="Save changes">
            <div className="grid gap-4">
              {error && (
                <Alert tone="danger" title="Could not save">
                  {error}
                </Alert>
              )}
              {resource === 'bookings' && (
                <>
                  <p className="text-sm text-muted">
                    Prototype payment. No card details are collected.
                  </p>
                  <div aria-live="polite">
                    <p className="type-label text-heading">Total</p>
                    <p className="mt-2 font-display text-3xl text-heading">
                      {quoting ? 'Calculating…' : quote ? money(quote.total) : '—'}
                    </p>
                    {quoteError && <p className="mt-2 text-sm text-danger-700">{quoteError}</p>}
                  </div>
                  <Link href="/staff/visitors/new" className="text-sm">
                    Add a visitor first
                  </Link>
                </>
              )}
              {resource === 'memberships' && (
                <>
                  <p className="font-display text-3xl text-heading">
                    {money(planPrice)} <span className="text-sm text-muted">per year</span>
                  </p>
                  <p className="text-sm text-muted">
                    Individual: one adult. Joint: two adults. Family: two adults and up to four
                    children.
                  </p>
                  <Link href="/staff/visitors/new" className="text-sm">
                    Add a visitor first
                  </Link>
                </>
              )}
              {resource === 'users' && (
                <p className="text-sm text-muted">
                  Use Invited for a new staff member. The backend sends their invitation; this
                  preview does not send email.
                </p>
              )}
              <Button
                type="submit"
                fullWidth
                loading={busy}
                disabled={uploading || (resource === 'bookings' && (!quote || quoting))}
              >
                Save {definition.singular}
              </Button>
              <Button variant="ghost" fullWidth onClick={cancel}>
                Cancel
              </Button>
            </div>
          </Panel>
          <p className="px-1 text-xs text-muted">
            Changes become visible in related views after saving.
          </p>
        </div>
      </form>
    </>
  );
}
