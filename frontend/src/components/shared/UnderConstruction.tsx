'use client';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/forms/Button';
import { Section } from '@/components/layout/Section';
import { useSiteNav } from '@/lib/nav';

export interface UnderConstructionProps {
  title: string;
  description?: string;
}

/**
 * Placeholder content for routes that are linked from navigation (see
 * lib/nav.ts's ROUTES) but don't have a real page built yet. Renders inside
 * the shared SiteChrome like any other page, so it still gets the header,
 * footer and mobile nav — only the page body is a stand-in.
 */
export function UnderConstruction({ title, description }: UnderConstructionProps) {
  const nav = useSiteNav();

  return (
    <Section>
      <EmptyState
        icon="construction"
        title={title}
        description={description ?? 'This page is still being built. Check back soon.'}
        action={<Button variant="secondary" onClick={() => nav.go('Home')}>Back to home</Button>}
      />
    </Section>
  );
}
