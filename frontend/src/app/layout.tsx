import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond, Source_Sans_3 } from 'next/font/google';
import { SiteChrome } from '@/components/layout/SiteChrome';
import './globals.css';

/* Self-hosted at build time by next/font (no runtime request to Google Fonts,
   no layout shift) in place of tokens/fonts.css's @import. Each family is
   exposed as a CSS variable, which globals.css points the design system's
   --font-display / --font-body roles at. */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-sans',
});

export const metadata: Metadata = {
  title: { default: 'Heritage Museum', template: '%s · Heritage Museum' },
  description: 'Our past. Our stories. Our future.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${sourceSans3.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
