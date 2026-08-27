import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

export function Pagination({ page = 1, pages = 1, onChange, showLoadMore, onLoadMore, resultLabel, style, ...rest }) {
  if (showLoadMore) {
    return (
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--space-3)', ...style }} {...rest}>
        {resultLabel && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{resultLabel}</span>}
        <button type="button" onClick={onLoadMore} style={{ minHeight: 44, padding: '0 28px', borderRadius: 'var(--radius-pill)', border: 'var(--border-width) solid var(--olive-500)', background: 'transparent', color: 'var(--olive-700)', font: 'var(--type-button)', cursor: 'pointer' }}>
          Load more
        </button>
      </div>
    );
  }
  const nums = Array.from({ length: pages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const cell = (content, key, opts = {}) => (
    <button key={key} type="button" disabled={opts.disabled} onClick={opts.onClick} aria-current={opts.current ? 'page' : undefined}
      style={{
        minWidth: 44, height: 44, padding: '0 10px', borderRadius: 'var(--radius-md)', cursor: opts.disabled ? 'not-allowed' : 'pointer',
        border: 'var(--border-width) solid ' + (opts.current ? 'var(--action-primary)' : 'var(--border-default)'),
        background: opts.current ? 'var(--action-primary)' : 'var(--surface-card)',
        color: opts.disabled ? 'var(--action-disabled-text)' : opts.current ? 'var(--text-inverse)' : 'var(--text-heading)',
        font: 'var(--type-button)', display: 'grid', placeItems: 'center', transition: 'var(--transition-control)',
      }}>{content}</button>
  );
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', ...style }} {...rest}>
      {cell(<Icon name="chevron-left" size={18} />, 'prev', { disabled: page === 1, onClick: () => onChange && onChange(page - 1) })}
      {nums.map((n, i) => (
        <React.Fragment key={n}>
          {i > 0 && n - nums[i - 1] > 1 && <span style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>}
          {cell(n, n, { current: n === page, onClick: () => onChange && onChange(n) })}
        </React.Fragment>
      ))}
      {cell(<Icon name="chevron-right" size={18} />, 'next', { disabled: page === pages, onClick: () => onChange && onChange(page + 1) })}
    </nav>
  );
}
