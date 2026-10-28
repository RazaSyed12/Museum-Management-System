import type { Metadata } from 'next';
import { VisitPage } from '@/components/visit/VisitPage';

export const metadata: Metadata = {
  title: 'Plan your visit',
  description: 'Opening hours, admission, how to get to Heritage Museum and how we make it accessible.',
};

export default function Page() {
  return <VisitPage />;
}
