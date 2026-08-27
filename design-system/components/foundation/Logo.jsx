import React from 'react';

const SRC = {
  primary: 'logo-primary.png',
  horizontal: 'logo-lockup-horizontal.png',
  mark: 'logo-mark.png',
};

export function Logo({ variant = 'horizontal', height, assetBase = '../../assets/', href, style, ...rest }) {
  const h = height ?? (variant === 'primary' ? 140 : variant === 'mark' ? 40 : 44);
  const img = (
    <img
      src={assetBase + SRC[variant]}
      alt="Heritage Museum"
      style={{ height: h, width: 'auto', display: 'block', ...style }}
      {...rest}
    />
  );
  return href ? <a href={href} style={{ display: 'inline-flex', textDecoration: 'none' }}>{img}</a> : img;
}
