import React from 'react';
import { Icon } from '../foundation/Icon.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Select } from '../forms/Select.jsx';

function Group({ title, children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderBottom: 'var(--border-width) solid var(--border-subtle)', paddingBottom: 'var(--space-4)' }}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 44, border: 0, background: 'transparent', cursor: 'pointer', padding: 0 }}>
        <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{title}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color="var(--text-muted)" />
      </button>
      {open && <div style={{ display: 'grid', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>{children}</div>}
    </div>
  );
}

export function FilterPanel({ groups = [], selected = {}, onToggle, sortOptions, sort, onSort, onClear, activeCount = 0, style, ...rest }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)', alignContent: 'start', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--type-label)', color: 'var(--text-heading)' }}>
          <Icon name="sliders-horizontal" size={16} color="var(--olive-600)" />Filters
          {activeCount > 0 && <span style={{ font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)', padding: '3px 7px', borderRadius: 'var(--radius-pill)', background: 'var(--olive-100)', color: 'var(--olive-700)' }}>{activeCount}</span>}
        </span>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} style={{ border: 0, background: 'transparent', cursor: 'pointer', font: 'var(--type-body-sm)', color: 'var(--text-link)', textDecoration: 'underline', padding: 4 }}>Clear all</button>
        )}
      </div>
      {sortOptions && (
        <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>Sort by</span>
          <Select options={sortOptions} value={sort} onChange={(e) => onSort && onSort(e.target.value)} size="sm" />
        </label>
      )}
      {groups.map((g) => (
        <Group key={g.title} title={g.title}>
          {g.options.map((o) => {
            const v = typeof o === 'string' ? o : o.value;
            const l = typeof o === 'string' ? o : o.label;
            const count = typeof o === 'object' ? o.count : undefined;
            return (
              <Checkbox key={v} id={g.title + '-' + v}
                checked={!!(selected[g.title] || []).includes(v)}
                onChange={() => onToggle && onToggle(g.title, v)}
                label={<span style={{ display: 'flex', gap: 8 }}>{l}{count != null && <span style={{ color: 'var(--text-muted)' }}>({count})</span>}</span>}
                style={{ minHeight: 40, padding: '2px 0' }} />
            );
          })}
        </Group>
      ))}
    </div>
  );
}
