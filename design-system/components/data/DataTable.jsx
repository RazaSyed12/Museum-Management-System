import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

export function DataTable({ columns = [], rows = [], caption, sortKey, sortDir = 'asc', onSort, empty, dense, style, ...rest }) {
  if (!rows.length && empty) return empty;
  return (
    <div style={{ overflowX: 'auto', background: 'var(--surface-card)', border: 'var(--border-width) solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', ...style }} {...rest}>
      <table style={{ width: '100%', borderCollapse: 'collapse', font: 'var(--type-body-sm)' }}>
        {caption && <caption style={{ captionSide: 'top', textAlign: 'left', padding: 'var(--space-4) var(--space-5)', font: 'var(--type-label)', color: 'var(--text-muted)' }}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => {
              const on = sortKey === c.key;
              return (
                <th key={c.key} scope="col" aria-sort={on ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  style={{ textAlign: c.align || 'left', padding: dense ? '10px 14px' : '14px 18px', background: 'var(--surface-sunken)',
                    borderBottom: 'var(--border-width) solid var(--border-subtle)', whiteSpace: 'nowrap',
                    font: 'var(--weight-semibold) var(--text-xs)/1.2 var(--font-body)', letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase', color: 'var(--text-muted)', width: c.width }}>
                  {c.sortable ? (
                    <button type="button" onClick={() => onSort && onSort(c.key)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: on ? 'var(--text-heading)' : 'inherit', padding: 0 }}>
                      {c.header}<Icon name={on ? (sortDir === 'asc' ? 'arrow-up' : 'arrow-down') : 'chevrons-up-down'} size={13} />
                    </button>
                  ) : c.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i} style={{ borderBottom: i === rows.length - 1 ? 'none' : 'var(--border-width) solid var(--border-subtle)' }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: dense ? '10px 14px' : '14px 18px', textAlign: c.align || 'left', color: 'var(--text-body)', verticalAlign: 'middle' }}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
