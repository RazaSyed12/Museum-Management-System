'use client';

import { useEffect, useRef, useState, createElement, type CSSProperties, type ElementType, type ReactNode, type RefObject } from 'react';

/* Ported from design-system/ui_kits/visitor_site/Motion.jsx — keep in sync.
   Scroll-reveal helper for the visitor website; disabled entirely under
   prefers-reduced-motion via the .hm-rise rules in styles/visitor-motion.css.
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
export function Reveal({ delay = 0, as = 'div', style, className = '', children }: RevealProps) {
  const [ref, seen] = useInView();
  return createElement(as, {
    ref,
    className: `hm-rise ${seen ? 'is-in' : ''} ${className}`.trim(),
    style: { '--d': `${delay}ms`, ...style } as CSSProperties,
  }, children);
}
