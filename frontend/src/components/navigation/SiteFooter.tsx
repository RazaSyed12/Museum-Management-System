import type { HTMLAttributes } from 'react';
import { Logo } from '@/components/foundation/Logo';
import { Icon } from '@/components/foundation/Icon';

/* Ported from design-system/components/navigation/SiteFooter.jsx + SiteFooter.d.ts — keep in sync. */
export interface FooterColumn {
  title: string;
  links: string[];
}

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  columns?: FooterColumn[];
  assetBase?: string;
}

const COLUMNS: FooterColumn[] = [
  { title: 'Visit', links: ['Plan your visit', 'Opening hours', 'Getting here', 'Accessibility', 'Families'] },
  { title: 'Explore', links: ['Collections', 'What’s on', 'Membership', 'Learning', 'Support us'] },
  { title: 'About', links: ['Our story', 'Press', 'Work with us', 'Contact'] },
];

export function SiteFooter({ columns = COLUMNS, assetBase, style, ...rest }: SiteFooterProps) {
  return (
    <footer style={{ background: 'var(--surface-inverse)', color: 'var(--paper-100)', ...style }} {...rest}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-16) var(--container-pad-desktop) var(--space-8)', display: 'grid', gap: 'var(--space-12)', gridTemplateColumns: 'minmax(220px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(180px, 1fr)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-4)', alignContent: 'start' }}>
          <Logo variant="mark" height={52} assetBase={assetBase} />
          <p style={{ font: 'var(--type-body-sm)', color: 'rgba(245,243,233,.72)', maxWidth: 260 }}>
            Our past. Our stories. Our future.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {['instagram', 'facebook', 'youtube'].map((s) => (
              <a key={s} href="#" aria-label={s} style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: '50%', border: 'var(--border-width) solid var(--border-inverse)', color: 'var(--sand-300)' }}>
                <Icon name={s} size={18} />
              </a>
            ))}
          </div>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} style={{ display: 'grid', gap: 'var(--space-3)', alignContent: 'start' }}>
            <h4 style={{ font: 'var(--type-eyebrow)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--sand-300)' }}>{c.title}</h4>
            {c.links.map((l) => (
              <a key={l} href="#" style={{ font: 'var(--type-body-sm)', color: 'rgba(245,243,233,.8)', textDecoration: 'none' }}>{l}</a>
            ))}
          </nav>
        ))}
        <div style={{ display: 'grid', gap: 'var(--space-3)', alignContent: 'start' }}>
          <h4 style={{ font: 'var(--type-eyebrow)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--sand-300)' }}>Opening hours</h4>
          <p style={{ font: 'var(--type-body-sm)', color: 'rgba(245,243,233,.8)' }}>Mon–Fri 10:00–17:30<br />Sat–Sun 09:30–18:00<br />Last entry 45 minutes before close</p>
          <p style={{ font: 'var(--type-body-sm)', color: 'rgba(245,243,233,.8)' }}>18 Lanthorn Street<br />hello@heritagemuseum.org<br />+44 20 7946 0102</p>
        </div>
      </div>
      <div style={{ borderTop: 'var(--border-width) solid var(--border-inverse)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-5) var(--container-pad-desktop)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', justifyContent: 'space-between', font: 'var(--type-body-sm)', color: 'rgba(245,243,233,.6)' }}>
          <span>© 2026 Heritage Museum</span>
          <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            {['Privacy', 'Terms', 'Accessibility statement', 'Cookies'].map((l) => (
              <a key={l} href="#" style={{ color: 'rgba(245,243,233,.72)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
