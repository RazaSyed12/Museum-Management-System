'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from './Hero';
import { PlanVisit } from './PlanVisit';
import { VisitStrip } from './VisitStrip';
import { Ticker } from './Ticker';
import { MembershipPromo } from './MembershipPromo';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Button } from '@/components/forms/Button';
import { FilterPills } from '@/components/forms/FilterPills';
import { EmptyState } from '@/components/feedback/EmptyState';
import { CollectionCard } from '@/components/cards/CollectionCard';
import { EventCard } from '@/components/cards/EventCard';
import { RecommendationCard } from '@/components/cards/RecommendationCard';
import { useSiteNav } from '@/lib/nav';
import { recommendedForYou, popularRightNow, hrefForRecommendation } from '@/lib/content';
import { toneForIndex } from '@/lib/tone';
import type { Collection } from '@/lib/api/collections';
import type { MuseumEvent } from '@/lib/api/events';

/* Ported from HomeScreen in design-system/ui_kits/visitor_site/HomeScreen.jsx.
   The preview harness's own `<Page>` wrapper (header/footer/mobile nav) is
   dropped here — that chrome now lives once in app/layout.tsx's SiteChrome,
   shared by every route instead of being re-assembled per screen.
   Collections/events are fetched by the page (a server component) and
   passed in full, since the filter pills below need the complete lists to
   filter against, not a pre-picked "featured 3" — recommendations stay a
   static editorial fixture for now, per API-REQUIREMENTS.md's "open for
   discussion, not blocking anything yet". */
export interface HomeContentProps {
  allCollections: Collection[];
  allEvents: MuseumEvent[];
}

/* Filter rows above the collections and events grids. Categories come from the
   data (staff-managed), capped so the row stays on one line on desktop. */
function collectionFilterOptions(collections: Collection[]) {
  return ['All', ...Array.from(new Set(collections.flatMap((c) => c.categories.map((cat) => cat.name)))).slice(0, 5)];
}

const EVENT_FILTERS: Record<string, (e: MuseumEvent) => boolean> = {
  All: () => true,
  Free: (e) => Boolean(e.free),
  'Members’ prices': (e) => e.memberPrice != null,
  Available: (e) => e.availability === 'available' || e.availability === 'limited',
};

export function HomeContent({ allCollections, allEvents }: HomeContentProps) {
  const nav = useSiteNav();
  const router = useRouter();
  const signedIn = Boolean(nav.user);
  const rail = signedIn ? recommendedForYou : popularRightNow;
  const [collectionFilter, setCollectionFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');

  // Same "soonest two" selection Hero uses, so the grid below doesn't repeat its slides.
  const heroEvents = [...allEvents]
    .filter((e) => e.availability !== 'cancelled')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 2);
  const exhibition = heroEvents[0];
  const heroEventIds = new Set(heroEvents.map((e) => e.id));
  const listedEvents = allEvents.filter((e) => !heroEventIds.has(e.id));

  const shownCollections = allCollections
    .filter((c) => collectionFilter === 'All' || c.categories.some((cat) => cat.name === collectionFilter))
    .slice(0, 3);
  const eventMatches = EVENT_FILTERS[eventFilter] ?? (() => true);
  const shownEvents = listedEvents.filter(eventMatches).slice(0, 3);

  return (
    <>
      <Hero go={nav.go} events={allEvents} />
      {exhibition && (
        <PlanVisit exhibitionPriceValue={exhibition.priceValue} exhibitionMemberPrice={exhibition.memberPrice} onCheck={(plan) => router.push(`/tickets/${exhibition.id}?general=${plan.visitors}`)} />
      )}
      <VisitStrip />
      <Ticker />

      <Section eyebrow="Collections" title="Featured collections"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={() => nav.go('Collections')}>All collections</Button>}>
        <FilterPills
          label="Filter collections"
          options={collectionFilterOptions(allCollections)}
          value={collectionFilter}
          onChange={setCollectionFilter}
          className="mb-6"
        />
        <Grid cols={3}>
          {shownCollections.map((c, i) => (
            <CollectionCard key={c.id} name={c.name} category={c.categories[0]?.name}
              description={c.description ?? undefined} tone={toneForIndex(i)} href={`/collections/${c.id}`} />
          ))}
        </Grid>
      </Section>

      <Section tone="muted" eyebrow="What's on" title="Events and exhibitions"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={() => nav.go('Events')}>See what’s on</Button>}>
        <FilterPills
          label="Filter events"
          options={Object.keys(EVENT_FILTERS)}
          value={eventFilter}
          onChange={setEventFilter}
          className="mb-6"
        />
        {shownEvents.length === 0 && (
          <EmptyState
            compact
            icon="calendar-x"
            title="No events match that filter"
            description="Try another group, or see everything that’s on."
            action={<Button variant="secondary" onClick={() => setEventFilter('All')}>Show all events</Button>}
          />
        )}
        <Grid cols={3}>
          {shownEvents.map((e) => (
            <EventCard key={e.id} title={e.title} description={e.description} date={e.date} time={e.time}
              location={e.location} priceValue={e.priceValue} memberPrice={e.memberPrice} free={e.free} availability={e.availability}
              detailHref={`/events/${e.id}`} href={`/tickets/${e.id}`} />
          ))}
        </Grid>
      </Section>

      <Section
        eyebrow={signedIn ? 'For you' : 'Popular right now'}
        title={signedIn ? `Recommended for ${nav.user!.name.split(' ')[0]}` : 'What other visitors are exploring'}>
        <Grid cols={2}>
          {rail.map((r) => <RecommendationCard key={r.title} {...r} reason={signedIn ? r.reason : undefined} href={hrefForRecommendation(r)} />)}
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
