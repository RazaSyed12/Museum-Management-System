import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionDetail } from '@/components/collections/CollectionDetail';
import { listCollections, getCollection, listCollectionItems } from '@/lib/api/collections';
import { listEvents } from '@/lib/api/events';

interface Props {
  params: Promise<{ id: string }>;
}

/** Prerender every known collection at build time; anything else 404s. */
export async function generateStaticParams() {
  const { items } = await listCollections({ pageSize: 999 });
  return items.map((c) => ({ id: c.id }));
}

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
    listCollections({ pageSize: 999 }),
    listEvents(),
  ]);
  const relatedCollections = allCollections.filter((c) => c.id !== collection.id).slice(0, 3);
  const relatedEvents = allEvents.slice(0, 2);

  return <CollectionDetail collection={collection} relatedItems={relatedItems} relatedCollections={relatedCollections} relatedEvents={relatedEvents} />;
}
