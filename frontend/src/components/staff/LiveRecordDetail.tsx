'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStaffSession } from '@/lib/staff/session';
import {
  LIVE_RESOURCES,
  object,
  records,
  recordName,
  string,
  title,
  type BackendRecord,
  type LiveResource,
} from '@/lib/staff/backend-resources';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Field } from '@/components/forms/Field';
import { DataTable } from '@/components/data/DataTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Alert } from '@/components/feedback/Alert';
import { Modal } from '@/components/feedback/Modal';
import { Media } from '@/components/foundation/Media';
import {
  Loading,
  PageHeading,
  Panel,
  RequestError,
  staffDataChanged,
  useStaffData,
} from './Shared';
import { LiveTable, LiveValue, ReferenceValue, liveLabel } from './LiveRecordFields';
import { LiveAllocations, LiveBenefits, LiveMedia } from './LiveRecordPanels';
export function LiveRecordDetail({
  resource,
  record,
  saved,
  refresh,
}: {
  resource: LiveResource;
  record: BackendRecord;
  saved: boolean;
  refresh: () => void;
}) {
  const { backend, user } = useStaffSession();
  const def = LIVE_RESOURCES[resource];
  const id = string(record[def.id]);
  const params = useSearchParams();
  const router = useRouter();
  const [pending, setPending] = useState<'archive' | 'cancel' | 'refund' | 'check-in' | 'delete'>();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const elevated = user?.role === 'Admin' || user?.role === 'Manager';
  const archived = record.status === 'archived' || record.status === 'cancelled';
  const payments = records(record.payments);
  const fields = [
    ...new Set([
      ...def.columns,
      ...(resource === 'bookings'
        ? ['subtotal', 'discount_amount', 'tax_amount', 'service_fee', 'expires_at']
        : []),
      ...def.fields.map((field) => field.key).filter((key) => !key.endsWith('_ids')),
      'created_at',
      'updated_at',
      'cancellation_reason',
      'checked_in_at',
      'booked_at',
      'user_id',
      'visitor_id',
      'linked_profile_id',
      'last_sign_in_at',
      'phone',
    ]),
  ].filter(
    (key) => record[key] !== undefined || (key === 'status' && record.account_status !== undefined),
  );
  async function confirmAction() {
    if (!pending || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await backend.action(resource, id, pending, reason ? { reason } : {});
      setPending(undefined);
      setReason('');
      if (pending === 'delete') router.push(`/staff/${resource}`);
      else {
        setMessage(
          result.affected_bookings !== undefined
            ? `Event cancelled. ${Number(result.affected_bookings)} bookings affected.`
            : 'The record has been updated.',
        );
        refresh();
      }
      staffDataChanged();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not complete the action.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        title={recordName(record) || `${title(def.singular)} details`}
        description={def.notice ?? `Review this ${def.singular} and its related records.`}
      >
        <Button as="a" href={`/staff/${resource}`} variant="secondary">
          Back to {def.title.toLowerCase()}
        </Button>
        {def.edit && !archived && (
          <Button as="a" href={`/staff/${resource}/${id}/edit`}>
            Edit {def.singular}
          </Button>
        )}
        {elevated && ['collections', 'items', 'hero'].includes(resource) && !archived && (
          <Button variant="danger" onClick={() => setPending('archive')}>
            Archive
          </Button>
        )}
        {elevated && resource === 'events' && !archived && (
          <Button variant="danger" onClick={() => setPending('cancel')}>
            Cancel event
          </Button>
        )}
        {resource === 'locations' && (
          <Button variant="danger" onClick={() => setPending('delete')}>
            Delete location
          </Button>
        )}
        {resource === 'bookings' &&
          ['pending', 'confirmed'].includes(string(record.booking_status)) &&
          !record.checked_in_at && (
            <Button variant="danger" onClick={() => setPending('cancel')}>
              Cancel booking
            </Button>
          )}
        {resource === 'bookings' &&
          record.booking_status === 'confirmed' &&
          !record.checked_in_at && <Button onClick={() => setPending('check-in')}>Check in</Button>}
        {resource === 'bookings' &&
          elevated &&
          payments.some((payment) => payment.payment_status === 'completed') && (
            <Button variant="secondary" onClick={() => setPending('refund')}>
              Refund payment
            </Button>
          )}
      </PageHeading>
      {saved && <Alert tone="success">{title(def.singular)} saved.</Alert>}
      {params.get('partial') && (
        <Alert tone="warning" title="Collection fields saved; categories need attention">
          The category update did not complete. Review the categories below, then edit and reselect
          them to retry. Other collection fields have already been saved.
        </Alert>
      )}
      {message && <Alert tone="success">{message}</Alert>}
      {error && !pending && <Alert tone="danger">{error}</Alert>}
      <Panel title="Details">
        <dl className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <dt className="type-label text-muted">Record reference</dt>
            <dd className="mt-1 break-all">{id}</dd>
          </div>
          {fields.map((key) => {
            const field = def.fields.find((item) => item.key === key);
            return (
              <div key={key}>
                <dt className="type-label text-muted">{field?.label ?? liveLabel(key)}</dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {field?.reference && record[key] ? (
                    <ReferenceValue field={field} value={record[key]} />
                  ) : (
                    <LiveValue
                      value={
                        key === 'status' ? (record.status ?? record.account_status) : record[key]
                      }
                      field={key}
                    />
                  )}
                </dd>
              </div>
            );
          })}
          {['categories', 'collections'].map(
            (key) =>
              Array.isArray(record[key]) && (
                <div key={key}>
                  <dt className="type-label text-muted">{title(key)}</dt>
                  <dd className="mt-1 flex flex-wrap gap-3">
                    {records(record[key]).map((row) => (
                      <Link
                        key={string(row[LIVE_RESOURCES[key as 'categories' | 'collections'].id])}
                        href={`/staff/${key}/${string(row[LIVE_RESOURCES[key as 'categories' | 'collections'].id])}`}
                      >
                        {recordName(row)}
                      </Link>
                    ))}
                  </dd>
                </div>
              ),
          )}
        </dl>
      </Panel>
      {resource === 'hero' && Boolean(object(record.image).url) && (
        <Panel title="Background image">
          <Media
            src={string(object(record.image).url)}
            alt={string(object(record.image).alt_text)}
            ratio="16 / 9"
          />
        </Panel>
      )}
      {['collections', 'events', 'items'].includes(resource) && (
        <LiveMedia resource={resource} id={id} />
      )}
      {resource === 'events' && (
        <>
          <LiveAllocations id={id} />
          <LiveHistory resource="bookings" query={{ event_id: id }} heading="Event bookings" />
        </>
      )}
      {resource === 'plans' && <LiveBenefits id={id} />}
      {resource === 'visitors' && (
        <>
          <div className="flex flex-wrap gap-3">
            <Button as="a" href={`/staff/memberships/new?visitor_id=${id}`} variant="secondary">
              Record membership
            </Button>
            <Button as="a" href={`/staff/visits/new?visitor_id=${id}`} variant="secondary">
              Record walk-in
            </Button>
          </div>
          <LiveHistory
            resource="memberships"
            query={{ visitor_id: id }}
            heading="Membership history"
          />
          <LiveHistory resource="visits" query={{ visitor_id: id }} heading="Recorded visits" />
          {record.linked_profile_id ? (
            <LiveHistory
              resource="bookings"
              query={{ user_id: string(record.linked_profile_id) }}
              heading="Linked account bookings"
            />
          ) : (
            <Panel>
              <p className="text-muted">There is no linked account for booking history.</p>
            </Panel>
          )}
        </>
      )}
      {resource === 'bookings' && (
        <>
          <ReadOnlyRows
            heading="Tickets"
            rows={records(record.tickets)}
            columns={['ticket_code', 'ticket_status', 'price']}
          />
          <ReadOnlyRows
            heading="Payment attempts"
            rows={payments}
            columns={[
              'payment_status',
              'amount',
              'currency',
              'provider',
              'paid_at',
              'refunded_at',
              'failure_message',
            ]}
          />
          <LiveHistory resource="visits" query={{ booking_id: id }} heading="Attendance" />
        </>
      )}
      {resource === 'users' && (
        <LiveHistory resource="bookings" query={{ user_id: id }} heading="Account bookings" />
      )}
      <Modal
        open={Boolean(pending)}
        title={`${title(pending)} ${def.singular}`}
        onClose={() => {
          if (!busy) {
            setPending(undefined);
            setError('');
          }
        }}
      >
        <div className="grid gap-4">
          <p>
            {pending === 'cancel'
              ? resource === 'events'
                ? 'This cancels the event and its pending or confirmed bookings. Completed payments are refunded by the backend.'
                : 'This cancels the booking, releases its seats and refunds completed payments.'
              : pending === 'refund'
                ? 'This refunds completed payments. It does not cancel the booking or release seats.'
                : pending === 'delete'
                  ? 'This permanently deletes the location. Locations still in use cannot be deleted.'
                  : pending === 'check-in'
                    ? 'Record this booking as checked in and create its attendance record?'
                    : 'This hides the record from the public site.'}
          </p>
          {pending === 'cancel' && resource === 'events' && (
            <Field label="Cancellation reason" htmlFor="cancel-reason">
              <Input
                id="cancel-reason"
                value={reason}
                maxLength={2000}
                onChange={(event) => setReason(event.target.value)}
              />
            </Field>
          )}
          {error && <Alert tone="danger">{error}</Alert>}
          <div className="flex gap-3">
            <Button
              variant={pending === 'check-in' ? 'primary' : 'danger'}
              loading={busy}
              onClick={() => void confirmAction()}
            >
              Confirm {title(pending).toLowerCase()}
            </Button>
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setPending(undefined);
                setError('');
              }}
            >
              Keep record
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
export function ReadOnlyRows({
  heading,
  rows,
  columns,
}: {
  heading: string;
  rows: BackendRecord[];
  columns: string[];
}) {
  return (
    <Panel title={heading}>
      <DataTable
        columns={columns.map((key) => ({
          key,
          header: liveLabel(key),
          render: (row: BackendRecord) => <LiveValue value={row[key]} field={key} />,
        }))}
        rows={rows.map((row, index) => ({
          ...row,
          id: string(row.id ?? row.ticket_id ?? row.payment_id ?? index),
        }))}
        empty={<EmptyState compact title={`No ${heading.toLowerCase()}`} />}
      />
    </Panel>
  );
}
export function LiveHistory({
  resource,
  query,
  heading,
}: {
  resource: LiveResource;
  query: Record<string, string>;
  heading: string;
}) {
  const { backend } = useStaffSession();
  const [page, setPage] = useState(1);
  const result = useStaffData(
    (signal) => backend.list(resource, { ...query, page: String(page) }, signal),
    [resource, query, page],
  );
  return (
    <Panel title={heading}>
      {result.error ? (
        <RequestError error={result.error} retry={result.refresh} />
      ) : !result.data ? (
        <Loading />
      ) : (
        <>
          <LiveTable resource={resource} rows={result.data.rows} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-muted">{result.data.total} records</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                disabled={page === 1 || result.loading}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                disabled={page * result.data.pageSize >= result.data.total || result.loading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}
