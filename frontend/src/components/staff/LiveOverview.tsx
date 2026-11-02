'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '@/lib/auth';
import { useStaffSession } from '@/lib/staff/session';
import { object, records, string, title } from '@/lib/staff/backend-resources';
import { date, localDay } from '@/lib/staff/format';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Field } from '@/components/forms/Field';
import { Select } from '@/components/forms/Select';
import { Alert } from '@/components/feedback/Alert';
import {
  Loading,
  PageHeading,
  Panel,
  RequestError,
  staffDataChanged,
  useStaffData,
} from './Shared';
import { LiveTable, LiveValue, liveLabel } from './LiveRecordFields';
import { ReadOnlyRows } from './LiveRecordDetail';

export function LiveDashboard() {
  const { backend } = useStaffSession();
  const result = useStaffData((signal) => backend.request('/admin/dashboard', { signal }));
  const refresh = result.refresh;
  useEffect(() => {
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, [refresh]);
  if (result.error) return <RequestError error={result.error} retry={refresh} />;
  if (!result.data) return <Loading />;
  const data = result.data;
  const period = object(data.period);
  const metrics = [
    ['Recorded visits this month', data.visits_current_period],
    ['Recorded visits last month', data.visits_previous_period],
    ['Tickets booked or held this month', data.booked_tickets_current_period],
    ['Active memberships', data.active_memberships],
  ] as const;
  return (
    <>
      <PageHeading
        title="Dashboard"
        description={`Museum activity for the Adelaide calendar month starting ${date(string(period.current_start))}.`}
      >
        <Button as="a" href="/staff/visits/new" iconLeft="plus">
          Record walk-in
        </Button>
        <Button variant="secondary" onClick={refresh}>
          Refresh
        </Button>
      </PageHeading>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <Panel key={label}>
            <p className="type-label text-muted">{label}</p>
            <p className="mt-3 text-3xl text-heading">
              {value === null || value === undefined ? '—' : Number(value).toLocaleString('en-AU')}
            </p>
          </Panel>
        ))}
      </div>
      <Panel title="Upcoming and ongoing events">
        <LiveTable
          resource="events"
          rows={records(data.upcoming_events)}
          columns={['name', 'start_at', 'capacity', 'booked_quantity']}
        />
        <p className="mt-3 text-sm text-muted">
          Booked quantities here count confirmed tickets. Allocation availability also accounts for
          reservations.
        </p>
      </Panel>
      <Panel title="Recent bookings">
        <LiveTable
          resource="bookings"
          rows={records(data.recent_bookings).map((row) => ({
            ...row,
            event: { name: row.event_name },
          }))}
          columns={[
            'booking_id',
            'event',
            'booking_status',
            'quantity',
            'total_amount',
            'booked_at',
          ]}
        />
      </Panel>
    </>
  );
}

const REPORTS = {
  visitors: {
    label: 'Visitors',
    description: 'Recorded attendance quantities, grouped by the Adelaide visit date.',
    columns: ['bucket', 'visitor_count'],
  },
  tickets: {
    label: 'Tickets',
    description: 'Confirmed tickets and unexpired reservations, cancellations and payments, grouped by booking date.',
    columns: ['event_name', 'booked_quantity', 'cancelled_quantity', 'revenue', 'refunded'],
  },
  memberships: {
    label: 'Memberships',
    description:
      'Membership starts in the selected period, with recorded purchase values. Current status counts are shown separately.',
    columns: ['plan_name', 'joins_count', 'purchase_revenue'],
  },
  events: {
    label: 'Events',
    description:
      'Events starting in the selected period, with confirmed tickets, attendance and cancelled bookings.',
    columns: [
      'event_name',
      'start_at',
      'capacity',
      'status',
      'booked_quantity',
      'cancelled_count',
      'checked_in_quantity',
    ],
  },
  collections: {
    label: 'Collections',
    description:
      'Current active digitised artefacts by category or historical period. This count is independent of collection catalogue totals and report dates.',
    columns: ['label', 'digitised_count'],
  },
} as const;
type ReportKind = keyof typeof REPORTS;
export function LiveReports() {
  const { backend, user } = useStaffSession();
  const [kind, setKind] = useState<ReportKind>('visitors');
  const [from, setFrom] = useState(`${localDay().slice(0, 7)}-01`);
  const [to, setTo] = useState(() => {
    const [year, month] = localDay().split('-').map(Number);
    return new Date(Date.UTC(year!, month!, 0)).toISOString().slice(0, 10);
  });
  const [group, setGroup] = useState('day');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const params = new URLSearchParams(
    kind === 'collections' ? { group } : { date_from: from, date_to: to },
  );
  if (kind === 'visitors') params.set('group', group);
  const query = params.toString();
  const result = useStaffData(
    (signal) => {
      if (kind !== 'collections' && (!from || !to || to < from))
        throw new Error('Choose a valid date range.');
      return backend.request(`/admin/reports/${kind}?${query}`, { signal });
    },
    [kind, query],
  );
  const description = REPORTS[kind];
  async function exportReport() {
    setExporting(true);
    setError('');
    try {
      const response = await backend.response(`/admin/reports/${kind}/export?${query}`);
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = `${kind}-report.csv`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not export the report.');
    } finally {
      setExporting(false);
    }
  }
  return (
    <>
      <PageHeading
        title="Reports"
        description="Museum reports use Adelaide calendar dates. Values come from recorded activity."
      >
        <Button variant="secondary" onClick={result.refresh}>Refresh</Button>
        {(user?.role === 'Admin' || user?.role === 'Manager') && (
          <Button
            loading={exporting}
            disabled={result.loading || Boolean(result.error)}
            onClick={() => void exportReport()}
          >
            Export CSV
          </Button>
        )}
      </PageHeading>
      <Panel>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Report" htmlFor="report-kind">
            <Select
              id="report-kind"
              value={kind}
              options={Object.entries(REPORTS).map(([value, report]) => ({
                value,
                label: report.label,
              }))}
              onChange={(event) => {
                const next = event.target.value as ReportKind;
                setKind(next);
                setGroup(next === 'collections' ? 'category' : 'day');
                setError('');
              }}
            />
          </Field>
          {kind !== 'collections' && (
            <>
              <Field label="From" htmlFor="report-from">
                <Input
                  id="report-from"
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                />
              </Field>
              <Field label="Until (inclusive)" htmlFor="report-until">
                <Input
                  id="report-until"
                  type="date"
                  value={to}
                  min={from}
                  onChange={(event) => setTo(event.target.value)}
                />
              </Field>
            </>
          )}
          {(kind === 'visitors' || kind === 'collections') && (
            <Field label="Group by" htmlFor="report-group">
              <Select
                id="report-group"
                value={group}
                options={(kind === 'visitors'
                  ? ['day', 'month', 'year']
                  : ['category', 'period']
                ).map((value) => ({ value, label: title(value) }))}
                onChange={(event) => setGroup(event.target.value)}
              />
            </Field>
          )}
        </div>
      </Panel>
      <p className="text-muted">{description.description}</p>
      {kind !== 'collections' && <p className="text-sm text-muted">Showing {from} through {to}, inclusive. Change these dates to include earlier or future activity.</p>}
      {error && <Alert tone="danger">{error}</Alert>}
      {result.error ? (
        <RequestError error={result.error} retry={result.refresh} />
      ) : result.loading || !result.data ? (
        <Loading />
      ) : (
        <>
          <ReadOnlyRows
            heading={`${description.label} report`}
            rows={records(result.data.rows)}
            columns={[...description.columns]}
          />
          {kind === 'visitors' && (
            <Panel title="Total recorded visitors">
              <p className="text-2xl">
                {Number(result.data.total_visitors).toLocaleString('en-AU')}
              </p>
            </Panel>
          )}
          {['totals', 'current_status_counts']
            .filter((key) => result.data![key])
            .map((key) => (
              <Panel
                key={key}
                title={key === 'totals' ? 'Totals' : 'Current membership status counts'}
              >
                <dl className="grid gap-4 md:grid-cols-3">
                  {Object.entries(object(result.data![key])).map(([field, value]) => (
                    <div key={field}>
                      <dt className="type-label text-muted">{liveLabel(field)}</dt>
                      <dd className="mt-2">
                        <LiveValue value={value} field={field} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </Panel>
            ))}
        </>
      )}
    </>
  );
}

export function LiveSettings() {
  const { backend, user, refresh } = useStaffSession();
  const auth = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function save(event: FormEvent, changePassword = false) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (changePassword) {
        await backend.request('/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({ current_password: password, new_password: newPassword }),
        });
        setPassword('');
        setNewPassword('');
        setMessage('Password changed. Other devices have been signed out.');
      } else {
        await backend.request('/me/profile', {
          method: 'PATCH',
          body: JSON.stringify({ full_name: name.trim() }),
        });
        auth.updateProfile({ name: name.trim() });
        await refresh();
        setMessage('Your name has been saved.');
        staffDataChanged();
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save changes.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        title="Settings"
        description="Your account and the museum’s supported operational settings."
      />
      {error && <Alert tone="danger">{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}
      <Panel title="Membership plans and locations">
        <p className="mb-4 text-muted">
          Manage plan prices, duration and benefits, and the locations used by catalogue records.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button as="a" href="/staff/plans">
            Membership plans
          </Button>
          <Button as="a" href="/staff/locations" variant="secondary">
            Locations
          </Button>
        </div>
      </Panel>
      <Panel title="Your profile">
        <form className="grid max-w-160 gap-4" onSubmit={(event) => void save(event)}>
          <p className="text-sm text-muted">
            {user?.email} · {user?.role}
          </p>
          <Field label="Full name" htmlFor="staff-profile-name">
            <Input
              id="staff-profile-name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <div>
            <Button type="submit" loading={busy}>
              Save name
            </Button>
          </div>
        </form>
      </Panel>
      <Panel title="Change password">
        <form className="grid max-w-160 gap-4" onSubmit={(event) => void save(event, true)}>
          <Field label="Current password" htmlFor="staff-current-password">
            <Input
              id="staff-current-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <Field
            label="New password"
            htmlFor="staff-new-password"
            hint="At least 10 characters. Other devices will be signed out."
          >
            <Input
              id="staff-new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              maxLength={72}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </Field>
          <div>
            <Button type="submit" loading={busy}>
              Change password
            </Button>
          </div>
        </form>
      </Panel>
      <Panel title="Museum details and booking defaults">
        <p className="text-muted">
          Museum contact details, logo, notification preferences, default admission pricing and
          cancellation rules cannot yet be changed through the portal. Membership plan pricing is
          managed above. Currency is AUD and times are shown in Australia/Adelaide.
        </p>
      </Panel>
    </>
  );
}
