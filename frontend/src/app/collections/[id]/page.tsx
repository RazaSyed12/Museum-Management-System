import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionDetail } from '@/components/collections/CollectionDetail';
import { collections, getCollection } from '@/lib/sample-data';

interface Props {
  params: Promise<{ id: string }>;
}

/** Prerender every known collection at build time; anything else 404s. */
export function generateStaticParams() {
  return collections.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = getCollection((await params).id);
  return collection ? { title: collection.name, description: collection.description } : {};
}

export default async function CollectionDetailPage({ params }: Props) {
  const collection = getCollection((await params).id);
  if (!collection) notFound();
  return <CollectionDetail collection={collection} />;
}
