import type { ReactNode } from 'react';
import { SiteChrome } from '@/components/layout/SiteChrome';

export default function VisitorLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
