'use client';

import { useEffect, useState } from 'react';
import { DataTable, type Column } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Alert } from '@/components/feedback/Alert';
import { SkeletonCard } from '@/components/feedback/Skeleton';
import { getToken } from '@/lib/api/authed';
import { listMyPayments, type PaymentRow, type PaymentStatus } from '@/lib/api/payments';
import { money } from '@/lib/ticketing';

const MUSEUM_TIMEZONE = 'Australia/Adelaide'; // matches lib/api/events.ts

const STATUS: Record<PaymentStatus, { label: string; tone: 'success' | 'danger' | 'warning' | 'neutral' }> = {
  completed: { label: 'Paid', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
  pending: { label: 'Pending', tone: 'warning' },
  refund_pending: { label: 'Refund pending', tone: 'warning' },
  refunded: { label: 'Refunded', tone: 'neutral' },
};

function when(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { timeZone: MUSEUM_TIMEZONE, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

const COLUMNS: Column<PaymentRow>[] = [
  { key: 'when', header: 'Date', render: (r) => when(r.when) },
  { key: 'what', header: 'For' },
  { key: 'reference', header: 'Reference', render: (r) => r.reference ?? '—' },
  { key: 'amount', header: 'Amount', align: 'right', render: (r) => (r.amount === 0 ? 'Free' : money(r.amount, 'AUD')) },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <StatusBadge size="sm" tone={STATUS[r.status].tone}>
        {STATUS[r.status].label}
      </StatusBadge>
    ),
  },
];

/** Every payment attempt on the signed-in account, newest first (real backend only). */
export function PaymentHistory() {
  const [rows, setRows] = useState<PaymentRow[]>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setRows([]);
      return;
    }
    let cancelled = false;
    listMyPayments(token)
      .then((r) => !cancelled && setRows(r))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return <Alert tone="danger" title="We couldn’t load your payments">Please refresh the page in a moment.</Alert>;
  if (!rows) return <SkeletonCard />;
  if (rows.length === 0) {
    return <EmptyState icon="receipt" title="No payments yet" description="Tickets and memberships you pay for will be listed here." />;
  }
  return <DataTable<PaymentRow> caption="Your payments" columns={COLUMNS} rows={rows} />;
}
