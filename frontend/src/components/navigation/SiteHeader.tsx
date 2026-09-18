'use client';

import type { HTMLAttributes } from 'react';
import { Logo } from '@/components/foundation/Logo';
import { Icon } from '@/components/foundation/Icon';
import { Button } from '@/components/forms/Button';
import { IconButton } from '@/components/forms/IconButton';
import { useResponsiveMode, type ResponsiveModeInput } from '@/lib/useResponsiveMode';

/* Ported from design-system/components/navigation/SiteHeader.jsx + SiteHeader.d.ts
   — keep in sync. The source component had its own local resize-listener
   hook for `mode="auto"`; that's now the shared useResponsiveMode (see
   lib/), so every component that needs a layout mode reads the same
   measurement instead of each one running its own `window.innerWidth`
   listener. */
export interface SiteHeaderUser {
  name: string;
  initials: string;
}

export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  /** auto follows window width (mobile <768, tablet <1100). Force a value to preview a breakpoint. */
  mode?: ResponsiveModeInput;
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

export function SiteHeader({ mode = 'auto', items = DEFAULT_NAV, active = 'Home', user, isMember, assetBase, onNavigate, onSearch, onMenu, onSignIn, style, ...rest }: SiteHeaderProps) {
  const m = useResponsiveMode(mode);
  const visible = m === 'desktop' ? items : m === 'tablet' ? items.slice(0, 4) : [];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30, background: 'var(--surface-card)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)', ...style,
    }} {...rest}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-6)',
        height: m === 'mobile' ? 'var(--header-h-mobile)' : 'var(--header-h-desktop)',
        maxWidth: 'var(--container-max)', margin: '0 auto',
        padding: `0 ${m === 'mobile' ? 'var(--container-pad-mobile)' : m === 'tablet' ? 'var(--container-pad-tablet)' : 'var(--container-pad-desktop)'}`,
      }}>
        {m === 'mobile' && <IconButton icon="menu" label="Open menu" onClick={onMenu} />}
        <Logo variant={m === 'mobile' ? 'mark' : 'horizontal'} height={m === 'mobile' ? 34 : 42} assetBase={assetBase} href="/" />
        <nav aria-label="Main" style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, marginLeft: 'var(--space-4)' }}>
          {visible.map((label) => {
            const on = label === active;
            return (
              <a key={label} href="#" onClick={(e) => { e.preventDefault(); onNavigate?.(label); }}
                aria-current={on ? 'page' : undefined}
                style={{
                  font: 'var(--weight-' + (on ? 'semibold' : 'medium') + ') var(--text-sm)/1 var(--font-body)',
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', textDecoration: 'none',
                  color: on ? 'var(--green-900)' : 'var(--text-body)',
                  paddingBottom: 4, borderBottom: '2px solid ' + (on ? 'var(--olive-500)' : 'transparent'),
                  transition: 'var(--transition-control)', whiteSpace: 'nowrap',
                }}>{label}</a>
            );
          })}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: 'auto' }}>
          <IconButton icon="search" label="Search" onClick={onSearch} />
          {user ? (
            <button type="button" onClick={() => onNavigate?.('Profile')}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', height: 44, padding: '0 8px 0 6px', border: 0, background: 'transparent', cursor: 'pointer' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--green-900)', color: 'var(--sand-300)', font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-body)' }}>
                {user.initials}
              </span>
              {m !== 'mobile' && (
                <span style={{ display: 'grid', textAlign: 'left', gap: 1 }}>
                  <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{user.name}</span>
                  <span style={{ font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: isMember ? 'var(--gold-700)' : 'var(--text-muted)' }}>
                    {isMember ? 'Member' : 'Account'}
                  </span>
                </span>
              )}
              {m !== 'mobile' && <Icon name="chevron-down" size={16} color="var(--text-muted)" />}
            </button>
          ) : (
            m === 'mobile'
              ? <IconButton icon="user" label="Sign in" onClick={onSignIn} />
              : <Button variant="secondary" size="sm" onClick={onSignIn}>Sign in</Button>
          )}
          {m === 'desktop' && <Button size="sm" iconLeft="ticket" onClick={() => onNavigate?.('Tickets')}>Book tickets</Button>}
        </div>
      </div>
    </header>
  );
}
