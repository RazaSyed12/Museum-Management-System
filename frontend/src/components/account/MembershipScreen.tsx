'use client';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Icon } from '@/components/foundation/Icon';
import { useAuth } from '@/lib/auth';
import { useSiteNav } from '@/lib/nav';
import { cn } from '@/lib/cn';

const BENEFITS = [
  { icon: 'percent', title: 'Reduced ticket prices', body: 'Roughly a third off every ticketed event, applied automatically at checkout.' },
  { icon: 'bookmark-check', title: 'Reserved allocation', body: 'A block of tickets is held for members on every event until 48 hours before.' },
  { icon: 'clock-4', title: 'Early access', body: 'Book new exhibitions a week before general release.' },
  { icon: 'users', title: 'Bring a guest', body: 'One guest at the member price on every visit.' },
  { icon: 'coffee', title: 'Ten percent off the café and shop', body: 'Including the second-hand book room.' },
  { icon: 'mail', title: 'Members’ letter', body: 'A quarterly letter from the curators, printed and posted.' },
];

const PLANS = [
  { name: 'Individual', price: '£00', description: 'One named member' },
  { name: 'Joint', price: '£00', description: 'Two named members at one address' },
  { name: 'Family', price: '£00', description: 'Two adults and up to four children' },
];

export function MembershipScreen() {
  const auth = useAuth();
  const nav = useSiteNav();

  return (
    <>
      <div className="bg-surface-accent">
        <Container className="grid gap-4 py-10 md:py-16">
          <span className="type-eyebrow max-w-150 tracking-wider text-gold-700 uppercase">Membership</span>
          <h1 className="max-w-150 text-4xl/[1.05] md:text-5xl/[1.05]">Support the museum, see more of it</h1>
          <p className="type-body max-w-150 text-lg">
            Membership keeps the galleries free to enter and the conservation studio working. It also makes your own visits cheaper.
          </p>
          {auth.isMember ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StatusBadge tone="member">Active member since March 2024</StatusBadge>
              <Button variant="secondary" iconLeft="settings">Manage membership</Button>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => nav.setMember(true)}>Become a member</Button>
              <Button size="lg" variant="ghost" onClick={() => nav.go('Tickets')}>Just book a ticket</Button>
            </div>
          )}
        </Container>
      </div>

      <Section title="What membership includes">
        <Grid cols={3}>
          {BENEFITS.map((b) => (
            <Card key={b.title} className="grid content-start gap-3">
              <span className="grid size-10.5 place-items-center rounded-md bg-olive-50">
                <Icon name={b.icon} size={20} className="text-olive-600" />
              </span>
              <h3 className="type-h3 text-xl">{b.title}</h3>
              <p className="type-body-sm text-muted">{b.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section tone="muted" title="Choose a membership">
        <Grid cols={3}>
          {PLANS.map((p, i) => (
            <Card key={p.name} interactive className={cn('grid gap-4', i === 1 && 'border-2 border-olive-500')}>
              {i === 1 && <StatusBadge tone="olive" size="sm" icon="star">Most chosen</StatusBadge>}
              <h3 className="type-h3">{p.name}</h3>
              <span className="font-display text-3xl/none text-heading">
                {p.price}<span className="type-body-sm text-muted"> / year</span>
              </span>
              <p className="type-body-sm text-muted">{p.description}</p>
              <Button variant={i === 1 ? 'primary' : 'secondary'} fullWidth disabled={auth.isMember} onClick={() => nav.setMember(true)}>
                {auth.isMember ? 'You are a member' : `Choose ${p.name}`}
              </Button>
            </Card>
          ))}
        </Grid>
        <p className="type-body-sm mt-5 text-muted">Prices are placeholders pending the museum&rsquo;s 2027 rates.</p>
      </Section>
    </>
  );
}
