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

export function Select({ options = [], invalid, size = 'md', disabled, placeholder, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const url = 'url("https://unpkg.com/lucide-static@0.454.0/icons/chevron-down.svg")';
  return (
    <span style={{ position: 'relative', display: 'block' }}>
      <select
        disabled={disabled} aria-invalid={invalid || undefined}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...controlStyle({ invalid, focus, disabled, size }), appearance: 'none', paddingRight: 40, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      <span aria-hidden="true" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, pointerEvents: 'none', backgroundColor: 'var(--text-muted)', WebkitMaskImage: url, maskImage: url, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }} />
    </span>
  );
}
