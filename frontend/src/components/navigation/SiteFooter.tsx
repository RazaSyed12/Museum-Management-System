import type { HTMLAttributes } from 'react';
import { Logo } from '@/components/foundation/Logo';
import { Icon } from '@/components/foundation/Icon';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/cn';

/* The grid collapses: 2 columns on mobile, 3 on tablet, 5 on desktop —
   with the brand block and the opening-hours block spanning the full row
   until there's room for them to sit alongside the link columns. */
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

const HEADING = 'type-eyebrow tracking-wider text-sand-300 uppercase';

export function SiteFooter({ columns = COLUMNS, assetBase, className, ...rest }: SiteFooterProps) {
  return (
    <footer className={cn('bg-surface-inverse text-paper-100', className)} {...rest}>
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 pt-16 pb-8 md:grid-cols-3 md:gap-12 lg:grid-cols-[minmax(220px,1.2fr)_repeat(3,minmax(120px,1fr))_minmax(180px,1fr)]">
        <div className="col-span-2 grid content-start gap-4 md:col-span-3 lg:col-span-1">
          <Logo variant="mark" height={52} assetBase={assetBase} />
          <p className="type-body-sm max-w-65 text-paper-100/72">Our past. Our stories. Our future.</p>
          <div className="flex gap-3">
            {['instagram', 'facebook', 'youtube'].map((s) => (
              <a key={s} href="#" aria-label={s} className="grid size-10 place-items-center rounded-full border border-line-inverse text-sand-300 no-underline">
                <Icon name={s} size={18} />
              </a>
            ))}
          </div>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="grid content-start gap-3">
            <h4 className={HEADING}>{c.title}</h4>
            {c.links.map((l) => (
              <a key={l} href="#" className="type-body-sm text-paper-100/80 no-underline">{l}</a>
            ))}
          </nav>
        ))}
        <div className="col-span-2 grid content-start gap-3 md:col-span-3 lg:col-span-1">
          <h4 className={HEADING}>Opening hours</h4>
          <p className="type-body-sm text-paper-100/80">Mon–Fri 10:00–17:30<br />Sat–Sun 09:30–18:00<br />Last entry 45 minutes before close</p>
          <p className="type-body-sm text-paper-100/80">18 Lanthorn Street<br />hello@heritagemuseum.org<br />+44 20 7946 0102</p>
        </div>
      </Container>
      <div className="border-t border-line-inverse">
        <Container className="type-body-sm flex flex-wrap justify-between gap-5 py-5 text-paper-100/60">
          <span>© 2026 Heritage Museum</span>
          <div className="flex flex-wrap gap-5">
            {['Privacy', 'Terms', 'Accessibility statement', 'Cookies'].map((l) => (
              <a key={l} href="#" className="text-paper-100/72 no-underline">{l}</a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
