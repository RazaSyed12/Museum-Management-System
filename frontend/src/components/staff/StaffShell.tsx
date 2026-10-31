'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Logo } from '@/components/foundation/Logo';
import { Icon } from '@/components/foundation/Icon';
import { IconButton } from '@/components/forms/IconButton';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Modal } from '@/components/feedback/Modal';
import { Alert } from '@/components/feedback/Alert';
import { cn } from '@/lib/cn';
import { can } from '@/lib/staff/permissions';
import { useStaffSession } from '@/lib/staff/session';
import { staffApi } from '@/lib/api/staff';
import type { SearchResult } from '@/lib/staff/types';
import { date } from '@/lib/staff/format';
import { Loading, RequestError, useStaffData } from './Shared';

const NAV = [
  ['Dashboard', '/staff', 'layout-dashboard'],
  ['Collections', '/staff/collections', 'library-big'],
  ['Artefacts', '/staff/items', 'gem'],
  ['Categories', '/staff/categories', 'tags'],
  ['Events & exhibitions', '/staff/events', 'calendar-days'],
  ['Tickets & bookings', '/staff/bookings', 'ticket'],
  ['Memberships', '/staff/memberships', 'award'],
  ['Visitors', '/staff/visitors', 'users'],
  ['Reports', '/staff/reports', 'chart-no-axes-combined'],
  ['User management', '/staff/users', 'shield-check'],
  ['Settings', '/staff/settings', 'settings'],
] as const;

export function StaffShell({ children }: { children: ReactNode }) {
  const { user, loading, error, refresh, logout, live, catalogue } = useStaffSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [actionError, setActionError] = useState('');
  const notifications = useStaffData(
    () => (user && !live ? staffApi.notifications() : Promise.resolve([])),
    [user?.id, pathname, live],
  );

  useEffect(() => {
    if (!loading && !error && !user) router.replace('/sign-in');
  }, [loading, error, user, router]);
  useEffect(() => {
    setMenu(false);
    setQuery('');
  }, [pathname]);
  useEffect(() => {
    const controller = new AbortController();
    if (!query.trim() || !user) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      setSearchError('');
      const search = live
        ? Promise.all(
            (['collections', 'events', 'categories'] as const).map(async (resource) => {
              const page = await catalogue.list(
                resource,
                { q: query.trim(), pageSize: 5 },
                controller.signal,
              );
              return page.items.map((row) => ({
                id: row.id,
                label: row.name,
                kind: resource,
                href: `/staff/${resource}/${row.id}`,
              }));
            }),
          ).then((groups) => groups.flat())
        : staffApi.search(query.trim(), controller.signal);
      search
        .then((rows) => {
          if (!controller.signal.aborted) setResults(rows);
        })
        .catch((err: unknown) => {
          if (!controller.signal.aborted)
            setSearchError(err instanceof Error ? err.message : 'Search failed.');
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, live, catalogue, user]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setQuery('');
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);

  if (loading)
    return (
      <div className="mx-auto max-w-200 p-8">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="p-8">
        <RequestError error={error} retry={() => void refresh()} />
        <div className="mt-4 flex gap-3">
          <Button as="a" href="/account" variant="secondary">
            Back to my account
          </Button>
          <Button variant="ghost" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
      </div>
    );
  if (!user)
    return (
      <div className="p-8">
        <Loading />
      </div>
    );
  const nav = (
    <>
      <div className="mb-8 flex items-center gap-3 px-3">
        <Logo variant="mark" height={36} />
        <span className="grid gap-1">
          <span className="font-display text-xl text-paper-50">Heritage Museum</span>
          <span className="type-eyebrow tracking-wider text-sand-300 uppercase">Staff portal</span>
        </span>
      </div>
      <nav aria-label="Staff navigation" className="grid gap-1">
        {NAV.filter(([, href]) => href !== '/staff/users' || can(user.role, 'users')).map(
          ([label, href, icon]) => {
            const active = href === '/staff' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenu(false)}
                aria-current={active ? 'page' : undefined}
                title={label}
                className={cn(
                  'flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold no-underline transition-control',
                  active
                    ? 'bg-olive-600 text-paper-50 hover:text-paper-50'
                    : 'text-paper-100/85 hover:bg-sand-300/10 hover:text-sand-300',
                )}
              >
                <Icon name={icon} size={18} />
                <span>{label}</span>
              </Link>
            );
          },
        )}
      </nav>
    </>
  );
  return (
    <div className="min-h-dvh bg-surface-staff">
      <a
        href="#staff-content"
        className="sr-only z-70 rounded-md bg-white p-3 text-heading focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-62 overflow-y-auto bg-surface-staff-nav px-3 py-7 lg:block">
        {nav}
      </aside>
      <div className="lg:pl-62">
        <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center gap-3 border-b border-line-subtle bg-surface-card px-5 py-3 md:px-8">
          <IconButton
            icon="menu"
            label="Open staff navigation"
            onClick={() => setMenu(true)}
            className="lg:hidden"
          />
          <div className="relative min-w-40 flex-1 md:max-w-110">
            <label htmlFor="portal-search" className="sr-only">
              Search the staff portal
            </label>
            <Input
              id="portal-search"
              iconLeft="search"
              type="search"
              placeholder={
                live
                  ? 'Search collections, events, categories…'
                  : 'Search visitors, events, bookings…'
              }
              maxLength={100}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-expanded={Boolean(query.trim())}
              aria-controls="staff-search-results"
            />
            {query.trim() && (
              <div
                id="staff-search-results"
                className="absolute top-full right-0 left-0 mt-2 max-h-96 overflow-auto rounded-lg border border-line-subtle bg-surface-card p-2 shadow-lg"
              >
                {searching ? (
                  <p role="status" className="p-3 text-sm">
                    Searching…
                  </p>
                ) : searchError ? (
                  <p role="alert" className="p-3 text-sm text-danger-700">
                    {searchError}
                  </p>
                ) : results.length ? (
                  results.map((r) => (
                    <Link
                      key={`${r.kind}-${r.id}`}
                      href={r.href}
                      onClick={() => setQuery('')}
                      className="block rounded-md p-3 text-heading no-underline hover:bg-paper-100"
                    >
                      <span className="type-label block">{r.label}</span>
                      <span className="type-body-sm text-muted">{r.kind}</span>
                    </Link>
                  ))
                ) : (
                  <p className="p-3 text-sm text-muted">No matching records.</p>
                )}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <IconButton
              icon="arrow-up-right"
              label="Visit the public site"
              onClick={() => router.push('/')}
            />
            {!live && (
              <div className="relative">
                <IconButton
                  icon="bell"
                  label={`Notifications, ${notifications.data?.filter((n) => !n.read).length ?? 0} unread`}
                  onClick={() => {
                    notifications.refresh();
                    setNotificationsOpen(true);
                  }}
                />
                {notifications.data?.some((n) => !n.read) && (
                  <span className="pointer-events-none absolute top-1 right-1 size-2 rounded-full bg-danger-600" />
                )}
              </div>
            )}
            <span className="grid size-10 place-items-center rounded-full bg-olive-100 font-semibold text-olive-700">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </span>
            <span className="hidden md:grid">
              <span className="type-label text-heading">{user.name}</span>
              <span className="text-xs text-muted">{user.role ?? 'Staff account'}</span>
            </span>
            <IconButton
              icon="log-out"
              label="Sign out of the staff portal"
              onClick={async () => {
                try {
                  await logout();
                  router.replace('/sign-in');
                } catch (err) {
                  setActionError(err instanceof Error ? err.message : 'Could not sign out.');
                }
              }}
            />
          </div>
        </header>
        <main id="staff-content" className="mx-auto grid max-w-360 gap-7 px-5 py-7 md:px-8 md:py-9">
          {actionError && (
            <Alert tone="danger" onDismiss={() => setActionError('')}>
              {actionError}
            </Alert>
          )}
          {children}
        </main>
      </div>
      <Modal open={menu} title="Staff navigation" onClose={() => setMenu(false)}>
        <div className="rounded-lg bg-green-900 p-5">{nav}</div>
      </Modal>
      <Modal
        open={notificationsOpen}
        title="Notifications"
        onClose={() => setNotificationsOpen(false)}
      >
        <div className="grid gap-3">
          {notifications.error ? (
            <RequestError error={notifications.error} retry={notifications.refresh} />
          ) : notifications.loading ? (
            <Loading />
          ) : notifications.data?.length ? (
            notifications.data.map((n) => (
              <button
                key={n.id}
                className={cn(
                  'cursor-pointer rounded-md border p-4 text-left',
                  n.read ? 'border-line-subtle' : 'border-olive-300 bg-olive-50',
                )}
                onClick={async () => {
                  try {
                    await staffApi.readNotification(n.id);
                    notifications.refresh();
                    setNotificationsOpen(false);
                    router.push(n.href);
                  } catch (err) {
                    setActionError(
                      err instanceof Error ? err.message : 'Could not open notification.',
                    );
                  }
                }}
              >
                <span className="type-label block text-heading">{n.title}</span>
                <span className="type-body-sm text-muted">{date(n.createdAt, true)}</span>
              </button>
            ))
          ) : (
            <p className="text-muted">You are up to date.</p>
          )}
          <Button variant="ghost" onClick={() => setNotificationsOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
