// Scroll-reveal helpers for the visitor website.
function useInView(options) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08, ...options });
    io.observe(el);
    // Anything already on screen at mount reveals immediately.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) setSeen(true);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

// Wraps children in a rise-and-fade block that plays once when scrolled into view.
function Reveal({ delay = 0, as = 'div', style, className = '', children }) {
  const [ref, seen] = useInView();
  return React.createElement(as, {
    ref,
    className: `hm-rise ${seen ? 'is-in' : ''} ${className}`.trim(),
    style: { '--d': `${delay}ms`, ...style },
  }, children);
}

Object.assign(window, { useInView, Reveal });
