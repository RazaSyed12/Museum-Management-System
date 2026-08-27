import React from 'react';

/* Lucide (lucide.dev, ISC) is used as the Heritage Museum icon set — the brand
   sheet shipped no icon library. Glyphs are pulled from the lucide-static CDN and
   painted with currentColor via a CSS mask so they inherit text colour. */
const CDN = 'https://unpkg.com/lucide-static@0.454.0/icons/';

export function Icon({ name, size = 20, strokeWidth, color = 'currentColor', label, style, ...rest }) {
  const url = `url("${CDN}${name}.svg")`;
  return (
    <span
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        display: 'inline-block', width: size, height: size, flex: '0 0 auto',
        backgroundColor: color,
        WebkitMaskImage: url, maskImage: url,
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center', maskPosition: 'center',
        WebkitMaskSize: 'contain', maskSize: 'contain',
        opacity: strokeWidth === 'light' ? 0.72 : 1,
        ...style,
      }}
      {...rest}
    />
  );
}
