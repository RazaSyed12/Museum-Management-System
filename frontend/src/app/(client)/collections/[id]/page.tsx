import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionDetail } from '@/components/collections/CollectionDetail';
import { TrackView } from '@/components/tracking/TrackView';
import { listCollections, getCollection, listCollectionItems } from '@/lib/api/collections';
import { listEvents } from '@/lib/api/events';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollection((await params).id);
  return collection ? { title: collection.name, description: collection.description } : {};
}

export default async function CollectionDetailPage({ params }: Props) {
  const { id } = await params;
  const collection = await getCollection(id);
  if (!collection) notFound();

  const [relatedItems, { items: allCollections }, allEvents] = await Promise.all([
    listCollectionItems(id),
    listCollections({ limit: 100 }),
    listEvents({ collectionId: id }),
  ]);
  const relatedCollections = allCollections.filter((c) => c.id !== collection.id).slice(0, 3);
  const relatedEvents = allEvents;

  return (
    <>
      <TrackView collectionId={collection.id} />
      <CollectionDetail
        collection={collection}
        relatedItems={relatedItems}
        relatedCollections={relatedCollections}
        relatedEvents={relatedEvents}
      />
    </>
  );
}
