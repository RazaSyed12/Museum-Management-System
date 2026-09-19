import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* Ported from the Grid helper in design-system/ui_kits/visitor_site/Shell.jsx.
   The source took per-mode column counts (desktop / tablet / mobile); the two
   shapes the site uses are named here instead, because Tailwind can only see
   complete class names, not ones assembled from a number. */
const COLUMNS = {
  /** 3 columns on desktop, 2 on tablet, 1 on mobile. */
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  /** 2 columns from tablet up, 1 on mobile. */
  2: 'grid-cols-1 md:grid-cols-2',
} as const;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: keyof typeof COLUMNS;
}

export function Grid({ cols = 3, className, ...rest }: GridProps) {
  return <div className={cn('grid gap-5', COLUMNS[cols], className)} {...rest} />;
}
