import React from 'react';

/* Shared label + hint + error shell. Every form control in this system is
   labelled — placeholder-only fields are not permitted. */
export function Field({ label, htmlFor, hint, error, required, optional, children, style, ...rest }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)', ...style }} {...rest}>
      {label && (
        <label htmlFor={htmlFor} style={{ font: 'var(--type-label)', color: 'var(--text-heading)', display: 'flex', gap: 6, alignItems: 'baseline' }}>
          {label}
          {required && <span aria-hidden="true" style={{ color: 'var(--danger-600)' }}>*</span>}
          {optional && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Optional</span>}
        </label>
      )}
      {children}
      {hint && !error && <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{hint}</p>}
      {error && (
        <p role="alert" style={{ font: 'var(--type-body-sm)', color: 'var(--danger-600)', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span aria-hidden="true">⚠</span>{error}
        </p>
      )}
    </div>
  );
}
