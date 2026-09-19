import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* Stand-in for museum photography. Swap the placeholder for a real <img> when
   artefact photography is available — the ratio, radius and scrim stay the same.
   Ported from design-system/components/foundation/Media.jsx + Media.d.ts. The
   `radius` prop became `className` (rounded-none for edge-to-edge use). */
const TONES = {
  olive: 'from-olive-400 to-olive-700',
  green: 'from-green-400 to-green-950',
  sand: 'from-sand-400 to-gold-700',
  stone: 'from-neutral-400 to-neutral-700',
} as const;

export interface MediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Real photograph URL. Omitted = duotone placeholder block. */
  src?: string;
  alt?: string;
  /** CSS aspect-ratio, e.g. "16 / 9", "4 / 3", "1 / 1". */
  ratio?: string;
  tone?: keyof typeof TONES;
  /** Placeholder label describing the intended shot. */
  caption?: string;
  /** Apply the bottom protection gradient for overlaid text. */
  scrim?: boolean;
}

export function Media({ src, alt = '', ratio = '4 / 3', tone = 'olive', caption, scrim = false, children, className, style, ...rest }: MediaProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        src ? 'bg-surface-sunken' : ['bg-linear-135/srgb', TONES[tone]],
        className,
      )}
      style={{ aspectRatio: ratio, ...style }}
      {...rest}
    >
      {src ? (
        /* Media is a design-system primitive ported as-is; revisit next/image once real artefact photography (with known dimensions) replaces the placeholder. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="size-full object-cover transition-transform duration-800 ease-[cubic-bezier(0.22,0.7,0.2,1)] group-hover/card:scale-105 motion-reduce:transition-none"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-4 text-center">
          <span className="type-eyebrow tracking-wider text-white/82 uppercase">
            {caption || alt || 'Museum photography'}
          </span>
        </div>
      )}
      {scrim && <div className="scrim-image absolute inset-0" />}
      {children && <div className="absolute inset-0">{children}</div>}
    </div>
  );
}
