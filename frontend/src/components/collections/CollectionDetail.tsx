import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { DetailHero, MetaItem } from '@/components/layout/DetailHero';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { ItemCard } from '@/components/cards/ItemCard';
import { EventCard } from '@/components/cards/EventCard';
import { CollectionCard } from '@/components/cards/CollectionCard';
import { collections, events, itemsIn, type Collection } from '@/lib/sample-data';

/* Works for any collection using only fields the data model actually has —
   no bespoke per-collection copy or invented visit-time estimates. A server
   component throughout: every action here is a real link to a page that
   now exists, so nothing needs client-side navigation state. */
export interface CollectionDetailProps {
  collection: Collection;
}

export function CollectionDetail({ collection }: CollectionDetailProps) {
  const relatedItems = itemsIn(collection);
  const relatedEvents = events.slice(0, 2);
  const relatedCollections = collections.filter((c) => c.id !== collection.id).slice(0, 3);

  return (
    <>
      <DetailHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Collections', href: '/collections' }, { label: collection.name }]}
        title={collection.name}
        eyebrow={
          <div className="flex gap-2">
            <StatusBadge tone="olive" size="sm">{collection.category}</StatusBadge>
            <StatusBadge tone="neutral" size="sm" icon="hourglass">{collection.period}</StatusBadge>
          </div>
        }
        description={collection.description}
        meta={<><MetaItem icon="map-pin">{collection.location}</MetaItem><MetaItem icon="gem">{collection.items} objects</MetaItem></>}
        actions={
          <>
            {relatedItems[0] && (
              <Button variant="accent" as="a" href={`/collections/${collection.id}/${relatedItems[0].id}`}>Start with the highlights</Button>
            )}
            <Button variant="secondary" as="a" href="/tickets" className="border-sand-300/50 text-paper-50 hover:bg-white/10 active:bg-white/15">
              Plan your visit
            </Button>
          </>
        }
      />

      <Section title="Objects in this collection">
        {relatedItems.length ? (
          <Grid cols={3} className="lg:grid-cols-4">
            {relatedItems.map((i) => (
              <ItemCard key={i.id} name={i.name} period={i.period} date={i.date} description={i.description} href={`/collections/${collection.id}/${i.id}`} />
            ))}
          </Grid>
        ) : (
          <EmptyState compact title="No objects catalogued yet" description="Individual artefacts from this collection haven't been added to the site yet." />
        )}
      </Section>

      <Section tone="muted" title="Events about this collection">
        <Grid cols={2}>
          {relatedEvents.map((e) => (
            <EventCard key={e.id} title={e.title} description={e.description} date={e.date} time={e.time}
              location={e.location} price={e.price} free={e.free} availability={e.availability} href="/tickets" />
          ))}
        </Grid>
      </Section>

      <Section title="Related collections">
        <Grid cols={3}>
          {relatedCollections.map((c) => (
            <CollectionCard key={c.id} name={c.name} category={c.category} period={c.period} description={c.description}
              itemCount={c.items} tone={c.tone} href={`/collections/${c.id}`} />
          ))}
        </Grid>
      </Section>
    </>
  );
}
