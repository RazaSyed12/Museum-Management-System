'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Grid } from '@/components/layout/Grid';
import { Tabs } from '@/components/navigation/Tabs';
import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { DataTable, type Column } from '@/components/data/DataTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SkeletonCard } from '@/components/feedback/Skeleton';
import { RecommendationCard } from '@/components/cards/RecommendationCard';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Checkbox } from '@/components/forms/Checkbox';
import { Alert } from '@/components/feedback/Alert';
import { useAuth } from '@/lib/auth';
import { useSiteNav } from '@/lib/nav';
import { useCurrency } from '@/lib/useCurrency';
import { listBookings, type Booking } from '@/lib/api/bookings';
import { recommendedForYou, hrefForRecommendation } from '@/lib/content';
import { useMyMembership } from '@/lib/useMyMembership';
import { formatMemberDate, membershipMockingDisabled } from '@/lib/api/membership';
import { ApiError } from '@/lib/api/client';
import { getToken } from '@/lib/api/authed';
import { profileMockingDisabled, saveFullName } from '@/lib/api/preferences';
import { useInterestsSync } from '@/lib/useInterestsSync';
import { PaymentHistory } from '@/components/account/PaymentHistory';
import { paymentsMockingDisabled } from '@/lib/api/payments';
import {
  getNewsletterStatus,
  newsletterMockingDisabled,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
} from '@/lib/api/newsletter';
import { useRecommendationRail } from '@/lib/useRecommendationRail';

type Tab = 'bookings' | 'payments' | 'saved' | 'interests' | 'settings';

export function ProfileScreen() {
  const auth = useAuth();
  useInterestsSync();
  const live = useRecommendationRail(1);
  const mine = useMyMembership();
  // Real backend: the plan and end date come from /me/membership; mock data keeps the placeholder.
  const memberLabel = membershipMockingDisabled()
    ? mine
      ? `${mine.plan.name} member${mine.endsAt ? ` · until ${formatMemberDate(mine.endsAt)}` : ''}`
      : 'Member'
    : 'Member · renews 4 Mar 2027';
  const nav = useSiteNav();
  const router = useRouter();
  const { format } = useCurrency();
  const columns: Column<Booking>[] = [
    { key: 'ref', header: 'Reference' },
    { key: 'event', header: 'Event' },
    { key: 'date', header: 'Date' },
    { key: 'qty', header: 'Tickets', align: 'right' },
    { key: 'totalValue', header: 'Total', align: 'right', render: (r) => (r.totalValue === 0 ? 'Free' : format(r.totalValue)) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge size="sm" tone={r.status === 'Confirmed' ? 'success' : 'danger'}>{r.status}</StatusBadge> },
    { key: 'actions', header: '', align: 'right', render: () => <Button size="sm" variant="ghost" iconLeft="qr-code">Ticket</Button> },
  ];
  const [tab, setTab] = useState<Tab>('bookings');
  const [name, setName] = useState(auth.user?.name ?? '');
  const [bookings, setBookings] = useState<Booking[]>();
  const [settingsStatus, setSettingsStatus] = useState<{ tone: 'success' | 'danger'; text: string }>();
  const [savingSettings, setSavingSettings] = useState(false);
  // Real newsletter backend: what the server has vs what the box says now.
  const [newsletterOnServer, setNewsletterOnServer] = useState<boolean>();
  const [newsletterWanted, setNewsletterWanted] = useState(false);
  const signedInId = auth.user?.id;

  useEffect(() => {
    if (auth.ready && !auth.user) router.replace('/sign-in');
  }, [auth.ready, auth.user, router]);

  useEffect(() => {
    if (auth.user) setName(auth.user.name);
  }, [auth.user]);

  useEffect(() => {
    if (!newsletterMockingDisabled() || !signedInId) return;
    const token = getToken();
    if (!token) return;
    let cancelled = false;
    getNewsletterStatus(token)
      .then((on) => {
        if (cancelled) return;
        setNewsletterOnServer(on);
        setNewsletterWanted(on);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [signedInId]);

  useEffect(() => {
    // A failed fetch shouldn't crash the whole profile page — just show no bookings.
    listBookings().then(setBookings).catch(() => setBookings([]));
  }, []);

  if (!auth.user) return null;
  const user = auth.user;

  async function saveSettings(e: FormEvent) {
    e.preventDefault();
    setSettingsStatus(undefined);
    const realProfile = profileMockingDisabled();
    const realNewsletter = newsletterMockingDisabled();
    if (!realProfile && !realNewsletter) {
      auth.updateProfile({ name });
      return;
    }
    const token = getToken();
    if (!token) {
      setSettingsStatus({ tone: 'danger', text: 'Your session has expired. Please sign in again.' });
      return;
    }
    setSavingSettings(true);
    try {
      if (realProfile) {
        const saved = await saveFullName(token, name.trim());
        auth.updateProfile({ name: saved });
      } else {
        auth.updateProfile({ name });
      }
      if (realNewsletter && newsletterOnServer !== undefined && newsletterWanted !== newsletterOnServer) {
        if (newsletterWanted) await subscribeToNewsletter(user.email, token);
        else await unsubscribeFromNewsletter(token);
        setNewsletterOnServer(newsletterWanted);
      }
      setSettingsStatus({ tone: 'success', text: 'Your changes have been saved.' });
    } catch (err) {
      setSettingsStatus({ tone: 'danger', text: err instanceof ApiError ? err.message : 'We couldn’t save your changes. Please try again.' });
    } finally {
      setSavingSettings(false);
    }
  }

  return (
    <>
      <div className="border-b border-line-subtle bg-surface-sunken">
        <Container className="py-8 md:py-12">
          <div className="flex flex-wrap items-center gap-5">
            <span className="grid size-18 flex-none place-items-center rounded-full bg-green-900 font-display text-3xl text-sand-300">{user.initials}</span>
            <div className="grid gap-1.5">
              <h1 className="text-4xl/tight">{user.name}</h1>
              <div className="flex flex-wrap gap-2">
                {auth.isStaff
                  ? <StatusBadge tone="info" icon="shield-check">Staff account</StatusBadge>
                  : auth.isMember
                  ? <StatusBadge tone="member">{memberLabel}</StatusBadge>
                  : <StatusBadge tone="neutral" icon="user">Registered visitor</StatusBadge>}
                <StatusBadge tone="neutral" icon="mail">{user.email}</StatusBadge>
              </div>
            </div>
            <div className="ml-auto flex gap-3">
              {auth.isStaff && <Button variant="secondary" iconLeft="layout-dashboard" onClick={() => router.push('/staff')}>Staff Portal</Button>}
              {!auth.isMember && <Button variant="accent" onClick={() => router.push('/membership')}>Become a member</Button>}
              <Button variant="secondary" onClick={nav.signOut}>Sign out</Button>
            </div>
          </div>
          <Tabs
            className="mt-8"
            value={tab}
            onChange={(v) => setTab(v as Tab)}
            items={[
              { value: 'bookings', label: 'Bookings', count: bookings?.length ?? 0 },
              ...(paymentsMockingDisabled() ? [{ value: 'payments', label: 'Payments' }] : []),
              { value: 'saved', label: 'Saved', count: 0 },
              { value: 'interests', label: 'Interests' },
              { value: 'settings', label: 'Settings' },
            ]}
          />
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        {tab === 'bookings' && (
          bookings ? <DataTable<Booking> caption="Your bookings" columns={columns} rows={bookings} /> : <SkeletonCard />
        )}

        {tab === 'payments' && <PaymentHistory />}

        {tab === 'saved' && (
          <EmptyState
            icon="bookmark"
            title="Nothing saved yet"
            description="Save an object or an exhibition and it will wait for you here."
            action={<Button variant="secondary" onClick={() => router.push('/collections')}>Browse collections</Button>}
          />
        )}

        {tab === 'interests' && (
          <div className="grid gap-8">
            <div className="grid gap-4">
              <h2 className="type-h2">Your interests</h2>
              <div className="flex flex-wrap items-center gap-2">
                {user.interests.length
                  ? user.interests.map((i) => <StatusBadge key={i} tone="olive">{i}</StatusBadge>)
                  : <p className="type-body text-muted">You haven&rsquo;t picked any yet.</p>}
                <Button size="sm" variant="ghost" iconLeft="pencil" onClick={() => router.push('/interests')}>Edit</Button>
              </div>
            </div>
            {(!live.real || (live.rail?.items.length ?? 0) > 0) && (
            <div className="grid gap-4">
              <h2 className="type-h2">Because of what you&rsquo;ve explored</h2>
              <Grid cols={2}>
                {live.real
                  ? (live.rail?.items ?? []).slice(0, 2).map((r) => (
                      <RecommendationCard key={r.key} title={r.title} kind={r.kind} image={r.image} tone={r.tone} href={r.href} reason={r.reason} />
                    ))
                  : recommendedForYou.slice(0, 2).map((r) => (
                      <RecommendationCard key={r.title} {...r} href={hrefForRecommendation(r)} />
                    ))}
              </Grid>
            </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <form className="grid max-w-130 gap-5" onSubmit={saveSettings}>
            {settingsStatus && (
              <Alert tone={settingsStatus.tone} onDismiss={() => setSettingsStatus(undefined)}>{settingsStatus.text}</Alert>
            )}
            <Field label="Full name" htmlFor="s-n">
              <Input id="s-n" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email address" htmlFor="s-e" hint="Contact support to change the address on your account.">
              <Input id="s-e" value={user.email} disabled />
            </Field>
            {newsletterMockingDisabled()
              ? <Checkbox id="s-nl" label="Email me what's on" description="Monthly exhibition news." checked={newsletterWanted} disabled={newsletterOnServer === undefined} onChange={(e) => setNewsletterWanted(e.target.checked)} />
              : <Checkbox id="s-nl" defaultChecked label="Email me what's on" description="Monthly exhibition news." />}
            <Checkbox id="s-rec" defaultChecked label="Use my activity for recommendations" description="Turn this off and we'll show popular content instead." />
            <div className="flex gap-3">
              <Button type="submit" loading={savingSettings} disabled={profileMockingDisabled() && !name.trim()}>Save changes</Button>
              <Button type="button" variant="ghost" onClick={() => setName(user.name)}>Cancel</Button>
            </div>
          </form>
        )}
      </Container>
    </>
  );
}
