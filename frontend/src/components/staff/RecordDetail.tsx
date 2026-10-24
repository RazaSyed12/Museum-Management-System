'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/forms/Button';
import { Field } from '@/components/forms/Field';
import { Alert } from '@/components/feedback/Alert';
import { Modal } from '@/components/feedback/Modal';
import { Media } from '@/components/foundation/Media';
import { DataTable } from '@/components/data/DataTable';
import { staffApi } from '@/lib/api/staff';
import { useStaffSession } from '@/lib/staff/session';
import { can } from '@/lib/staff/permissions';
import { date, money } from '@/lib/staff/format';
import type { References, Resource, StaffResources } from '@/lib/staff/types';
import { RECORDS } from './records';
import {
  Capacity,
  PageHeading,
  Panel,
  Status,
  staffDataChanged,
  useStaffData,
  Loading,
  RequestError,
} from './Shared';
import { displayRow } from './RecordList';

export function RecordDetail({
  resource,
  record,
  references,
  saved,
  refresh,
}: {
  resource: Resource;
  record: StaffResources[Resource];
  references: References;
  saved: boolean;
  refresh: () => void;
}) {
  const { user } = useStaffSession();
  const definition = RECORDS[resource];
  const row = displayRow(resource, record, references);
  const [action, setAction] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const history = useStaffData(
    async (signal) => {
      if (resource !== 'visitors' && resource !== 'events') return null;
      const bookings = await staffApi.list(
        'bookings',
        resource === 'visitors'
          ? { visitorId: record.id, pageSize: 20 }
          : { eventId: record.id, pageSize: 20 },
        signal,
      );
      const visits =
        resource === 'visitors'
          ? await staffApi.list('visits', { visitorId: record.id, pageSize: 20 }, signal)
          : undefined;
      return { bookings, visits };
    },
    [resource, record.id],
  );

  async function confirm() {
    setBusy(true);
    setError('');
    try {
      await staffApi.action(resource, record.id, action, { reason });
      setAction('');
      staffDataChanged();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete this action.');
    } finally {
      setBusy(false);
    }
  }
  const images = 'images' in record ? record.images : [];
  const editable =
    resource !== 'visits' &&
    !['Archived', 'Cancelled'].includes(row.status) &&
    !(resource === 'bookings' && row.checkedInAt);
  return (
    <>
      <Link href={`/staff/${resource}`} className="text-sm">
        Back to {definition.title.toLowerCase()}
      </Link>
      <PageHeading
        title={resource === 'bookings' ? record.id : row.label}
        description={definition.title}
      >
        {editable && (
          <Button as="a" href={`/staff/${resource}/${record.id}/edit`} iconLeft="pencil">
            Edit {definition.singular}
          </Button>
        )}
        {resource === 'events' && row.status !== 'Cancelled' && can(user?.role, 'archive') && (
          <Button variant="secondary" onClick={() => setAction('cancel')}>
            Cancel event
          </Button>
        )}
        {['collections', 'items', 'categories'].includes(resource) &&
          row.status !== 'Archived' &&
          can(user?.role, 'archive') && (
            <Button variant="secondary" onClick={() => setAction('archive')}>
              Archive
            </Button>
          )}
        {resource === 'bookings' && row.status !== 'Cancelled' && (
          <Button variant="secondary" onClick={() => setAction('cancel')}>
            Cancel booking
          </Button>
        )}
        {resource === 'bookings' && row.payment === 'Paid' && can(user?.role, 'refund') && (
          <Button variant="secondary" onClick={() => setAction('refund')}>
            Record demo refund
          </Button>
        )}
        {resource === 'bookings' && row.status === 'Confirmed' && !row.checkedInAt && (
          <Button variant="accent" onClick={() => setAction('check-in')}>
            Check in
          </Button>
        )}
        {resource === 'users' && row.status === 'Invited' && (
          <Button variant="secondary" onClick={() => setAction('invite')}>
            Request invitation
          </Button>
        )}
      </PageHeading>
      {saved && (
        <Alert tone="success" title="Changes saved">
          The record and related views have been updated.
        </Alert>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel title="Record details">
          <dl className="grid gap-5 md:grid-cols-2">
            {definition.fields.map((field) => {
              const value = row[field.key];
              let display =
                field.type === 'money'
                  ? money(Number(value))
                  : field.type === 'date' || field.type === 'datetime-local'
                    ? date(String(value), field.type === 'datetime-local')
                    : field.type === 'checkbox'
                      ? value
                        ? 'Yes'
                        : 'No'
                      : Array.isArray(value)
                        ? value.join(', ')
                        : String(value ?? '—');
              if (field.reference) {
                const linked = references[field.reference].find((r) => r.id === value);
                if (linked) display = 'name' in linked ? linked.name : linked.title;
              }
              if (field.key === 'eventId')
                display = references.events.find((e) => e.id === value)?.title ?? display;
              return (
                <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <dt className="type-eyebrow tracking-wide text-muted uppercase">{field.label}</dt>
                  <dd className="mt-1.5 whitespace-pre-wrap break-words text-heading">
                    {field.key === 'status' || field.key === 'payment' ? (
                      <Status value={display} />
                    ) : field.reference && value ? (
                      <Link href={`/staff/${field.reference}/${value}`}>{display}</Link>
                    ) : (
                      display || '—'
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
          {resource === 'bookings' && (
            <div className="mt-6 border-t border-line-subtle pt-5">
              <p className="font-display text-3xl text-heading">{money(Number(row.total))}</p>
              <p className="mt-2 text-sm text-muted">
                Booked {date(String(row.createdAt), true)} ·{' '}
                {row.checkedInAt
                  ? `Checked in ${date(String(row.checkedInAt), true)}`
                  : 'Not checked in'}
              </p>
              <Alert className="mt-4" tone="info">
                Payments and refunds are simulated in this prototype. No card is charged.
              </Alert>
            </div>
          )}
          {resource === 'visits' && (
            <p className="mt-4 text-sm text-muted">Recorded {date(String(row.visitedAt), true)}</p>
          )}
        </Panel>
        <div className="grid gap-5">
          {row.status && (
            <Panel title="Status">
              <Status value={row.status} />
              {resource === 'events' && (
                <div className="mt-4">
                  <Capacity booked={Number(row.booked)} capacity={Number(row.capacity)} />
                </div>
              )}
            </Panel>
          )}
          {images.length > 0 && (
            <Panel title="Images">
              <div className="grid gap-4">
                {images.map((image, i) => (
                  <div key={image.id}>
                    <Media src={image.url} alt={image.alt || row.label} ratio="4 / 3" />
                    <p className="mt-2 text-xs text-muted">
                      {i === 0 ? 'Primary · ' : ''}
                      {image.name}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
          {resource === 'visitors' && (
            <Panel title="Membership">
              {references.memberships
                .filter((m) => m.visitorId === record.id)
                .map((m) => (
                  <Link key={m.id} href={`/staff/memberships/${m.id}`} className="mb-3 block">
                    {m.type} · expires {date(m.expiryDate)}
                  </Link>
                ))}
              <Button variant="secondary" as="a" href="/staff/memberships/new">
                Add membership
              </Button>
            </Panel>
          )}
          {resource === 'memberships' && (
            <Panel title="Annual membership">
              <p className="font-display text-3xl text-heading">{money(Number(row.price))}</p>
              <p className="mt-3 text-sm text-muted">
                {row.type === 'Family'
                  ? 'Two adults and up to four children.'
                  : row.type === 'Joint'
                    ? 'Two named adults.'
                    : 'One named adult.'}{' '}
                Member event pricing applies while active.
              </p>
            </Panel>
          )}
        </div>
      </div>
      {(resource === 'visitors' || resource === 'events') && (
        <Panel
          title="Booking history"
          action={
            <Link
              href={`/staff/bookings?${resource === 'visitors' ? 'visitorId' : 'eventId'}=${record.id}`}
              className="text-sm"
            >
              View all
            </Link>
          }
        >
          {history.error ? (
            <RequestError error={history.error} retry={history.refresh} />
          ) : history.loading ? (
            <Loading />
          ) : (
            <DataTable
              rows={history.data?.bookings.items ?? []}
              columns={[
                {
                  key: 'id',
                  header: 'Booking',
                  render: (b) => <Link href={`/staff/bookings/${b.id}`}>{b.id}</Link>,
                },
                {
                  key: 'eventId',
                  header: 'Event',
                  render: (b) =>
                    references.events.find((e) => e.id === b.eventId)?.title ?? b.eventId,
                },
                { key: 'quantity', header: 'Tickets' },
                {
                  key: 'visitDate',
                  header: 'Visit date',
                  render: (b) => date(b.visitDate),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (b) => <Status value={b.status} />,
                },
              ]}
              empty={<p className="text-sm text-muted">No bookings recorded.</p>}
            />
          )}
        </Panel>
      )}
      {resource === 'visitors' && (
        <Panel title="Visit history">
          {history.data?.visits?.items.length ? (
            <DataTable
              rows={history.data.visits.items}
              columns={[
                {
                  key: 'visitedAt',
                  header: 'Visit',
                  render: (v) => date(v.visitedAt, true),
                },
                { key: 'quantity', header: 'Visitors' },
                {
                  key: 'bookingId',
                  header: 'Booking',
                  render: (v) => v.bookingId ?? 'Walk-in',
                },
              ]}
            />
          ) : (
            <p className="text-sm text-muted">No recorded visits yet.</p>
          )}
        </Panel>
      )}
      <Modal
        open={Boolean(action)}
        title={`${action === 'check-in' ? 'Check in' : action === 'refund' ? 'Record demo refund for' : action === 'invite' ? 'Request invitation for' : action === 'archive' ? 'Archive' : 'Cancel'} ${definition.singular}?`}
        onClose={() => {
          if (!busy) {
            setAction('');
            setError('');
          }
        }}
      >
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void confirm();
          }}
        >
          <p>
            {action === 'archive'
              ? 'This record will be archived. Its history will be preserved.'
              : action === 'check-in'
                ? 'Record these ticket holders as visitors today. A booking can only be checked in once.'
                : action === 'refund'
                  ? 'This records a simulated full refund and cancels the booking. No money is transferred.'
                  : action === 'invite'
                    ? 'Request an invitation email from the backend. The local demo records the request without sending an email.'
                    : resource === 'events'
                      ? 'The event will remain visible as cancelled. Related bookings will be cancelled and the backend must handle refunds and notifications.'
                      : 'The booking will be cancelled and its places released. Any paid amount needs a separate refund action.'}
          </p>
          {resource === 'events' && action === 'cancel' && (
            <Field label="Reason for cancellation" htmlFor="cancel-reason" required>
              <textarea
                id="cancel-reason"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-24 rounded-md border border-line-default p-3"
              />
            </Field>
          )}
          {error && <Alert tone="danger">{error}</Alert>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" disabled={busy} onClick={() => setAction('')}>
              Keep record
            </Button>
            <Button
              type="submit"
              variant={['cancel', 'archive', 'refund'].includes(action) ? 'danger' : 'primary'}
              loading={busy}
            >
              Confirm
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
