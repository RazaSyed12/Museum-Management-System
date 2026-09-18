'use client';

import { Drawer } from '@/components/feedback/Drawer';
import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { SearchField } from '@/components/forms/SearchField';
import type { SiteHeaderUser } from './SiteHeader';

/* Ported from the MobileNav helper in design-system/ui_kits/visitor_site/Shell.jsx
   — the design system defines this alongside Container/Section/Grid rather
   than under components/, but it's real reusable nav chrome, so it gets its
   own file here rather than living inline in the layout. */
export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (item: string) => void;
  user?: SiteHeaderUser;
  isMember?: boolean;
}

const ITEMS = ['Home', 'Collections', 'Events', 'Visit', 'Tickets', 'Membership'];

export function MobileNav({ open, onClose, onNavigate, user, isMember }: MobileNavProps) {
  return (
    <Drawer open={open} side="left" title="Menu" onClose={onClose} size={300}
      footer={user ? <Button fullWidth variant="secondary" onClick={() => { onNavigate('Profile'); onClose(); }}>Your account</Button>
                   : <Button fullWidth onClick={() => { onNavigate('SignIn'); onClose(); }}>Sign in</Button>}>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <SearchField id="m-search" size="sm" placeholder="Search the museum" style={{ marginBottom: 'var(--space-3)' }} />
        {ITEMS.map((i) => (
          <button key={i} type="button" onClick={() => { onNavigate(i); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, padding: '0 var(--space-3)',
              border: 0, borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer',
              font: 'var(--weight-medium) var(--text-md)/1 var(--font-body)', color: 'var(--text-heading)' }}>
            {i}<Icon name="chevron-right" size={16} color="var(--text-muted)" />
          </button>
        ))}
        {isMember && (
          <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--surface-accent)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icon name="award" size={18} color="var(--gold-700)" />
            <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-heading)' }}>Member since 2024</span>
          </div>
        )}
      </div>
    </Drawer>
  );
}
