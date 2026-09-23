import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* Hover lift is CSS rather than React state, and `padding` is a
   className (`p-0` for an edge-to-edge image; the default is p-5).
   The `group/card` hook lets a Media image inside zoom on card hover. */
export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Enables the hover lift + olive border. Use for anything clickable. */
  interactive?: boolean;
  as?: 'div' | 'a' | 'article' | 'li';
  href?: string;
}

export function Card({ interactive, as: Tag = 'div', children, className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        'group/card block overflow-hidden rounded-lg border border-line-subtle bg-surface-card p-5 no-underline shadow-xs transition-surface',
        interactive && 'cursor-pointer hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
