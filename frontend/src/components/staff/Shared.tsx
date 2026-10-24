'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert } from '@/components/feedback/Alert';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="type-eyebrow tracking-wider text-accent-fg uppercase">
          Heritage Museum · Staff portal
        </span>
        <h1 className="mt-2 text-3xl md:type-h1">{title}</h1>
        <p className="mt-2 max-w-160 text-muted">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-lg border border-line-subtle bg-surface-card shadow-xs',
        className,
      )}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle px-5 py-4">
          <h2 className="type-h3">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Status({ value }: { value: string }) {
  const tone = ['Published', 'Confirmed', 'Active', 'Paid'].includes(value)
    ? 'success'
    : ['Pending', 'Draft', 'Invited'].includes(value)
      ? 'warning'
      : ['Cancelled', 'Expired', 'Inactive', 'Refunded'].includes(value)
        ? 'danger'
        : 'neutral';
  return (
    <StatusBadge size="sm" tone={tone}>
      {value}
    </StatusBadge>
  );
}

export function Capacity({ booked, capacity }: { booked: number; capacity: number }) {
  return (
    <div className="min-w-24">
      <span className="type-body-sm">
        {booked} / {capacity} booked
      </span>
      <progress
        aria-label="Event capacity booked"
        value={booked}
        max={capacity || 1}
        className="mt-2 block h-1.5 w-full accent-olive-500"
      />
    </div>
  );
}

export function Loading() {
  return (
    <div role="status" aria-label="Loading staff portal" className="grid gap-4 py-8">
      <span className="type-label flex items-center gap-2 text-muted">
        <Icon name="loader-circle" size={18} className="animate-spin motion-reduce:animate-none" />
        Loading…
      </span>
      {[0, 1, 2].map((n) => (
        <div key={n} className="h-16 rounded-lg bg-paper-200 motion-safe:animate-pulse" />
      ))}
    </div>
  );
}

export function RequestError({ error, retry }: { error: string; retry: () => void }) {
  return (
    <Alert
      tone="danger"
      title="We could not load this view"
      action={
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      }
    >
      {error}
    </Alert>
  );
}

export function useStaffData<T>(
  load: (signal: AbortSignal) => Promise<T>,
  dependencies: readonly unknown[] = [],
) {
  const loader = useRef(load);
  loader.current = load;
  const dependencyKey = JSON.stringify(dependencies);
  const [data, setData] = useState<T>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((n) => n + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    loader
      .current(controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted)
          setError(err instanceof Error ? err.message : 'Please try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [dependencyKey, revision]);
  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener('staff-data-changed', onChange);
    window.addEventListener('focus', onChange);
    return () => {
      window.removeEventListener('staff-data-changed', onChange);
      window.removeEventListener('focus', onChange);
    };
  }, [refresh]);
  return { data, error, loading, refresh };
}

export function staffDataChanged() {
  window.dispatchEvent(new Event('staff-data-changed'));
}
