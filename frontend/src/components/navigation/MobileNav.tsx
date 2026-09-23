'use client';

import { Drawer } from '@/components/feedback/Drawer';
import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { SearchField } from '@/components/forms/SearchField';
import type { SiteHeaderUser } from './SiteHeader';

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
      <div className="grid gap-2">
        <SearchField id="m-search" size="sm" placeholder="Search the museum" className="mb-3" />
        {ITEMS.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => { onNavigate(i); onClose(); }}
            className="flex min-h-13 cursor-pointer items-center justify-between rounded-md border-0 bg-transparent px-3 font-body text-md leading-none font-medium text-heading"
          >
            {i}
            <Icon name="chevron-right" size={16} className="text-muted" />
          </button>
        ))}
        {isMember && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-surface-accent p-3">
            <Icon name="award" size={18} className="text-gold-700" />
            <span className="type-body-sm text-heading">Member since 2024</span>
          </div>
        )}
      </div>
    </Drawer>
  );
}
