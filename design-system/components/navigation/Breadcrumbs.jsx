import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

export function Breadcrumbs({ items = [], style, ...rest }) {
  return (
    <nav aria-label="Breadcrumb" style={style} {...rest}>
      <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((it, i) => {
          const label = typeof it === 'string' ? it : it.label;
          const last = i === items.length - 1;
          return (
            <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {last ? (
                <span aria-current="page" style={{ font: 'var(--type-body-sm)', color: 'var(--text-heading)', fontWeight: 'var(--weight-semibold)' }}>{label}</span>
              ) : (
                <a href={(typeof it === 'object' && it.href) || '#'} style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', textDecoration: 'none' }}>{label}</a>
              )}
              {!last && <Icon name="chevron-right" size={14} color="var(--neutral-400)" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
