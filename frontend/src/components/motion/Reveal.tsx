'use client';

import { useEffect, useRef, useState, createElement, type CSSProperties, type ElementType, type ReactNode, type RefObject } from 'react';
import { cn } from '@/lib/cn';

/* Ported from design-system/ui_kits/visitor_site/Motion.jsx.
   Scroll-reveal helper for the visitor website. The rise animation and its
   reduced-motion opt-out are Tailwind utilities (animate-rise, defined in
   styles/theme.css); the `is-in` class it adds is also what makes a `ruled`
   heading inside it draw its rule (styles/utilities.css).
   No caller ever needs a custom IntersectionObserverInit (Reveal always
   calls this with no arguments), so the options param the source carried
   is dropped — that also removes the exhaustive-deps question of whether
   an options object should be in the effect's dependency array. */
function useInView(): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    io.observe(el);
    // Anything already on screen at mount reveals immediately.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) setSeen(true);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

export interface RevealProps {
  delay?: number;
  as?: ElementType;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/** Wraps children in a rise-and-fade block that plays once when scrolled into view. */
export function Reveal({ delay = 0, as = 'div', style, className, children }: RevealProps) {
  const [ref, seen] = useInView();
  return createElement(as, {
    ref,
    className: cn(
      'opacity-0 will-change-[opacity,transform] motion-reduce:opacity-100',
      seen && 'is-in animate-rise motion-reduce:animate-none',
      className,
    ),
    // The stagger delay differs per instance, so it travels as a variable that animate-rise reads.
    style: { '--d': `${delay}ms`, ...style } as CSSProperties,
  }, children);
}
