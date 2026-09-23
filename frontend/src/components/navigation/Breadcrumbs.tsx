import type { HTMLAttributes } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/foundation/Icon';

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items?: (string | Crumb)[];
}

export function Breadcrumbs({ items = [], ...rest }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" {...rest}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {items.map((it, i) => {
          const label = typeof it === 'string' ? it : it.label;
          const href = typeof it === 'object' ? it.href : undefined;
          const last = i === items.length - 1;
          return (
            <li key={label} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="type-body-sm font-semibold text-heading">{label}</span>
              ) : (
                <Link href={href || '#'} className="type-body-sm text-muted no-underline">{label}</Link>
              )}
              {!last && <Icon name="chevron-right" size={14} className="text-neutral-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
