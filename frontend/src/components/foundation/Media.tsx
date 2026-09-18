import type { HTMLAttributes } from 'react';

/* Stand-in for museum photography. Swap the placeholder for a real <img> when
   artefact photography is available — the ratio, radius and scrim stay the same.
   Ported from design-system/components/foundation/Media.jsx + Media.d.ts — keep in sync. */
const TONES: Record<string, [string, string]> = {
  olive: ['#8A9F59', '#455326'],
  green: ['#3E6B4A', '#14231A'],
  sand: ['#E8CE7C', '#A5851F'],
  stone: ['#B4AF9E', '#4A473D'],
};

export interface MediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Real photograph URL. Omitted = duotone placeholder block. */
  src?: string;
  alt?: string;
  /** CSS aspect-ratio, e.g. "16 / 9", "4 / 3", "1 / 1". */
  ratio?: string;
  tone?: 'olive' | 'green' | 'sand' | 'stone';
  /** Placeholder label describing the intended shot. */
  caption?: string;
  radius?: string;
  /** Apply the bottom protection gradient for overlaid text. */
  scrim?: boolean;
}

export function Media({ src, alt = '', ratio = '4 / 3', tone = 'olive', caption, radius = 'var(--radius-lg)', scrim = false, children, style, ...rest }: MediaProps) {
  const [a, b] = TONES[tone] || TONES.olive!;
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
        /* Media is a design-system primitive ported as-is; revisit next/image once real artefact photography (with known dimensions) replaces the placeholder. */
        // eslint-disable-next-line @next/next/no-img-element
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
