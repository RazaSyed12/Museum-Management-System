'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/forms/Button';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Pagination } from '@/components/navigation/Pagination';
import { FilterPanel } from '@/components/data/FilterPanel';
import { Drawer } from '@/components/feedback/Drawer';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SkeletonCard } from '@/components/feedback/Skeleton';
import { Container } from '@/components/layout/Container';
import { EventCard } from '@/components/cards/EventCard';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { useSiteNav } from '@/lib/nav';
import { listEvents, type MuseumEvent } from '@/lib/api/events';

/* Two simplifications, both because the data model doesn't support more:
   - No "type" filter (Exhibition / Talk / Workshop / ...) — events have no
     category field, and inventing one would be fabricating data, not
     porting a design.
   - No "When" filter (This week / This month / ...) — same reasoning as
     Collections dropping its Period filter: the bucketing would be
     invented, not derived.
   Cancelled events are never hidden by a filter — Price/Availability only
   narrow which bookable events show; a cancellation is always visible. */
const PAGE_SIZE = 6;
const SORT_OPTIONS = ['Soonest first', 'Price: low to high'];

export function EventsBrowse() {
  const nav = useSiteNav();
  const [events, setEvents] = useState<MuseumEvent[]>();
  const [selected, setSelected] = useState<Record<string, string[]>>({ Price: [], Availability: [] });
  const [sort, setSort] = useState(SORT_OPTIONS[0]!);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    listEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  const activeCount = selected.Price!.length + selected.Availability!.length;
  const memberPriceCount = events?.filter((e) => e.memberPrice != null).length ?? 0;

  const results = useMemo(() => {
    if (!events) return [];
    let r = events.filter((e) => {
      if (e.availability === 'cancelled') return true;
      if (selected.Price!.length) {
        const matches = selected.Price!.includes(e.free ? 'Free' : 'Paid');
        if (!matches) return false;
      }
      if (selected.Availability!.length) {
        const label = e.availability === 'available' ? 'Available' : e.availability === 'limited' ? 'Limited' : 'Sold out';
        if (!selected.Availability!.includes(label)) return false;
      }
      return true;
    });
    r = [...r].sort((a, b) => (sort === 'Soonest first' ? +new Date(a.date) - +new Date(b.date) : a.priceValue - b.priceValue));
    return r;
  }, [events, selected, sort]);

  const toggle = (group: string, value: string) => {
    setSelected((cur) => ({ ...cur, [group]: cur[group]!.includes(value) ? cur[group]!.filter((v) => v !== value) : [...cur[group]!, value] }));
    setPage(1);
  };
  const clearFilters = () => { setSelected({ Price: [], Availability: [] }); setPage(1); };

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const loadMoreResults = results.slice(0, page * PAGE_SIZE);

  const filterPanel = (
    <FilterPanel
      groups={[
        { title: 'Price', options: ['Free', 'Paid'] },
        { title: 'Availability', options: ['Available', 'Limited', 'Sold out'] },
      ]}
      selected={selected}
      onToggle={toggle}
      activeCount={activeCount}
      onClear={clearFilters}
      sortOptions={SORT_OPTIONS}
      sort={sort}
      onSort={(v) => { setSort(v); setPage(1); }}
    />
  );

  return (
    <>
      <div className="border-b border-line-subtle bg-surface-sunken">
        <Container className="py-6 md:py-10">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: "What's on" }]} className="mb-4" />
          <h1 className="mb-3 text-3xl/[1.1] md:type-h1">What&rsquo;s on</h1>
          <p className="type-body mb-6 max-w-140">
            Exhibitions, talks, workshops and late openings. Members book from a reserved allocation.
          </p>
          <Button variant="secondary" iconLeft="sliders-horizontal" onClick={() => setDrawerOpen(true)} className="lg:hidden">
            Filters{activeCount ? ` (${activeCount})` : ''}
          </Button>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[248px_1fr]">
          <div className="sticky top-25 hidden lg:block">{filterPanel}</div>
          <div className="grid gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="type-body-sm text-muted">
                {events ? `${results.length} event${results.length === 1 ? '' : 's'}` : 'Loading…'}
              </span>
              {nav.isMember && !!memberPriceCount && (
                <StatusBadge tone="member">Member price on {memberPriceCount} event{memberPriceCount === 1 ? '' : 's'}</StatusBadge>
              )}
            </div>

            {!events ? (
              <div className="grid gap-5">{Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)}</div>
            ) : results.length ? (
              <div className="grid gap-5">
                {pageResults.map((e) => (
                  <EventCard key={e.id} layout="horizontal" title={e.title} description={e.description} date={e.date} time={e.time}
                    location={e.location} priceValue={e.priceValue} memberPrice={e.memberPrice} free={e.free} availability={e.availability}
                    detailHref={`/events/${e.id}`} href={`/tickets/${e.id}`} />
                ))}
              </div>
            ) : (
              <EmptyState title="No events match your filters" description="Try clearing a filter to see more."
                action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>} />
            )}

            {!!events && results.length > PAGE_SIZE && (
              <Pagination page={page} pages={pages} onChange={setPage} className="hidden justify-center lg:flex" />
            )}
            {!!events && loadMoreResults.length < results.length && (
              <Pagination showLoadMore onLoadMore={() => setPage((p) => p + 1)} resultLabel={`Showing ${loadMoreResults.length} of ${results.length} events`} className="lg:hidden" />
            )}
          </div>
        </div>
      </Container>

      <Drawer open={drawerOpen} side="bottom" title="Filter events" onClose={() => setDrawerOpen(false)}
        footer={<><Button variant="ghost" fullWidth onClick={clearFilters}>Clear all</Button><Button fullWidth onClick={() => setDrawerOpen(false)}>Show {results.length} events</Button></>}>
        {filterPanel}
      </Drawer>
    </>
  );
}
