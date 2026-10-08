import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* Ported from design-system/components/feedback/Skeleton.jsx + Skeleton.d.ts.
   The source took a free-form `radius` prop; dropped in favour of a
   `className` override (e.g. "rounded-md") like every other primitive here. */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ width = '100%', height = 16, className, style, ...rest }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block animate-shimmer rounded-sm bg-[linear-gradient(90deg,var(--color-paper-100)_25%,var(--color-paper-200)_37%,var(--color-paper-100)_63%)] bg-[length:200%_100%]',
        className,
      )}
      // Per-instance values (every call site sizes this differently) can't be static classes.
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}

/** Card-shaped loading placeholder matching CollectionCard / EventCard geometry. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div aria-busy="true" aria-label="Loading" className={cn('grid gap-3 rounded-lg border border-line-subtle bg-surface-card p-4', className)}>
      <Skeleton height={150} className="rounded-md" />
      <Skeleton width="45%" height={12} />
      <Skeleton width="85%" height={18} />
      <Skeleton width="65%" height={12} />
    </div>
  );
}
