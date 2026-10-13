'use client';

import { useState } from 'react';
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
import { collections, events, recommendedForYou, popularRightNow, type MuseumEvent } from '@/lib/sample-data';

/* Filter rows above the collections and events grids. Categories come from the
   data (staff-managed), capped so the row stays on one line on desktop. */
const COLLECTION_FILTERS = ['All', ...Array.from(new Set(collections.map((c) => c.category))).slice(0, 5)];

const EVENT_FILTERS: Record<string, (e: MuseumEvent) => boolean> = {
  All: () => true,
  Free: (e) => Boolean(e.free),
  'Members’ prices': (e) => e.memberPrice != null,
  Available: (e) => e.availability === 'available' || e.availability === 'limited',
};

/** The exhibition has its own hero slide, so the events grid lists everything else. */
const LISTED_EVENTS = events.filter((e) => e.id !== 'beneath');

/* Header/footer/mobile nav chrome lives once in app/layout.tsx's SiteChrome,
   shared by every route instead of being re-assembled per screen. */
export function HomeContent() {
  const nav = useSiteNav();
  const signedIn = Boolean(nav.user);
  const rail = signedIn ? recommendedForYou : popularRightNow;
  const [collectionFilter, setCollectionFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');

  const shownCollections = collections
    .filter((c) => collectionFilter === 'All' || c.category === collectionFilter)
    .slice(0, 3);
  const eventMatches = EVENT_FILTERS[eventFilter] ?? (() => true);
  const shownEvents = LISTED_EVENTS.filter(eventMatches).slice(0, 3);

  return (
    <>
      <Hero go={nav.go} />
      <PlanVisit onCheck={() => nav.go('Tickets')} />
      <VisitStrip />
      <Ticker />

      <Section eyebrow="Collections" title="Featured collections"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={() => nav.go('Collections')}>All collections</Button>}>
        <FilterPills
          label="Filter collections"
          options={COLLECTION_FILTERS}
          value={collectionFilter}
          onChange={setCollectionFilter}
          className="mb-6"
        />
        <Grid cols={3}>
          {shownCollections.map((c) => (
            <CollectionCard key={c.id} name={c.name} category={c.category} period={c.period}
              description={c.description} itemCount={c.items} tone={c.tone} onClick={() => nav.go('Collection')} />
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
              location={e.location} price={e.price} free={e.free} availability={e.availability} onBook={() => nav.go('Tickets')} />
          ))}
        </Grid>
      </Section>

      <Section
        eyebrow={signedIn ? 'For you' : 'Popular right now'}
        title={signedIn ? `Recommended for ${nav.user!.name.split(' ')[0]}` : 'What other visitors are exploring'}>
        <Grid cols={2}>
          {rail.map((r) => <RecommendationCard key={r.title} {...r} reason={signedIn ? r.reason : undefined} />)}
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
