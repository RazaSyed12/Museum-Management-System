import type { ImgHTMLAttributes } from 'react';

/* Ported from design-system/components/foundation/Logo.jsx + Logo.d.ts. The
   only change from the source is the `assetBase` default: the design
   system's preview kits sit two directories below assets/ (`../../assets/`);
   in this app the files are copied into public/assets/, served from the
   site root. */
const SRC = {
  primary: 'logo-primary.png',
  horizontal: 'logo-lockup-horizontal.png',
  mark: 'logo-mark.png',
} as const;

export interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** primary = stacked temple lockup, horizontal = mark + wordmark (header default), mark = circular H badge (mobile / favicon). */
  variant?: keyof typeof SRC;
  /** Rendered height in px. */
  height?: number;
  /** Path to the design system's assets/ directory. */
  assetBase?: string;
  href?: string;
}

export function Logo({ variant = 'horizontal', height, assetBase = '/assets/', href, style, ...rest }: LogoProps) {
  const h = height ?? (variant === 'primary' ? 140 : variant === 'mark' ? 40 : 44);
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- fixed brand asset, ported as-is from the design system
    <img
      src={assetBase + SRC[variant]}
      alt="Heritage Museum"
      style={{ height: h, width: 'auto', display: 'block', ...style }}
      {...rest}
    />
  );
  return href ? <a href={href} style={{ display: 'inline-flex', textDecoration: 'none' }}>{img}</a> : img;
}
