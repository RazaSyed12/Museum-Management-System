import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

export function SearchField({ placeholder = 'Search collections, artefacts, events', value, onChange, onClear, size = 'md', id = 'search', label, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 36 : 44;
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)', ...style }}>
      {label && <label htmlFor={id} style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{label}</label>}
      <div role="search" style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)', height: h, padding: '0 12px',
        background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)',
        border: 'var(--border-width) solid ' + (focus ? 'var(--olive-500)' : 'var(--border-default)'),
        boxShadow: focus ? 'var(--ring-focus)' : 'none', transition: 'var(--transition-control)',
      }}>
        <Icon name="search" size={18} color="var(--text-muted)" />
        <input id={id} type="search" value={value} onChange={onChange} placeholder={placeholder}
          aria-label={label ? undefined : 'Search'}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', font: 'var(--type-body)', color: 'var(--text-heading)', minWidth: 0 }}
          {...rest} />
        {value ? <button type="button" onClick={onClear} aria-label="Clear search" style={{ border: 0, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 4 }}>
          <Icon name="x" size={16} color="var(--text-muted)" />
        </button> : null}
      </div>
    </div>
  );
}
