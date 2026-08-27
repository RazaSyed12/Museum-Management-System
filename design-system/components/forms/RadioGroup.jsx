import React from 'react';

export function RadioGroup({ name, options = [], value, onChange, legend, direction = 'column', style, ...rest }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 'var(--space-2)', ...style }} {...rest}>
      {legend && <legend style={{ font: 'var(--type-label)', color: 'var(--text-heading)', padding: 0, marginBottom: 'var(--space-1)' }}>{legend}</legend>}
      <div style={{ display: 'flex', flexDirection: direction, gap: direction === 'row' ? 'var(--space-5)' : 'var(--space-1)', flexWrap: 'wrap' }}>
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          const on = value === v;
          return (
            <label key={v} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', minHeight: 'var(--touch-target)', cursor: 'pointer' }}>
              <span style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 20, height: 20, borderRadius: '50%',
                border: 'var(--border-width-thick) solid ' + (on ? 'var(--action-primary)' : 'var(--border-default)'), background: 'var(--surface-card)' }}>
                <input type="radio" name={name} value={v} checked={on} onChange={() => onChange && onChange(v)}
                  style={{ position: 'absolute', inset: 0, opacity: 0, margin: 0, cursor: 'pointer' }} />
                {on && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--action-primary)' }} />}
              </span>
              <span style={{ font: 'var(--type-body)', color: 'var(--text-heading)' }}>{l}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
