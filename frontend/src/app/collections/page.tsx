import type { Metadata } from 'next';
import { CollectionsBrowse } from '@/components/collections/CollectionsBrowse';

export const metadata: Metadata = {
  title: 'Collections',
  description: "Browse Heritage Museum's collections. Filter by category to find what you're looking for.",
};

export default function CollectionsPage() {
  return <CollectionsBrowse />;
}
