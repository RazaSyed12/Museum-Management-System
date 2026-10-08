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
import { useAuth } from '@/lib/auth';
import { useSiteNav } from '@/lib/nav';
import { listBookings } from '@/lib/api/bookings';
import { recommendedForYou, hrefForRecommendation, type Booking } from '@/lib/sample-data';

type Tab = 'bookings' | 'saved' | 'interests' | 'settings';

const COLUMNS: Column<Booking>[] = [
  { key: 'ref', header: 'Reference' },
  { key: 'event', header: 'Event' },
  { key: 'date', header: 'Date' },
  { key: 'qty', header: 'Tickets', align: 'right' },
  { key: 'total', header: 'Total', align: 'right' },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge size="sm" tone={r.status === 'Confirmed' ? 'success' : 'danger'}>{r.status}</StatusBadge> },
  { key: 'actions', header: '', align: 'right', render: () => <Button size="sm" variant="ghost" iconLeft="qr-code">Ticket</Button> },
];

export function ProfileScreen() {
  const auth = useAuth();
  const nav = useSiteNav();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('bookings');
  const [name, setName] = useState(auth.user?.name ?? '');
  const [bookings, setBookings] = useState<Booking[]>();

  useEffect(() => {
    if (auth.ready && !auth.user) router.replace('/sign-in');
  }, [auth.ready, auth.user, router]);

  useEffect(() => {
    if (auth.user) setName(auth.user.name);
  }, [auth.user]);

  useEffect(() => {
    listBookings().then(setBookings);
  }, []);

  if (!auth.user) return null;
  const user = auth.user;

  function saveSettings(e: FormEvent) {
    e.preventDefault();
    auth.updateProfile({ name });
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
                {auth.isMember
                  ? <StatusBadge tone="member">Member · renews 4 Mar 2027</StatusBadge>
                  : <StatusBadge tone="neutral" icon="user">Registered visitor</StatusBadge>}
                <StatusBadge tone="neutral" icon="mail">{user.email}</StatusBadge>
              </div>
            </div>
            <div className="ml-auto flex gap-3">
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
              { value: 'saved', label: 'Saved', count: 0 },
              { value: 'interests', label: 'Interests' },
              { value: 'settings', label: 'Settings' },
            ]}
          />
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        {tab === 'bookings' && (
          bookings ? <DataTable<Booking> caption="Your bookings" columns={COLUMNS} rows={bookings} /> : <SkeletonCard />
        )}

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
            <div className="grid gap-4">
              <h2 className="type-h2">Because of what you&rsquo;ve explored</h2>
              <Grid cols={2}>
                {recommendedForYou.slice(0, 2).map((r) => (
                  <RecommendationCard key={r.title} {...r} href={hrefForRecommendation(r)} />
                ))}
              </Grid>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <form className="grid max-w-130 gap-5" onSubmit={saveSettings}>
            <Field label="Full name" htmlFor="s-n">
              <Input id="s-n" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email address" htmlFor="s-e" hint="Contact support to change the address on your account.">
              <Input id="s-e" value={user.email} disabled />
            </Field>
            <Checkbox id="s-nl" defaultChecked label="Email me what's on" description="Monthly exhibition news." />
            <Checkbox id="s-rec" defaultChecked label="Use my activity for recommendations" description="Turn this off and we'll show popular content instead." />
            <div className="flex gap-3">
              <Button type="submit">Save changes</Button>
              <Button type="button" variant="ghost" onClick={() => setName(user.name)}>Cancel</Button>
            </div>
          </form>
        )}
      </Container>
    </>
  );
}
