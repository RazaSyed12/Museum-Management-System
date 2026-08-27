import React from 'react';

export function Skeleton({ width = '100%', height = 16, radius = 'var(--radius-sm)', style, ...rest }) {
  return (
    <span aria-hidden="true" style={{
      display: 'block', width, height, borderRadius: radius,
      background: 'linear-gradient(90deg,var(--paper-100) 25%,var(--paper-200) 37%,var(--paper-100) 63%)',
      backgroundSize: '200% 100%', animation: 'hm-shimmer 1.4s ease-in-out infinite', ...style,
    }} {...rest} />
  );
}

export function SkeletonCard({ style }) {
  return (
    <div aria-busy="true" aria-label="Loading" style={{ display: 'grid', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--surface-card)', border: 'var(--border-width) solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', ...style }}>
      <Skeleton height={150} radius="var(--radius-md)" />
      <Skeleton width="45%" height={12} />
      <Skeleton width="85%" height={18} />
      <Skeleton width="65%" height={12} />
    </div>
  );
}
