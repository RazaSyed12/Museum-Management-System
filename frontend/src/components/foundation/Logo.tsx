import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* `assetBase` defaults to the site root; files are copied into public/assets/. */
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

export function Logo({ variant = 'horizontal', height, assetBase = '/assets/', href, className, style, ...rest }: LogoProps) {
  const h = height ?? (variant === 'primary' ? 140 : variant === 'mark' ? 40 : 44);
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- fixed brand asset, ported as-is from the design system
    <img
      src={assetBase + SRC[variant]}
      alt="Heritage Museum"
      className={cn('block w-auto', className)}
      style={{ height: h, ...style }}
      {...rest}
    />
  );
  return href ? <a href={href} className="inline-flex no-underline">{img}</a> : img;
}
