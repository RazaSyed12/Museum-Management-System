import type { Metadata } from 'next';
import { UnderConstruction } from '@/components/shared/UnderConstruction';

export const metadata: Metadata = { title: 'Collections' };

export default function CollectionsPage() {
  return <UnderConstruction title="Collections" description="Browse the museum's collections, galleries and objects. This page is still being built." />;
}
