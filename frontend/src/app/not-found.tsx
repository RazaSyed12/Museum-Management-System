'use client';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/forms/Button';
import { Section } from '@/components/layout/Section';
import { useResponsiveMode } from '@/lib/useResponsiveMode';
import { useSiteNav } from '@/lib/nav';

/** Branded 404 for URLs that don't match any route — distinct from
 * UnderConstruction, which is for routes we know about but haven't built. */
export default function NotFound() {
  const mode = useResponsiveMode('auto');
  const nav = useSiteNav();

  return (
    <Section mode={mode}>
      <EmptyState
        icon="compass"
        title="Page not found"
        description="The page you're looking for doesn't exist, or may have moved."
        action={<Button variant="secondary" onClick={() => nav.go('Home')}>Back to home</Button>}
      />
    </Section>
  );
}
