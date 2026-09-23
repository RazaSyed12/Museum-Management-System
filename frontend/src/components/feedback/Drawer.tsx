'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { IconButton } from '@/components/forms/IconButton';
import { cn } from '@/lib/cn';

/* The scrim is `fixed` so it covers the whole page height regardless of scroll
   position, rather than only the initial viewport. */
export interface DrawerProps extends HTMLAttributes<HTMLElement> {
  open?: boolean;
  /** left = mobile navigation, right = staff detail panels, bottom = mobile filters. */
  side?: 'left' | 'right' | 'bottom';
  title?: string;
  footer?: ReactNode;
  onClose?: () => void;
  /** Width in px for side drawers. */
  size?: number;
}

export function Drawer({ open = true, side = 'right', title, children, footer, onClose, size = 340, className, style, ...rest }: DrawerProps) {
  if (!open) return null;
  const vertical = side === 'bottom';
  return (
    <div
      role="presentation"
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-60 flex bg-overlay-scrim',
        side === 'right' ? 'justify-end' : 'justify-start',
        vertical ? 'items-end' : 'items-stretch',
      )}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex flex-col bg-surface-card shadow-xl',
          vertical ? 'max-h-[82%] w-full rounded-t-xl' : 'h-full',
          className,
        )}
        // Side drawers take their width from the `size` prop, which isn't known until render.
        style={vertical ? style : { width: size, ...style }}
        {...rest}
      >
        <header className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
          <h2 className="type-h3 flex-1">{title}</h2>
          {onClose && <IconButton icon="x" label="Close" onClick={onClose} size="sm" />}
        </header>
        <div className="flex-1 overflow-auto p-5">{children}</div>
        {footer && <footer className="flex gap-3 border-t border-line-subtle px-5 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}
