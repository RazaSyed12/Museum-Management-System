import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* Lucide (lucide.dev, ISC) is used as the Heritage Museum icon set — the brand
   sheet shipped no icon library. Glyphs are pulled from the lucide-static CDN and
   painted with the current text colour via a CSS mask, so colour an icon with a
   text utility:  <Icon name="clock" className="text-sand-300" />
   Ported from design-system/components/foundation/Icon.jsx + Icon.d.ts. */
const CDN = 'https://unpkg.com/lucide-static@0.454.0/icons/';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon slug, e.g. "calendar-days", "ticket", "search". */
  name: string;
  /** Pixel box. 16 inline, 20 default, 24 nav, 32 feature. */
  size?: number;
  strokeWidth?: 'light' | 'normal';
  /** Accessible name. Omit for purely decorative icons (renders aria-hidden). */
  label?: string;
}

export function Icon({ name, size = 20, strokeWidth, label, className, style, ...rest }: IconProps) {
  const url = `url("${CDN}${name}.svg")`;
  return (
    <span
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        'inline-block flex-none bg-current mask-center mask-contain mask-no-repeat',
        strokeWidth === 'light' && 'opacity-72',
        className,
      )}
      // Per-instance values (which glyph, what size) can't be static classes.
      style={{ width: size, height: size, maskImage: url, WebkitMaskImage: url, ...style }}
      {...rest}
    />
  );
}
