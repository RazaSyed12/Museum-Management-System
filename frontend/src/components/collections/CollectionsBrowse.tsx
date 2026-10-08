'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/forms/Button';
import { SearchField } from '@/components/forms/SearchField';
import { Icon } from '@/components/foundation/Icon';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Pagination } from '@/components/navigation/Pagination';
import { FilterPanel } from '@/components/data/FilterPanel';
import { Drawer } from '@/components/feedback/Drawer';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SkeletonCard } from '@/components/feedback/Skeleton';
import { Container } from '@/components/layout/Container';
import { Grid } from '@/components/layout/Grid';
import { CollectionCard } from '@/components/cards/CollectionCard';
import { listCollections, listCategories } from '@/lib/api/collections';
import type { Collection } from '@/lib/sample-data';

/* Three simplifications here, all because there's no real backend yet:
   - Only the Category filter is wired up. The source also renders a Period
     group, but its period buckets ("Prehistoric", "Ancient", ...) don't map
     cleanly onto the real `collection.period` values ("Pleistocene",
     "Roman–Georgian", ...) — inventing an era-bucketing scheme felt more
     like fabricating data than porting a design.
   - Sort is "Most popular" (the curated order in sample-data.ts) and "A–Z"
     only, since "Recently added" / "Oldest first" need an added-date field
     that doesn't exist. The source's second Select next to the search bar
     duplicated the sidebar's sort control — dropped as an oversight, not a
     deliberate feature.
   - listCollections is asked for everything matching the current filters
     (a high pageSize) and paged client-side below, because the mobile
     "load more" button needs the same filtered set sliced two ways. A real
     paginated backend will need this reworked to fetch one page at a time. */
const PAGE_SIZE = 6;
const SORT_OPTIONS = ['Most popular', 'A–Z'];

export function CollectionsBrowse() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState(SORT_OPTIONS[0]!);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Collection[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounce free-text search so it doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Category list + per-category counts for the filter sidebar: fetched
  // unfiltered, once, independent of the visitor's current search/filters.
  useEffect(() => {
    listCategories().then(setCategoryOptions);
    listCollections({ pageSize: 999 }).then((r) => {
      const counts: Record<string, number> = {};
      for (const c of r.items) counts[c.category] = (counts[c.category] ?? 0) + 1;
      setCategoryCounts(counts);
    });
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listCollections({
      q: debouncedQuery || undefined,
      category: selectedCategories.length ? selectedCategories : undefined,
      sort: sort === 'A–Z' ? 'az' : 'popular',
      pageSize: 999,
    }).then((r) => {
      if (!active) return;
      setResults(r.items);
      setTotal(r.total);
      setLoading(false);
    });
    return () => { active = false; };
  }, [debouncedQuery, selectedCategories, sort]);

  const toggleCategory = (value: string) => {
    setSelectedCategories((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));
    setPage(1);
  };
  const clearFilters = () => { setSelectedCategories([]); setPage(1); };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const loadMoreResults = results.slice(0, page * PAGE_SIZE);

  const filterPanel = (
    <FilterPanel
      groups={[{ title: 'Category', options: categoryOptions.map((c) => ({ value: c, label: c, count: categoryCounts[c] ?? 0 })) }]}
      selected={{ Category: selectedCategories }}
      onToggle={(_group, value) => toggleCategory(value)}
      activeCount={selectedCategories.length}
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
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Collections' }]} className="mb-4" />
          <h1 className="mb-3 text-3xl/[1.1] md:type-h1">Collections</h1>
          <p className="type-body mb-6 max-w-140">
            Eight permanent collections, from the Pleistocene to the nineteenth century. Filter by category to narrow things down.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <SearchField
              id="col-search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              onClear={() => setQuery('')}
              placeholder="Search collections"
              className="max-w-105 flex-[1_1_280px]"
            />
            <Button variant="secondary" iconLeft="sliders-horizontal" onClick={() => setDrawerOpen(true)} className="lg:hidden">
              Filters{selectedCategories.length ? ` (${selectedCategories.length})` : ''}
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[248px_1fr]">
          <div className="sticky top-25 hidden lg:block">{filterPanel}</div>
          <div className="grid gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="type-body-sm text-muted">
                {loading ? 'Searching…' : `Showing ${total} collection${total === 1 ? '' : 's'}`}
              </span>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCategory(c)}
                      className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-pill border border-olive-300 bg-olive-50 px-2.5 font-body text-xs leading-none font-semibold text-olive-700"
                    >
                      {c}
                      <Icon name="x" size={12} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <Grid cols={3}>{Array.from({ length: PAGE_SIZE }, (_, i) => <SkeletonCard key={i} />)}</Grid>
            ) : results.length ? (
              <Grid cols={3}>
                {pageResults.map((c) => (
                  <CollectionCard key={c.id} name={c.name} category={c.category} period={c.period}
                    description={c.description} itemCount={c.items} tone={c.tone} href={`/collections/${c.id}`} />
                ))}
              </Grid>
            ) : (
              <EmptyState title="No collections match your search" description="Try a different word, or clear your filters."
                action={<Button variant="secondary" onClick={() => { setQuery(''); clearFilters(); }}>Clear everything</Button>} />
            )}

            {!loading && total > PAGE_SIZE && (
              <Pagination page={page} pages={pages} onChange={setPage} className="hidden justify-center lg:flex" />
            )}
            {!loading && loadMoreResults.length < total && (
              <Pagination
                showLoadMore
                onLoadMore={() => setPage((p) => p + 1)}
                resultLabel={`Showing ${loadMoreResults.length} of ${total} collections`}
                className="lg:hidden"
              />
            )}
          </div>
        </div>
      </Container>

      <Drawer open={drawerOpen} side="bottom" title="Filter collections" onClose={() => setDrawerOpen(false)}
        footer={<><Button variant="ghost" fullWidth onClick={clearFilters}>Clear all</Button><Button fullWidth onClick={() => setDrawerOpen(false)}>Show {total} results</Button></>}>
        {filterPanel}
      </Drawer>
    </>
  );
}
