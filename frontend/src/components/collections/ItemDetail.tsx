'use client';

import { Fragment, useState } from 'react';
import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Media } from '@/components/foundation/Media';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { ItemCard } from '@/components/cards/ItemCard';
import { RecommendationCard } from '@/components/cards/RecommendationCard';
import { collections, type Collection, type Item } from '@/lib/sample-data';
import { cn } from '@/lib/cn';

/* The facts list only shows fields the data model actually has — no
   invented "Materials" or "Accession number" values. "Category" comes from
   the parent collection rather than being hardcoded. Only the gallery's
   thumbnail selection needs client state; navigation elsewhere is plain links. */
const GALLERY_TONES = ['stone', 'olive', 'green', 'sand'] as const;

export interface ItemDetailProps {
  collection: Collection;
  item: Item;
  relatedItems: Item[];
}

export function ItemDetail({ collection, item, relatedItems }: ItemDetailProps) {
  const [shot, setShot] = useState(0);
  const facts: [string, string][] = [
    ['Historical period', item.period],
    ['Approximate date', item.date],
    ['Origin', item.origin],
    ['Collection', item.collection],
    ['On display', item.location],
  ];
  const suggestions = collections.filter((c) => c.id !== collection.id).slice(0, 2);

  return (
    <>
      <Container className="py-5 md:py-8 md:pb-16">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Collections', href: '/collections' }, { label: collection.name, href: `/collections/${collection.id}` }, { label: item.name }]}
          className="mb-6"
        />
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-3">
            <Media ratio="4 / 3" tone={GALLERY_TONES[shot]} caption={`${item.name} — view ${shot + 1}`} />
            <div className="flex gap-3">
              {GALLERY_TONES.map((tone, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setShot(i)}
                  aria-label={`View ${i + 1}`}
                  aria-current={i === shot || undefined}
                  className={cn('min-w-0 flex-1 cursor-pointer overflow-hidden rounded-md border-2 bg-transparent p-0', i === shot ? 'border-olive-500' : 'border-transparent')}
                >
                  <Media ratio="1 / 1" tone={tone} caption="" className="rounded-sm" />
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="olive" size="sm">{collection.category}</StatusBadge>
              <StatusBadge tone="neutral" size="sm" icon="hourglass">{item.period}</StatusBadge>
              <StatusBadge tone="success" size="sm" icon="eye">On display</StatusBadge>
            </div>
            <h1 className="text-3xl/[1.1] md:type-h1">{item.name}</h1>
            <p className="type-body">{item.description}</p>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-y border-line-subtle py-5">
              {facts.map(([k, v]) => (
                <Fragment key={k}>
                  <dt className="font-body text-xs leading-snug font-semibold tracking-wide text-muted uppercase">{k}</dt>
                  <dd className="type-body-sm m-0 text-heading">{v}</dd>
                </Fragment>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3">
              <Button iconLeft="map" as="a" href={`/collections/${collection.id}`}>Find it in the gallery</Button>
              <Button variant="secondary" iconLeft="bookmark">Save to your list</Button>
            </div>
          </div>
        </div>
      </Container>

      {relatedItems.length > 0 && (
        <Section tone="muted" title="Related objects">
          <Grid cols={3} className="lg:grid-cols-4">
            {relatedItems.map((i) => (
              <ItemCard key={i.id} name={i.name} period={i.period} date={i.date} description={i.description} href={`/collections/${collection.id}/${i.id}`} />
            ))}
          </Grid>
        </Section>
      )}

      {suggestions.length > 0 && (
        <Section title="You may also like">
          <Grid cols={2}>
            {suggestions.map((c) => (
              <RecommendationCard key={c.id} kind="Collection" title={c.name} reason="Visitors also explored" tone={c.tone} href={`/collections/${c.id}`} />
            ))}
          </Grid>
        </Section>
      )}
    </>
  );
}
