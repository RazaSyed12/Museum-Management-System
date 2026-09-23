import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* Gutters are breakpoint utilities (20 / 32 / 48px = --container-pad-mobile /
   -tablet / -desktop), so there's nothing to pass and no client-side measuring. */
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto max-w-page px-5 md:px-8 lg:px-12', className)} {...rest} />;
}
