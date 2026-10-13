'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/forms/Button';
import { SearchField } from '@/components/forms/SearchField';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Icon } from '@/components/foundation/Icon';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/cn';
import { POPULAR_SEARCHES, QUICK_LINKS, searchSite, type SearchResult } from '@/lib/search';

export interface SearchOverlayProps {
  onClose: () => void;
  /** Screen label understood by `useSiteNav().go`. */
  onNavigate: (label: string) => void;
  /** overlay = full-width panel from the top; modal = centred card on tablet and up. Both fill the screen on mobile. */
  variant?: 'overlay' | 'modal';
}

const RECENT_KEY = 'hm-recent-searches';
const MAX_RECENT = 5;

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string').slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* Storage can be blocked (private windows); recents are a convenience only. */
  }
}

const CHIP =
  'type-body-sm inline-flex h-11 cursor-pointer items-center rounded-pill border border-line-default bg-surface-card px-4 text-heading transition-control hover:border-line-strong hover:bg-olive-50 md:h-9';
const ROW =
  'flex w-full cursor-pointer items-center justify-between gap-4 rounded-md border-0 bg-transparent px-3 py-3 text-left transition-control hover:bg-olive-50 focus-visible:bg-olive-50';

/* Mount this only while search is open: it takes focus, locks page scroll and
   starts from an empty query each time, so there is no open/closed state to
   keep in sync. */
export function SearchOverlay({ onClose, onNavigate, variant = 'overlay' }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(readRecent);
  const dialogRef = useRef<HTMLDivElement>(null);

  const { groups, total } = useMemo(() => searchSite(query), [query]);
  const hasQuery = query.trim().length > 0;

  // Lock page scroll, and hand focus back to whatever opened the search.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      opener?.focus?.();
    };
  }, []);

  const remember = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(next);
    writeRecent(next);
  };

  const open = (result: Pick<SearchResult, 'route' | 'title'>) => {
    remember(hasQuery ? query : result.title);
    onNavigate(result.route);
    onClose();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    const topResult = groups[0]?.results[0];
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement && topResult) {
      open(topResult);
      return;
    }
    // Keep Tab inside the dialog.
    if (e.key === 'Tab' && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], input');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const body = (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <SearchField
          id="site-search"
          className="min-w-0 flex-1 [&_input]:w-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          autoFocus
          autoComplete="off"
        />
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>

      {/* Screen readers hear the count; sighted visitors see the list change. */}
      <p className="sr-only" role="status">
        {hasQuery ? (total === 0 ? 'No results' : `${total} result${total === 1 ? '' : 's'}`) : ''}
      </p>

      {!hasQuery && (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="grid content-start gap-6">
            {recent.length > 0 && (
              <section aria-labelledby="search-recent" className="grid gap-1">
                <h2 id="search-recent" className="type-eyebrow mb-1 tracking-wider text-olive-600 uppercase">Recent searches</h2>
                {recent.map((term) => (
                  <button key={term} type="button" className={ROW} onClick={() => setQuery(term)}>
                    <span className="type-body inline-flex items-center gap-3 text-heading">
                      <Icon name="clock" size={16} className="text-muted" />
                      {term}
                    </span>
                  </button>
                ))}
              </section>
            )}
            <section aria-labelledby="search-popular" className="grid gap-3">
              <h2 id="search-popular" className="type-eyebrow tracking-wider text-olive-600 uppercase">Popular searches</h2>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button key={term} type="button" className={CHIP} onClick={() => setQuery(term)}>{term}</button>
                ))}
              </div>
            </section>
          </div>
          <section aria-labelledby="search-quick" className="grid content-start gap-1">
            <h2 id="search-quick" className="type-eyebrow mb-1 tracking-wider text-olive-600 uppercase">Quick links</h2>
            {QUICK_LINKS.map((l) => (
              <button key={l.label} type="button" className={ROW} onClick={() => open({ route: l.route, title: l.label })}>
                <span className="type-body text-heading">{l.label}</span>
                <Icon name="arrow-right" size={16} className="text-olive-500" />
              </button>
            ))}
          </section>
        </div>
      )}

      {hasQuery && total > 0 && (
        <div className="grid gap-6">
          {groups.map((g) => (
            <section key={g.label} aria-label={g.label} className="grid gap-1">
              <h2 className="type-eyebrow mb-1 tracking-wider text-olive-600 uppercase">{g.label}</h2>
              {g.results.map((r) => (
                <button key={r.id} type="button" className={ROW} onClick={() => open(r)}>
                  <span className="grid min-w-0 gap-0.5">
                    <span className="type-h3">{r.title}</span>
                    <span className="type-body-sm text-muted">{r.meta}</span>
                  </span>
                  {/* The group heading already names the type on narrow screens. */}
                  <span className="type-eyebrow hidden flex-none tracking-wider text-olive-600 uppercase md:inline">{r.kind}</span>
                </button>
              ))}
            </section>
          ))}
        </div>
      )}

      {hasQuery && total === 0 && (
        <EmptyState
          compact
          title={`No results for “${query.trim()}”`}
          description="Check the spelling, or try a broader word such as a period or a gallery."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button key={term} type="button" className={CHIP} onClick={() => setQuery(term)}>{term}</button>
              ))}
            </div>
          }
        />
      )}
    </div>
  );

  return (
    <div role="presentation" onClick={onClose} className="fixed inset-0 z-70 bg-overlay-scrim">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the museum"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className={cn(
          'max-h-dvh overflow-auto bg-surface-card shadow-xl',
          variant === 'modal' ? 'h-dvh md:mx-auto md:mt-24 md:h-auto md:max-h-[80dvh] md:max-w-190 md:rounded-xl' : 'h-dvh w-full md:h-auto md:max-h-[85dvh]',
        )}
      >
        {variant === 'modal' ? <div className="p-5 md:p-7">{body}</div> : <Container className="py-5 md:py-8">{body}</Container>}
      </div>
    </div>
  );
}
