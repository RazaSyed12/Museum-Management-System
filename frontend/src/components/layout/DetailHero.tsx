import type { ReactNode } from 'react';
import { Media } from '@/components/foundation/Media';
import { Container } from './Container';
import { Breadcrumbs, type Crumb } from '@/components/navigation/Breadcrumbs';
import { Icon } from '@/components/foundation/Icon';

/* A dark photo hero with breadcrumbs, an eyebrow, a meta row and actions —
   generic enough that both the collection and event detail screens use it,
   so it lives here alongside the other shared layout primitives rather
   than inside one screen's own component file. */
export interface DetailHeroProps {
  crumbs: (string | Crumb)[];
  title: string;
  eyebrow?: ReactNode;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function DetailHero({ crumbs, title, eyebrow, description, meta, actions }: DetailHeroProps) {
  return (
    <div className="relative bg-green-900">
      <Media tone="green" ratio="auto" caption="Collection photography" className="absolute inset-0 h-full rounded-none" />
      <div className="scrim-hero absolute inset-0" />
      <Container className="relative py-6 md:py-8 md:pb-16">
        {/* invert() turns the design system's dark-text breadcrumb into a legible light one over the photo, without a separate light variant of the component. */}
        <div className="mb-6 [filter:invert(1)_grayscale(1)_brightness(2)]">
          <Breadcrumbs items={crumbs} />
        </div>
        <div className="grid max-w-155 gap-4">
          {eyebrow}
          <h1 className="text-3xl/[1.1] text-paper-50 md:text-5xl/[1.05]">{title}</h1>
          {description && <p className="type-body text-paper-100/86">{description}</p>}
          {meta && <div className="type-body-sm flex flex-wrap gap-5 text-sand-300">{meta}</div>}
          {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </Container>
    </div>
  );
}

export function MetaItem({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon name={icon} size={16} />
      {children}
    </span>
  );
}
