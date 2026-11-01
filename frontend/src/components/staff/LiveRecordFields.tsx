'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStaffSession } from '@/lib/staff/session';
import {
  LIVE_RESOURCES,
  object,
  recordName,
  string,
  title,
  type BackendRecord,
  type LiveField,
  type LiveResource,
} from '@/lib/staff/backend-resources';
import { date, money } from '@/lib/staff/format';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Checkbox } from '@/components/forms/Checkbox';
import { DataTable, type Column } from '@/components/data/DataTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Alert } from '@/components/feedback/Alert';
import { Status, RequestError, useStaffData } from './Shared';
const LABELS: Record<string, string> = {
  full_name: 'Name',
  name: 'Name',
  title: 'Title',
  display_status: 'Status',
  status: 'Status',
  active: 'Active',
  is_active: 'Active',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  city: 'City',
  country: 'Country',
  capacity: 'Capacity',
  description: 'Description',
  historical_period: 'Period',
  catalogue_total: 'Catalogue total',
  start_at: 'Starts',
  end_at: 'Ends',
  starts_at: 'Starts',
  ends_at: 'Expires',
  ticket_price: 'General admission',
  price_member: 'Member admission',
  price_child: 'Child admission',
  price: 'Price',
  purchase_price: 'Recorded purchase price',
  plan: 'Plan',
  duration_months: 'Duration (months)',
  account_status: 'Account status',
  role: 'Account role',
  tier: 'Staff tier',
  booking_id: 'Booking reference',
  booking_status: 'Booking status',
  events: 'Event',
  event: 'Event',
  quantity: 'Quantity',
  total_amount: 'Total',
  subtotal: 'Subtotal',
  discount_amount: 'Discount',
  tax_amount: 'Tax',
  service_fee: 'Service fee',
  checked_in_at: 'Checked in',
  created_at: 'Created',
  updated_at: 'Updated',
  booked_at: 'Booked',
  visited_at: 'Visited',
  visitor_id: 'Visitor',
  user_id: 'Account holder',
  accession_number: 'Accession number',
  sort_order: 'Display order',
  last_sign_in_at: 'Last sign-in',
  cancellation_reason: 'Cancellation reason',
  media_id: 'Image',
  collection_id: 'Collection',
  category_id: 'Category',
  parent_category_id: 'Parent category',
  linked_profile_id: 'Linked account',
  event_type: 'Event type',
  tags: 'Tags',
  year_label: 'Approximate date',
  creator: 'Creator or maker',
  origin: 'Origin',
  location_id: 'Location',
  currency: 'Currency',
  paid_at: 'Paid',
  refunded_at: 'Refunded',
  payment_status: 'Payment status',
  amount: 'Amount',
  ticket_code: 'Ticket code',
  ticket_status: 'Ticket status',
  allocation_id: 'Allocation',
  provider: 'Provider',
  method: 'Method',
  failure_message: 'Payment outcome',
  transaction_reference: 'Transaction reference',
  expires_at: 'Reservation expires',
  bucket: 'Visit period',
  visitor_count: 'Recorded visitors',
  joins_count: 'Membership starts',
  purchase_revenue: 'Recorded purchase value',
  booked_quantity: 'Booked tickets',
  cancelled_quantity: 'Cancelled tickets',
  checked_in_quantity: 'Recorded attendance',
  cancelled_count: 'Cancelled bookings',
  digitised_count: 'Digitised artefacts',
};
export function liveLabel(key: string) {
  return LABELS[key] ?? title(key);
}
export function LiveValue({ value, field }: { value: unknown; field: string }) {
  if (value === null || value === undefined || value === '')
    return <span className="text-muted">—</span>;
  if (typeof value === 'boolean') return <Status value={value ? 'Active' : 'Inactive'} />;
  if (
    [
      'status',
      'display_status',
      'account_status',
      'booking_status',
      'payment_status',
      'ticket_status',
      'tier',
      'role',
    ].includes(field)
  )
    return <Status value={title(value)} />;
  if (field.endsWith('_at') || field === 'last_sign_in_at') return <>{date(string(value), true)}</>;
  if (
    [
      'price',
      'ticket_price',
      'price_member',
      'price_child',
      'purchase_price',
      'total_amount',
      'subtotal',
      'discount_amount',
      'tax_amount',
      'service_fee',
      'amount',
      'revenue',
      'refunded',
      'purchase_revenue',
    ].includes(field)
  )
    return <>{money(Math.round(Number(value) * 100))}</>;
  if (Array.isArray(value))
    return (
      <>
        {value
          .map((item) => (typeof item === 'object' ? recordName(object(item)) : string(item)))
          .filter(Boolean)
          .join(', ') || '—'}
      </>
    );
  if (typeof value === 'object') return <>{recordName(object(value)) || '—'}</>;
  return <span className="break-words">{string(value)}</span>;
}
export function LiveTable({
  resource,
  rows,
  columns,
}: {
  resource: LiveResource;
  rows: BackendRecord[];
  columns?: string[];
}) {
  const def = LIVE_RESOURCES[resource];
  const keys = columns ?? def.columns;
  const references: Record<string, LiveResource> = {
    visitor_id: 'visitors',
    user_id: 'users',
    collection_id: 'collections',
    category_id: 'categories',
    plan_id: 'plans',
    location_id: 'locations',
  };
  const tableColumns: Column<BackendRecord>[] = keys.map((key, index) => ({
    key,
    header: liveLabel(key),
    render: (row) =>
      index === 0 ? (
        <Link
          className="type-label"
          href={`/staff/${resource}/${encodeURIComponent(string(row[def.id]))}`}
        >
          <LiveValue value={row[key]} field={key} />
        </Link>
      ) : references[key] && row[key] ? (
        <ReferenceValue
          field={{ key, label: liveLabel(key), reference: references[key] }}
          value={row[key]}
        />
      ) : (
        <LiveValue value={row[key]} field={key} />
      ),
  }));
  return (
    <DataTable
      columns={tableColumns}
      rows={rows.map((row) => ({ ...row, id: string(row[def.id]) }))}
      empty={
        <EmptyState
          compact
          title="No matching records"
          description="Try another search or filter."
        />
      }
    />
  );
}
export function ReferenceControl({
  field,
  value,
  onChange,
  id,
  excludeId,
  onBusy,
}: {
  field: LiveField;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  id: string;
  excludeId?: string;
  onBusy?: (value: boolean) => void;
}) {
  const { backend, user } = useStaffSession();
  const [search, setSearch] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const allowed = field.reference !== 'users' || user?.role === 'Admin';
  const result = useStaffData(
    (signal) =>
      allowed && field.reference ? backend.all(field.reference, signal) : Promise.resolve([]),
    [field.reference, allowed],
  );
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const rows = (result.data ?? []).filter(
    (row) =>
      string(
        row[field.reference === 'media' ? 'media_id' : LIVE_RESOURCES[field.reference!].id],
      ) !== excludeId,
  );
  const options = rows.map((row) => ({
    value: string(
      row[field.reference === 'media' ? 'media_id' : LIVE_RESOURCES[field.reference!].id],
    ),
    label: recordName(row),
    inactive: row.active === false || row.status === 'archived',
  }));
  for (const current of selected)
    if (!options.some((option) => option.value === current))
      options.push({ value: current, label: `Current selection · ${current}`, inactive: false });
  if (!allowed)
    return (
      <p className="text-sm text-muted">
        Account selection is available to administrators. Choose a visitor instead.
      </p>
    );
  if (result.error) return <RequestError error={result.error} retry={result.refresh} />;
  return (
    <div className="grid gap-2">
      {field.multiple ? (
        <>
          <Input
            aria-label={`Filter ${field.label.toLowerCase()}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter choices…"
          />
          <fieldset
            id={id}
            className="grid max-h-52 gap-2 overflow-auto rounded-md border border-line-subtle p-3"
          >
            <legend className="sr-only">{field.label}</legend>
            {options
              .filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
              .map((option) => (
                <Checkbox
                  key={option.value}
                  label={`${option.label}${option.inactive ? ' (inactive)' : ''}`}
                  checked={selected.includes(option.value)}
                  disabled={option.inactive && !selected.includes(option.value)}
                  onChange={() =>
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value],
                    )
                  }
                />
              ))}
            {result.loading && <span role="status">Loading choices…</span>}
            {!result.loading && !options.length && (
              <span className="text-muted">No choices available.</span>
            )}
          </fieldset>
        </>
      ) : (
        <Select
          id={id}
          disabled={result.loading || uploading}
          value={string(value)}
          required={field.required}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{result.loading ? 'Loading choices…' : 'None selected'}</option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.inactive && !selected.includes(option.value)}
            >
              {option.label}
              {option.inactive ? ' (inactive)' : ''}
            </option>
          ))}
        </Select>
      )}
      {field.reference === 'media' && (
        <Input
          aria-label="Upload background image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setUploadError('');
            setUploading(true);
            onBusy?.(true);
            try {
              const media = await backend.upload(file);
              onChange(string(media.media_id));
              result.refresh();
            } catch (error) {
              setUploadError(error instanceof Error ? error.message : 'Upload failed.');
            } finally {
              setUploading(false);
              onBusy?.(false);
            }
          }}
        />
      )}
      {uploadError && <Alert tone="danger">{uploadError}</Alert>}
    </div>
  );
}
export function ReferenceValue({ field, value }: { field: LiveField; value: unknown }) {
  const { backend, user } = useStaffSession();
  const resource = field.reference;
  const allowed = resource !== 'users' || user?.role === 'Admin';
  const result = useStaffData(
    async (signal) =>
      allowed && resource && resource !== 'media' && value
        ? backend.get(resource, string(value), signal)
        : null,
    [resource, value, allowed],
  );
  if (!value) return <>—</>;
  if (!allowed || resource === 'media') return <span className="break-all">{string(value)}</span>;
  return (
    <Link href={`/staff/${resource}/${encodeURIComponent(string(value))}`}>
      {result.data ? recordName(result.data) : string(value)}
    </Link>
  );
}
