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
import { useSiteNav } from '@/lib/nav';
import { collections, events, recommendedForYou, popularRightNow, type Recommendation } from '@/lib/sample-data';

/* Ported from HomeScreen in design-system/ui_kits/visitor_site/HomeScreen.jsx.
   The preview harness's own `<Page>` wrapper (header/footer/mobile nav) is
   dropped here — that chrome now lives once in app/layout.tsx's SiteChrome,
   shared by every route instead of being re-assembled per screen. */

/** Collection recommendations link to the real page now that one exists;
 *  Event recommendations still fall back to RecommendationCard's default
 *  ('#') until Events has its own detail pages. */
function hrefFor(r: Recommendation): string | undefined {
  if (r.kind !== 'Collection') return undefined;
  const collection = collections.find((c) => c.name === r.title);
  return collection && `/collections/${collection.id}`;
}

export function HomeContent() {
  const nav = useSiteNav();
  const signedIn = Boolean(nav.user);
  const rail = signedIn ? recommendedForYou : popularRightNow;

  return (
    <>
      <Hero go={nav.go} />
      <VisitStrip />
      <Ticker />

      <Section eyebrow="Collections" title="Featured collections"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={() => nav.go('Collections')}>All collections</Button>}>
        <Grid cols={3}>
          {collections.slice(0, 3).map((c) => (
            <CollectionCard key={c.id} name={c.name} category={c.category} period={c.period}
              description={c.description} itemCount={c.items} tone={c.tone} href={`/collections/${c.id}`} />
          ))}
        </Grid>
      </Section>

      <Section tone="muted" eyebrow="What's on" title="Events and exhibitions"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={() => nav.go('Events')}>See what’s on</Button>}>
        <Grid cols={3}>
          {events.slice(0, 3).map((e) => (
            <EventCard key={e.id} title={e.title} description={e.description} date={e.date} time={e.time}
              location={e.location} price={e.price} free={e.free} availability={e.availability} onBook={() => nav.go('Tickets')} />
          ))}
        </Grid>
      </Section>

      <Section
        eyebrow={signedIn ? 'For you' : 'Popular right now'}
        title={signedIn ? `Recommended for ${nav.user!.name.split(' ')[0]}` : 'What other visitors are exploring'}>
        <Grid cols={2}>
          {rail.map((r) => <RecommendationCard key={r.title} {...r} reason={signedIn ? r.reason : undefined} href={hrefFor(r)} />)}
        </Grid>
        {!signedIn && (
          <p className="type-body-sm mt-6 text-muted">
            <a href="#" onClick={(e) => { e.preventDefault(); nav.go('SignIn'); }}>Sign in</a> to see recommendations based on what you have explored.
          </p>
        )}
      </Section>

      <MembershipPromo isMember={nav.isMember} go={nav.go} />
    </>
  );
}
