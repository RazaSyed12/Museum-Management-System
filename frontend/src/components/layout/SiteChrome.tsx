'use client';

import { useState, type ReactNode } from 'react';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { SiteFooter } from '@/components/navigation/SiteFooter';
import { MobileNav } from '@/components/navigation/MobileNav';
import { useSiteNav } from '@/lib/nav';

/* Ported from the Page helper in design-system/ui_kits/visitor_site/Shell.jsx.
   The source called this per-screen inside the preview harness; here it's
   mounted once in app/layout.tsx so every route gets the same header,
   footer and mobile menu for free instead of each page re-assembling them. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const nav = useSiteNav();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-surface-page">
      <SiteHeader
        active={nav.active}
        user={nav.user}
        isMember={nav.isMember}
        onNavigate={nav.go}
        onSignIn={() => nav.go('SignIn')}
        onMenu={() => setMenuOpen(true)}
        onSearch={() => nav.go('Collections')}
      />
      <main>{children}</main>
      <SiteFooter />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={nav.go} user={nav.user} isMember={nav.isMember} />
    </div>
  );
}
