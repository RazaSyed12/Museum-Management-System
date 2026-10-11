import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ItemDetail } from '@/components/collections/ItemDetail';
import { listCollections, getCollection, getCollectionItem, listCollectionItems } from '@/lib/api/collections';

interface Props {
  params: Promise<{ id: string; itemId: string }>;
}

/** Prerender every known artefact at build time; anything else 404s. */
export async function generateStaticParams() {
  const { items: collections } = await listCollections({ pageSize: 999 });
  const perCollection = await Promise.all(
    collections.map(async (c) => (await listCollectionItems(c.id)).map((item) => ({ id: c.id, itemId: item.id }))),
  );
  return perCollection.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, itemId } = await params;
  const item = await getCollectionItem(id, itemId);
  return item ? { title: item.name, description: item.description } : {};
}

export default async function ItemDetailPage({ params }: Props) {
  const { id, itemId } = await params;
  const [collection, item] = await Promise.all([getCollection(id), getCollectionItem(id, itemId)]);
  if (!collection || !item) notFound();

  const [allItems, { items: allCollections }] = await Promise.all([
    listCollectionItems(id),
    listCollections({ pageSize: 999 }),
  ]);
  const relatedItems = allItems.filter((i) => i.id !== item.id);
  const suggestions = allCollections.filter((c) => c.id !== collection.id).slice(0, 2);

  return <ItemDetail collection={collection} item={item} relatedItems={relatedItems} suggestions={suggestions} />;
}
