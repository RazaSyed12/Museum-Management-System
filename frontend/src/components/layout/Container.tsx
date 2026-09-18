import type { CSSProperties, ReactNode } from 'react';
import type { ResponsiveMode } from '@/lib/useResponsiveMode';

/* Ported from the Container helper in design-system/ui_kits/visitor_site/Shell.jsx. */
const PAD: Record<ResponsiveMode, string> = {
  desktop: 'var(--container-pad-desktop)',
  tablet: 'var(--container-pad-tablet)',
  mobile: 'var(--container-pad-mobile)',
};

export interface ContainerProps {
  mode: ResponsiveMode;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Container({ mode, children, style }: ContainerProps) {
  return <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: `0 ${PAD[mode]}`, ...style }}>{children}</div>;
}
