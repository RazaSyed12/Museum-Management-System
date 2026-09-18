'use client';

import { Hero } from './Hero';
import { VisitStrip } from './VisitStrip';
import { Ticker } from './Ticker';
import { MembershipPromo } from './MembershipPromo';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Button } from '@/components/forms/Button';
import { CollectionCard } from '@/components/cards/CollectionCard';
import { EventCard } from '@/components/cards/EventCard';
import { RecommendationCard } from '@/components/cards/RecommendationCard';
import { useResponsiveMode } from '@/lib/useResponsiveMode';
import { useSiteNav } from '@/lib/nav';
import { collections, events, recommendedForYou, popularRightNow } from '@/lib/sample-data';

/* Ported from HomeScreen in design-system/ui_kits/visitor_site/HomeScreen.jsx.
   The preview harness's own `<Page>` wrapper (header/footer/mobile nav) is
   dropped here — that chrome now lives once in app/layout.tsx's SiteChrome,
   shared by every route instead of being re-assembled per screen. */
export function HomeContent() {
  const mode = useResponsiveMode('auto');
  const nav = useSiteNav();
  const signedIn = Boolean(nav.user);
  const rail = signedIn ? recommendedForYou : popularRightNow;

  return (
    <>
      <Hero mode={mode} go={nav.go} />
      <VisitStrip mode={mode} />
      <Ticker mode={mode} />

      <Section mode={mode} eyebrow="Collections" title="Featured collections"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={() => nav.go('Collections')}>All collections</Button>}>
        <Grid mode={mode} desktop={3} tablet={2} mobile={1}>
          {collections.slice(0, 3).map((c) => (
            <CollectionCard key={c.id} name={c.name} category={c.category} period={c.period}
              description={c.description} itemCount={c.items} tone={c.tone} onClick={() => nav.go('Collection')} />
          ))}
        </Grid>
      </Section>

      <Section mode={mode} tone="muted" eyebrow="What's on" title="Events and exhibitions"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={() => nav.go('Events')}>See what’s on</Button>}>
        <Grid mode={mode} desktop={3} tablet={2} mobile={1}>
          {events.slice(0, 3).map((e) => (
            <EventCard key={e.id} title={e.title} description={e.description} date={e.date} time={e.time}
              location={e.location} price={e.price} free={e.free} availability={e.availability} onBook={() => nav.go('Tickets')} />
          ))}
        </Grid>
      </Section>

      <Section mode={mode}
        eyebrow={signedIn ? 'For you' : 'Popular right now'}
        title={signedIn ? `Recommended for ${nav.user!.name.split(' ')[0]}` : 'What other visitors are exploring'}>
        <Grid mode={mode} desktop={2} tablet={2} mobile={1}>
          {rail.map((r) => <RecommendationCard key={r.title} {...r} reason={signedIn ? r.reason : undefined} />)}
        </Grid>
        {!signedIn && (
          <p style={{ marginTop: 'var(--space-6)', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); nav.go('SignIn'); }}>Sign in</a> to see recommendations based on what you have explored.
          </p>
        )}
      </Section>

      <MembershipPromo mode={mode} isMember={nav.isMember} go={nav.go} />
    </>
  );
}
