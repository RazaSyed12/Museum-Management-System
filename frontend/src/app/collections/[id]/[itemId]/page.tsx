import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ItemDetail } from '@/components/collections/ItemDetail';
import { items, collections, getItem, itemsIn } from '@/lib/sample-data';

interface Props {
  params: Promise<{ id: string; itemId: string }>;
}

/** Prerender every known artefact at build time; anything else 404s. */
export function generateStaticParams() {
  return items
    .map(({ id: itemId, collection: collectionName }) => {
      const collection = collections.find((c) => c.name === collectionName);
      return collection ? { id: collection.id, itemId } : undefined;
    })
    .filter((p) => p !== undefined);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, itemId } = await params;
  const found = getItem(id, itemId);
  return found ? { title: found.item.name, description: found.item.description } : {};
}

export default async function ItemDetailPage({ params }: Props) {
  const { id, itemId } = await params;
  const found = getItem(id, itemId);
  if (!found) notFound();
  const { collection, item } = found;
  const relatedItems = itemsIn(collection).filter((i) => i.id !== item.id);
  return <ItemDetail collection={collection} item={item} relatedItems={relatedItems} />;
}
