import React from 'react';
import { Icon } from '../foundation/Icon.jsx';
import { Button } from './Button.jsx';

export function ImageUpload({ fileName, previewTone = 'olive', hint = 'JPG or PNG, at least 1600px wide, max 5MB', onRemove, invalid, style, ...rest }) {
  const [over, setOver] = React.useState(false);
  if (fileName) {
    return (
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-3)', border: 'var(--border-width) solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)', ...style }}>
        <div style={{ width: 96, height: 72, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg,#8A9F59,#455326)', flex: '0 0 auto' }} />
        <div style={{ display: 'grid', gap: 2, flex: 1, minWidth: 0 }}>
          <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Uploaded</span>
        </div>
        <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={onRemove}>Remove</Button>
      </div>
    );
  }
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); }}
      style={{
        display: 'grid', gap: 'var(--space-3)', justifyItems: 'center', textAlign: 'center',
        padding: 'var(--space-8) var(--space-6)', borderRadius: 'var(--radius-lg)',
        border: '2px dashed ' + (invalid ? 'var(--danger-600)' : over ? 'var(--olive-500)' : 'var(--border-default)'),
        background: over ? 'var(--olive-50)' : 'var(--surface-card)', transition: 'var(--transition-control)', ...style,
      }}
      {...rest}
    >
      <Icon name="image-up" size={28} color="var(--olive-500)" />
      <div style={{ display: 'grid', gap: 4 }}>
        <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>Drag an image here, or browse</span>
        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{hint}</span>
      </div>
      <Button variant="secondary" size="sm">Choose file</Button>
    </div>
  );
}
