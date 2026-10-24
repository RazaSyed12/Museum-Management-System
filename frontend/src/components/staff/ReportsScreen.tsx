'use client';

import { useState } from 'react';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Tabs } from '@/components/navigation/Tabs';
import { DataTable } from '@/components/data/DataTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { staffApi } from '@/lib/api/staff';
import { useStaffSession } from '@/lib/staff/session';
import { can } from '@/lib/staff/permissions';
import { downloadCsv, localDay, money } from '@/lib/staff/format';
import type { ReportKind, ReportRow } from '@/lib/staff/types';
import { Loading, PageHeading, Panel, RequestError, useStaffData } from './Shared';

export function ReportsScreen() {
  const { user } = useStaffSession();
  const [kind, setKind] = useState<ReportKind>('visitors');
  const [from, setFrom] = useState(`${localDay().slice(0, 7)}-01`);
  const [to, setTo] = useState(localDay());
  const [group, setGroup] = useState('day');
  const [catalogueGroup, setCatalogueGroup] = useState('category');
  const { data, error, loading, refresh } = useStaffData(
    (signal) =>
      staffApi.report(kind, from, to, signal, kind === 'collections' ? catalogueGroup : undefined),
    [kind, from, to, catalogueGroup],
  );
  const grouped = new Map<string, ReportRow>();
  for (const row of data?.rows ?? []) {
    const key =
      kind === 'visitors'
        ? group === 'year'
          ? row.label.slice(0, 4)
          : group === 'month'
            ? row.label.slice(0, 7)
            : row.label
        : row.id;
    const previous = grouped.get(key);
    if (previous) {
      previous.count += row.count;
      previous.revenue += row.revenue;
    } else
      grouped.set(key, {
        ...row,
        id: key,
        label: kind === 'visitors' ? key : row.label,
      });
  }
  const rows = [...grouped.values()];
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <>
      <PageHeading
        title="Reports"
        description="A clear view of museum activity. Recorded visits count attendance, rather than registered accounts."
      >
        {can(user?.role, 'export') && (
          <Button
            variant="secondary"
            iconLeft="download"
            disabled={loading || !data || Boolean(error)}
            onClick={() =>
              downloadCsv(
                `heritage-${kind}-${from}-${to}.csv`,
                [
                  'Group',
                  data?.label ?? 'Count',
                  'Revenue (AUD)',
                  'Capacity',
                  'Attendance',
                  'Cancelled tickets',
                  'Active',
                  'Expired',
                  'Pending',
                ],
                rows.map((r) => [
                  r.label,
                  r.count,
                  (r.revenue / 100).toFixed(2),
                  r.capacity ?? '',
                  r.attendance ?? '',
                  r.cancelled ?? '',
                  r.active ?? '',
                  r.expired ?? '',
                  r.pending ?? '',
                ]),
              )
            }
          >
            Export CSV
          </Button>
        )}
      </PageHeading>
      <Tabs
        items={[
          { value: 'visitors', label: 'Visitors' },
          { value: 'tickets', label: 'Tickets & revenue' },
          { value: 'memberships', label: 'Memberships' },
          { value: 'events', label: 'Events' },
          { value: 'collections', label: 'Collections' },
        ]}
        value={kind}
        onChange={(value) => setKind(value as ReportKind)}
      />
      <Panel>
        <div className="flex flex-wrap items-end gap-4">
          <label className="grid gap-2 text-sm text-heading">
            From
            <Input
              type="date"
              max={to}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              disabled={kind === 'collections'}
            />
          </label>
          <label className="grid gap-2 text-sm text-heading">
            To
            <Input
              type="date"
              min={from}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={kind === 'collections'}
            />
          </label>
          {kind === 'visitors' && (
            <label className="grid gap-2 text-sm text-heading">
              Group visits by
              <Select
                options={[
                  { value: 'day', label: 'Day' },
                  { value: 'month', label: 'Month' },
                  { value: 'year', label: 'Year' },
                ]}
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
            </label>
          )}
          {kind === 'collections' && (
            <label className="grid gap-2 text-sm text-heading">
              Group artefacts by
              <Select
                options={[
                  { value: 'category', label: 'Category' },
                  { value: 'period', label: 'Historical period' },
                ]}
                value={catalogueGroup}
                onChange={(e) => setCatalogueGroup(e.target.value)}
              />
            </label>
          )}
          <p className="pb-3 text-sm text-muted">
            {kind === 'collections'
              ? 'Current catalogue totals.'
              : 'Date boundaries use Adelaide time.'}
          </p>
        </div>
      </Panel>
      {error ? (
        <RequestError error={error} retry={refresh} />
      ) : loading ? (
        <Loading />
      ) : (
        data && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Panel title={data.label}>
                <p className="font-display text-4xl text-heading">
                  {data.total.toLocaleString('en-AU')}
                </p>
              </Panel>
              {!['visitors', 'collections'].includes(kind) && (
                <Panel title="Recorded revenue">
                  <p className="font-display text-4xl text-heading">{money(data.revenue)}</p>
                  <p className="mt-2 text-sm text-muted">
                    Prototype payments only. Refunded amounts are excluded.
                  </p>
                </Panel>
              )}
            </div>
            <Panel title={kind === 'visitors' ? 'Visits over time' : 'Activity by group'}>
              <div className="grid gap-4">
                {rows.some((r) => r.count > 0) ? (
                  rows.map((row) => (
                    <div key={row.id} className="grid gap-2 md:grid-cols-[220px_1fr_70px]">
                      <span className="text-sm text-heading">{row.label}</span>
                      <meter
                        aria-label={`${row.label}: ${row.count}`}
                        min={0}
                        max={max}
                        value={row.count}
                        className="h-7 w-full accent-olive-500"
                      />
                      <span className="text-sm tabular-nums text-heading md:text-right">
                        {row.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No activity in this period"
                    description="Try a wider date range or record a visit to begin."
                  />
                )}
              </div>
            </Panel>
            <Panel title="Report details">
              <DataTable
                rows={rows}
                columns={[
                  {
                    key: 'label',
                    header: kind === 'visitors' ? 'Period' : 'Group',
                  },
                  { key: 'count', header: data.label, align: 'right' },
                  ...(!['visitors', 'collections'].includes(kind)
                    ? [
                        {
                          key: 'revenue',
                          header: 'Revenue',
                          align: 'right' as const,
                          render: (r: (typeof rows)[number]) => money(r.revenue),
                        },
                      ]
                    : []),
                  ...(kind === 'memberships'
                    ? [
                        {
                          key: 'active',
                          header: 'Active now',
                          align: 'right' as const,
                        },
                        {
                          key: 'expired',
                          header: 'Expired now',
                          align: 'right' as const,
                        },
                        {
                          key: 'pending',
                          header: 'Pending',
                          align: 'right' as const,
                        },
                      ]
                    : []),
                  ...(['tickets', 'events'].includes(kind)
                    ? [
                        {
                          key: 'cancelled',
                          header: 'Cancelled tickets',
                          align: 'right' as const,
                        },
                      ]
                    : []),
                  ...(kind === 'events'
                    ? [
                        {
                          key: 'capacity',
                          header: 'Capacity',
                          align: 'right' as const,
                        },
                        {
                          key: 'attendance',
                          header: 'Attendance',
                          render: (r: (typeof rows)[number]) =>
                            r.count
                              ? `${Math.round(((r.attendance ?? 0) / r.count) * 100)}% checked in`
                              : 'No booked tickets',
                        },
                      ]
                    : []),
                ]}
              />
            </Panel>
          </>
        )
      )}
    </>
  );
}
