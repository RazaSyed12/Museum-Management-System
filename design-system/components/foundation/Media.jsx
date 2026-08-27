import React from 'react';

const TONES = {
  olive: ['#8A9F59', '#455326'],
  green: ['#3E6B4A', '#14231A'],
  sand: ['#E8CE7C', '#A5851F'],
  stone: ['#B4AF9E', '#4A473D'],
};

/* Stand-in for museum photography. Swap the placeholder for a real <img> when
   artefact photography is available — the ratio, radius and scrim stay the same. */
export function Media({ src, alt = '', ratio = '4 / 3', tone = 'olive', caption, radius = 'var(--radius-lg)', scrim = false, children, style, ...rest }) {
  const [a, b] = TONES[tone] || TONES.olive;
  return (
    <div
      style={{
        position: 'relative', aspectRatio: ratio, overflow: 'hidden', borderRadius: radius,
        background: src ? 'var(--surface-sunken)' : `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 'var(--space-4)' }}>
          <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'rgba(255,255,255,.82)' }}>
            {caption || alt || 'Museum photography'}
          </span>
        </div>
      )}
      {scrim && <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-image)' }} />}
      {children && <div style={{ position: 'absolute', inset: 0 }}>{children}</div>}
    </div>
  );
}
