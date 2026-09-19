import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Joins class names and resolves Tailwind conflicts, so a component's own
 * classes can be overridden by whatever `className` the caller passes:
 *
 *   cn('bg-olive-50 p-5', className)   // caller's `bg-*` / `p-*` win
 *
 * tailwind-merge only knows Tailwind's built-in names, so the design
 * system's custom ones (theme.css / utilities.css) are registered here —
 * otherwise `rounded-pill` wouldn't conflict with `rounded-lg`, and a
 * `type-*` role wouldn't conflict with an explicit `text-sm`.
 */
const twMerge = extendTailwindMerge<'type-role'>({
  extend: {
    theme: {
      radius: ['pill'],
      shadow: ['focus', 'danger-ring'],
    },
    classGroups: {
      'type-role': [
        { type: ['display', 'h1', 'h2', 'h3', 'eyebrow', 'body', 'body-sm', 'label', 'button'] },
      ],
    },
    conflictingClassGroups: {
      'type-role': ['font-family', 'font-size', 'font-weight', 'leading'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
