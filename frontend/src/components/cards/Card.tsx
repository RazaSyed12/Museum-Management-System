'use client';

import { useState, type HTMLAttributes } from 'react';

/* Ported from design-system/components/cards/Card.jsx + Card.d.ts — keep in sync. */
export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Enables the hover lift + olive border. Use for anything clickable. */
  interactive?: boolean;
  /** Set to 0 when the card holds an edge-to-edge image. */
  padding?: string | number;
  as?: 'div' | 'a' | 'article' | 'li';
  href?: string;
}

export function Card({ interactive, padding = 'var(--space-5)', as = 'div', children, style, ...rest }: CardProps) {
  const [hover, setHover] = useState(false);
  const Tag = as;
  return (
    <Tag
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: 'var(--border-width) solid ' + (hover ? 'var(--border-strong)' : 'var(--border-subtle)'),
        borderRadius: 'var(--radius-lg)',
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'var(--transition-surface), border-color var(--duration-fast) var(--ease-out)',
        overflow: 'hidden', padding, textDecoration: 'none', display: 'block',
        cursor: interactive ? 'pointer' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
