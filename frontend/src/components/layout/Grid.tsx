import type { CSSProperties, ReactNode } from 'react';
import type { ResponsiveMode } from '@/lib/useResponsiveMode';

/* Ported from the Grid helper in design-system/ui_kits/visitor_site/Shell.jsx. */
export interface GridProps {
  mode: ResponsiveMode;
  desktop?: number;
  tablet?: number;
  mobile?: number;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Grid({ mode, desktop = 3, tablet = 2, mobile = 1, children, style, className = '' }: GridProps) {
  const cols = mode === 'mobile' ? mobile : mode === 'tablet' ? tablet : desktop;
  return <div className={`hm-lift ${className}`.trim()} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 'var(--space-5)', ...style }}>{children}</div>;
}
