import React from 'react';
import { Icon } from '../foundation/Icon.jsx';
import { IconButton } from '../forms/IconButton.jsx';
import { SearchField } from '../forms/SearchField.jsx';

export function StaffTopBar({ title, subtitle, actions, user = { name: 'R. Syed', role: 'Collection Manager', initials: 'RS' }, onMenu, showMenu, showSearch = true, style, ...rest }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap',
      padding: 'var(--space-4) var(--space-6)', background: 'var(--surface-card)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)', ...style,
    }} {...rest}>
      {showMenu && <IconButton icon="menu" label="Open navigation" onClick={onMenu} />}
      <div style={{ display: 'grid', gap: 2, marginRight: 'auto', minWidth: 160 }}>
        <h1 style={{ font: 'var(--weight-medium) var(--text-xl)/1.2 var(--font-display)', color: 'var(--text-heading)' }}>{title}</h1>
        {subtitle && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
      {showSearch && <SearchField size="sm" placeholder="Search the portal" style={{ width: 240 }} id="staff-search" />}
      {actions}
      <IconButton icon="bell" label="Notifications" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingLeft: 'var(--space-3)', borderLeft: 'var(--border-width) solid var(--border-subtle)' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: '50%', background: 'var(--olive-100)', color: 'var(--olive-700)', font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-body)' }}>{user.initials}</span>
        <span style={{ display: 'grid', gap: 1 }}>
          <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{user.name}</span>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{user.role}</span>
        </span>
        <Icon name="chevron-down" size={16} color="var(--text-muted)" />
      </div>
    </header>
  );
}
