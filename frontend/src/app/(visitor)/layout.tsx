import type { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import { SiteChrome } from '@/components/layout/SiteChrome';

export default function VisitorLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SiteChrome>{children}</SiteChrome>
    </AuthProvider>
  );
}
