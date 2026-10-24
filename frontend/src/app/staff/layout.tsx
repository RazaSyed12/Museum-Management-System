import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StaffSessionProvider } from '@/lib/staff/session';
import { StaffShell } from '@/components/staff/StaffShell';

export const metadata: Metadata = {
  title: 'Staff portal',
  robots: { index: false, follow: false },
};

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <StaffSessionProvider>
      <StaffShell>{children}</StaffShell>
    </StaffSessionProvider>
  );
}
