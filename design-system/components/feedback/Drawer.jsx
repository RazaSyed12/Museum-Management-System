import React from 'react';
import { IconButton } from '../forms/IconButton.jsx';

export function Drawer({ open = true, side = 'right', title, children, footer, onClose, size = 340, style, ...rest }) {
  if (!open) return null;
  const vertical = side === 'bottom';
  return (
    <div role="presentation" onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'var(--overlay-scrim)', display: 'flex', justifyContent: side === 'right' ? 'flex-end' : 'flex-start', alignItems: vertical ? 'flex-end' : 'stretch' }}>
      <aside role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--surface-card)', display: 'flex', flexDirection: 'column',
        width: vertical ? '100%' : size, maxHeight: vertical ? '82%' : '100%', height: vertical ? undefined : '100%',
        borderRadius: vertical ? 'var(--radius-xl) var(--radius-xl) 0 0' : 0,
        boxShadow: 'var(--shadow-xl)', ...style,
      }} {...rest}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', borderBottom: 'var(--border-width) solid var(--border-subtle)' }}>
          <h2 style={{ font: 'var(--type-h3)', flex: 1 }}>{title}</h2>
          {onClose && <IconButton icon="x" label="Close" onClick={onClose} size="sm" />}
        </header>
        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-5)' }}>{children}</div>
        {footer && <footer style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', borderTop: 'var(--border-width) solid var(--border-subtle)' }}>{footer}</footer>}
      </aside>
    </div>
  );
}
