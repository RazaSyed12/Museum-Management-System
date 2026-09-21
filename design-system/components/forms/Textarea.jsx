import React from 'react';

function controlStyle({ invalid, focus, disabled, size = 'md' }) {
  return {
    width: '100%',
    minHeight: size === 'sm' ? 36 : 44,
    padding: size === 'sm' ? '7px 10px' : '10px 14px',
    font: 'var(--type-body)',
    color: disabled ? 'var(--action-disabled-text)' : 'var(--text-heading)',
    background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
    border: 'var(--border-width) solid ' + (invalid ? 'var(--danger-600)' : focus ? 'var(--olive-500)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? (invalid ? 'var(--ring-danger)' : 'var(--ring-focus)') : 'none',
    outline: 'none',
    transition: 'var(--transition-control)',
  };
}

export function Textarea({ invalid, rows = 4, disabled, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea
      rows={rows} disabled={disabled} aria-invalid={invalid || undefined}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ ...controlStyle({ invalid, focus, disabled }), resize: 'vertical', lineHeight: 'var(--leading-relaxed)', ...style }}
      {...rest}
    />
  );
}
