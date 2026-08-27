import React from 'react';
import { IconButton } from '../forms/IconButton.jsx';

export function Modal({ open = true, title, description, children, footer, onClose, width = 520, style, ...rest }) {
  if (!open) return null;
  return (
    <div role="presentation" onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 50, display: 'grid', placeItems: 'center',
      background: 'var(--overlay-scrim)', backdropFilter: 'blur(2px)', padding: 'var(--space-4)',
    }}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: width, maxHeight: '86%', overflow: 'auto',
        background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', ...style,
      }} {...rest}>
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: 'var(--space-6) var(--space-6) var(--space-4)' }}>
          <div style={{ display: 'grid', gap: 4, flex: 1 }}>
            {title && <h2 style={{ font: 'var(--type-h3)' }}>{title}</h2>}
            {description && <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{description}</p>}
          </div>
          {onClose && <IconButton icon="x" label="Close" onClick={onClose} size="sm" />}
        </header>
        <div style={{ padding: '0 var(--space-6)' }}>{children}</div>
        {footer && (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-6)', marginTop: 'var(--space-2)', borderTop: 'var(--border-width) solid var(--border-subtle)' }}>
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
