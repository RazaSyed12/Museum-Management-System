'use client';

import { useEffect, useState } from 'react';

export type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';
export type ResponsiveModeInput = ResponsiveMode | 'auto';

const MOBILE_MAX = 768;
const TABLET_MAX = 1100;

function widthToMode(width: number): ResponsiveMode {
  if (width < MOBILE_MAX) return 'mobile';
  if (width < TABLET_MAX) return 'tablet';
  return 'desktop';
}

/**
 * Single source of truth for the design system's desktop/tablet/mobile
 * layout mode. The Heritage Museum components (Container, Section, Grid,
 * SiteHeader, ...) take an explicit `mode` prop rather than relying on CSS
 * media queries internally, so every page needs exactly one of these and
 * threads the result down — this hook is that one place, instead of each
 * component re-implementing its own resize listener.
 *
 * Defaults to 'desktop' until mounted so server and first client render
 * match (no layout flash); pass a fixed mode instead of 'auto' to opt out
 * of measuring the viewport entirely.
 */
export function useResponsiveMode(mode: ResponsiveModeInput = 'auto'): ResponsiveMode {
  const [measured, setMeasured] = useState<ResponsiveMode>('desktop');

  useEffect(() => {
    if (mode !== 'auto') return undefined;
    const read = () => setMeasured(widthToMode(window.innerWidth));
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [mode]);

  return mode === 'auto' ? measured : mode;
}
