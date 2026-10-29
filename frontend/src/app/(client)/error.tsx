'use client';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/forms/Button';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function ClientError({ reset }: { reset: () => void }) {
  return (
    <Container className="py-16">
      <EmptyState
        icon="alert-triangle"
        title="Something went wrong"
        description="We couldn't load this page. Please try again."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </Container>
  );
}
