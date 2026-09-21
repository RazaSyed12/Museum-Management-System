import React from 'react';
import { Logo } from '../foundation/Logo.jsx';
import { Icon } from '../foundation/Icon.jsx';

const DEFAULT_SECTIONS = [
  { title: 'Overview', items: [{ label: 'Dashboard', icon: 'layout-dashboard' }] },
  { title: 'Content', items: [
    { label: 'Collections', icon: 'library-big' },
    { label: 'Items', icon: 'gem' },
    { label: 'Categories', icon: 'tags' },
  ] },
  { title: 'Programme', items: [
    { label: 'Events', icon: 'calendar-days' },
    { label: 'Tickets', icon: 'ticket' },
    { label: 'Bookings', icon: 'receipt' },
  ] },
  { title: 'Admin', items: [{ label: 'Staff & roles', icon: 'shield-check' }] },
];

export function StaffSidebar({ sections = DEFAULT_SECTIONS, active = 'Dashboard', collapsed = false, onNavigate, assetBase = '../../assets/', style, ...rest }) {
  return (
    <aside style={{
      width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)', flex: '0 0 auto',
      background: 'var(--surface-staff-nav)', color: 'var(--paper-100)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
      padding: 'var(--space-5) var(--space-3)', height: '100%', overflow: 'auto', ...style,
    }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '0 var(--space-2)' }}>
        <Logo variant="mark" height={34} assetBase={assetBase} />
        {!collapsed && (
          <span style={{ display: 'grid', gap: 1 }}>
            <span style={{ font: 'var(--weight-medium) var(--text-md)/1 var(--font-display)', color: 'var(--paper-50)' }}>Heritage</span>
            <span style={{ font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--sand-300)' }}>Staff portal</span>
          </span>
        )}
      </div>
      {sections.map((s) => (
        <nav key={s.title} aria-label={s.title} style={{ display: 'grid', gap: 2 }}>
          {!collapsed && (
            <span style={{ font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'rgba(242,226,166,.55)', padding: '0 var(--space-3) var(--space-2)' }}>{s.title}</span>
          )}
          {s.items.map((it) => {
            const on = it.label === active;
            return (
              <a key={it.label} href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(it.label); }}
                aria-current={on ? 'page' : undefined}
                title={collapsed ? it.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 42,
                  padding: collapsed ? '0 var(--space-3)' : '0 var(--space-3)', justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)', textDecoration: 'none',
                  background: on ? 'rgba(242,226,166,.14)' : 'transparent',
                  color: on ? 'var(--sand-300)' : 'rgba(245,243,233,.82)',
                  font: 'var(--weight-' + (on ? 'semibold' : 'regular') + ') var(--text-sm)/1 var(--font-body)',
                  boxShadow: on ? 'inset 2px 0 0 var(--sand-300)' : 'none',
                  transition: 'var(--transition-control)',
                }}>
                <Icon name={it.icon} size={18} />
                {!collapsed && it.label}
              </a>
            );
          })}
        </nav>
      ))}
    </aside>
  );
}
