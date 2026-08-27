import React from 'react';
import { Logo } from '../foundation/Logo.jsx';
import { Icon } from '../foundation/Icon.jsx';
import { Button } from '../forms/Button.jsx';
import { IconButton } from '../forms/IconButton.jsx';

const DEFAULT_NAV = ['Home', 'Collections', 'Events', 'Visit', 'Tickets', 'Membership'];

function useMode(mode) {
  const [auto, setAuto] = React.useState('desktop');
  React.useEffect(() => {
    if (mode !== 'auto') return undefined;
    const read = () => setAuto(window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1100 ? 'tablet' : 'desktop');
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [mode]);
  return mode === 'auto' ? auto : mode;
}

export function SiteHeader({ mode = 'auto', items = DEFAULT_NAV, active = 'Home', user, isMember, assetBase = '../../assets/', onNavigate, onSearch, onMenu, onSignIn, style, ...rest }) {
  const m = useMode(mode);
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
        <Logo variant={m === 'mobile' ? 'mark' : 'horizontal'} height={m === 'mobile' ? 34 : 42} assetBase={assetBase} href="#" />
        <nav aria-label="Main" style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, marginLeft: 'var(--space-4)' }}>
          {visible.map((label) => {
            const on = label === active;
            return (
              <a key={label} href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(label); }}
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
            <button type="button" onClick={() => onNavigate && onNavigate('Profile')}
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
          {m === 'desktop' && <Button size="sm" iconLeft="ticket" onClick={() => onNavigate && onNavigate('Tickets')}>Book tickets</Button>}
        </div>
      </div>
    </header>
  );
}
