'use client';

import Link from 'next/link';
import type { HTMLAttributes } from 'react';
import { Logo } from '@/components/foundation/Logo';
import { Icon } from '@/components/foundation/Icon';
import { Button } from '@/components/forms/Button';
import { IconButton } from '@/components/forms/IconButton';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/cn';

/* The header renders the right layout on the server via breakpoint visibility
   utilities, with no resize listener and no flash.
     mobile  (< md): menu button, mark logo, search, sign-in icon
     tablet  (≥ md): + horizontal logo, first four nav items, Sign in button
     desktop (≥ lg): + all nav items, Book tickets button */
export interface SiteHeaderUser {
  name: string;
  initials: string;
}

export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  items?: string[];
  active?: string;
  /** Signed-in visitor. Omit for the anonymous state. */
  user?: SiteHeaderUser;
  /** Adds the gold "Member" flag under the visitor's name. */
  isMember?: boolean;
  assetBase?: string;
  onNavigate?: (item: string) => void;
  onSearch?: () => void;
  onMenu?: () => void;
  onSignIn?: () => void;
}

const DEFAULT_NAV = ['Home', 'Collections', 'Events', 'Visit', 'Tickets', 'Membership'];
/** Items past this index only appear at the desktop breakpoint. */
const TABLET_ITEM_LIMIT = 4;

export function SiteHeader({ items = DEFAULT_NAV, active = 'Home', user, isMember, assetBase, onNavigate, onSearch, onMenu, onSignIn, className, ...rest }: SiteHeaderProps) {
  return (
    <header className={cn('sticky top-0 z-30 border-b border-line-subtle bg-surface-card', className)} {...rest}>
      <Container className="flex h-15 items-center gap-6 md:h-20">
        <IconButton icon="menu" label="Open menu" onClick={onMenu} className="md:hidden" />
        <Link href="/" className="inline-flex no-underline">
          <Logo variant="mark" height={34} assetBase={assetBase} className="md:hidden" />
          <Logo variant="horizontal" height={42} assetBase={assetBase} className="hidden md:block" />
        </Link>
        <nav aria-label="Main" className="ml-4 hidden flex-1 gap-6 md:flex">
          {items.map((label, i) => {
            const on = label === active;
            return (
              <a
                key={label}
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate?.(label); }}
                aria-current={on ? 'page' : undefined}
                className={cn(
                  'border-b-2 pb-1 font-body text-sm leading-none tracking-wide whitespace-nowrap uppercase no-underline transition-control',
                  on ? 'border-olive-500 font-semibold text-green-900' : 'border-transparent font-medium text-body',
                  i >= TABLET_ITEM_LIMIT && 'hidden lg:inline',
                )}
              >
                {label}
              </a>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <IconButton icon="search" label="Search" onClick={onSearch} />
          {user ? (
            <button
              type="button"
              onClick={() => onNavigate?.('Profile')}
              className="flex h-11 cursor-pointer items-center gap-2 border-0 bg-transparent pr-2 pl-1.5"
            >
              <span className="grid size-[34px] place-items-center rounded-full bg-green-900 font-body text-sm leading-none font-semibold text-sand-300">
                {user.initials}
              </span>
              <span className="hidden gap-px text-left md:grid">
                <span className="type-label text-heading">{user.name}</span>
                <span className={cn('font-body text-2xs leading-none font-semibold tracking-wide uppercase', isMember ? 'text-gold-700' : 'text-muted')}>
                  {isMember ? 'Member' : 'Account'}
                </span>
              </span>
              <Icon name="chevron-down" size={16} className="hidden text-muted md:block" />
            </button>
          ) : (
            <>
              <IconButton icon="user" label="Sign in" onClick={onSignIn} className="md:hidden" />
              <Button variant="secondary" size="sm" onClick={onSignIn} className="hidden md:inline-flex">Sign in</Button>
            </>
          )}
          <Button size="sm" iconLeft="ticket" onClick={() => onNavigate?.('Tickets')} className="hidden lg:inline-flex">Book tickets</Button>
        </div>
      </Container>
    </header>
  );
}
