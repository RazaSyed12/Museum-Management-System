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
import { toneForIndex } from '@/lib/tone';
import { listCollections, listCategories, type Collection, type Category } from '@/lib/api/collections';

/* No Period group (real Collection has no such field) and no "Most popular"
   sort (no real popularity data) — category/sort filter client-side instead. */
const PAGE_SIZE = 6;
const FETCH_LIMIT = 100;
const SORT_OPTIONS = ['A–Z', 'Recently added'];

export function CollectionsBrowse() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [sort, setSort] = useState(SORT_OPTIONS[0]!);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [all, setAll] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce free-text search so it doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    listCategories().then(setCategoryOptions).catch(() => setCategoryOptions([]));
  }, []);

  // Fetched unfiltered (just the free-text search, which the server does
  // support); category, sort, and paging all happen below against this set.
  useEffect(() => {
    let active = true;
    setLoading(true);
    listCollections({ q: debouncedQuery || undefined, limit: FETCH_LIMIT })
      .then((r) => {
        if (active) {
          setAll(r.items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setAll([]);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const categoryCounts: Record<string, number> = {};
  for (const c of all) for (const cat of c.categories) categoryCounts[cat.id] = (categoryCounts[cat.id] ?? 0) + 1;

  const filtered = (
    selectedCategoryIds.length
      ? all.filter((c) => c.categories.some((cat) => selectedCategoryIds.includes(cat.id)))
      : all
  ).toSorted((a, b) =>
    sort === 'A–Z' ? a.name.localeCompare(b.name) : b.createdAt.localeCompare(a.createdAt),
  );
  const total = filtered.length;

  const toggleCategory = (value: string) => {
    setSelectedCategoryIds((cur) =>
      cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
    );
    setPage(1);
  };
  const clearFilters = () => {
    setSelectedCategoryIds([]);
    setPage(1);
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageResults = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const loadMoreResults = filtered.slice(0, page * PAGE_SIZE);

  const filterPanel = (
    <FilterPanel
      groups={[
        {
          title: 'Category',
          options: categoryOptions.map((c) => ({
            value: c.id,
            label: c.name,
            count: categoryCounts[c.id] ?? 0,
          })),
        },
      ]}
      selected={{ Category: selectedCategoryIds }}
      onToggle={(_group, value) => toggleCategory(value)}
      activeCount={selectedCategoryIds.length}
      onClear={clearFilters}
      sortOptions={SORT_OPTIONS}
      sort={sort}
      onSort={(v) => {
        setSort(v);
        setPage(1);
      }}
    />
  );

  const selectedLabels = selectedCategoryIds.map((id) => categoryOptions.find((c) => c.id === id)?.name ?? id);

  return (
    <>
      <div className="border-b border-line-subtle bg-surface-sunken">
        <Container className="py-6 md:py-10">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Collections' }]}
            className="mb-4"
          />
          <h1 className="mb-3 text-3xl/[1.1] md:type-h1">Collections</h1>
          <p className="type-body mb-6 max-w-140">
            Explore the museum&rsquo;s collections. Filter by category to narrow things down.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <SearchField
              id="col-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              onClear={() => setQuery('')}
              placeholder="Search collections"
              className="max-w-105 flex-[1_1_280px]"
            />
            <Button
              variant="secondary"
              iconLeft="sliders-horizontal"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden"
            >
              Filters{selectedCategoryIds.length ? ` (${selectedCategoryIds.length})` : ''}
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
              {selectedCategoryIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryIds.map((id, i) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleCategory(id)}
                      className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-pill border border-olive-300 bg-olive-50 px-2.5 font-body text-xs leading-none font-semibold text-olive-700"
                    >
                      {selectedLabels[i]}
                      <Icon name="x" size={12} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <Grid cols={3}>
                {Array.from({ length: PAGE_SIZE }, (_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </Grid>
            ) : total ? (
              <Grid cols={3}>
                {pageResults.map((c, i) => (
                  <CollectionCard
                    key={c.id}
                    name={c.name}
                    category={c.categories[0]?.name}
                    description={c.description ?? undefined}
                    tone={toneForIndex(i)}
                    href={`/collections/${c.id}`}
                  />
                ))}
              </Grid>
            ) : (
              <EmptyState
                title="No collections match your search"
                description="Try a different word, or clear your filters."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery('');
                      clearFilters();
                    }}
                  >
                    Clear everything
                  </Button>
                }
              />
            )}

            {!loading && total > PAGE_SIZE && (
              <Pagination
                page={page}
                pages={pages}
                onChange={setPage}
                className="hidden justify-center lg:flex"
              />
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

      <Drawer
        open={drawerOpen}
        side="bottom"
        title="Filter collections"
        onClose={() => setDrawerOpen(false)}
        footer={
          <>
            <Button variant="ghost" fullWidth onClick={clearFilters}>
              Clear all
            </Button>
            <Button fullWidth onClick={() => setDrawerOpen(false)}>
              Show {total} results
            </Button>
          </>
        }
      >
        {filterPanel}
      </Drawer>
    </>
  );
}
