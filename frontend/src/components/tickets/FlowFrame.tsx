import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { Steps } from './Steps';

export interface FlowFrameProps {
  step: number;
  title: string;
  children: ReactNode;
  aside: ReactNode;
}

/** Shared shell for all four ticket-purchase steps: a step indicator bar,
 *  then a title and a two-column (content + order summary) layout. */
export function FlowFrame({ step, title, children, aside }: FlowFrameProps) {
  return (
    <>
      <div className="border-b border-line-subtle bg-surface-card">
        <Container className="py-5">
          <Steps step={step} />
        </Container>
      </div>
      <Container className="py-8 md:py-12">
        <h1 className="mb-8 text-3xl/[1.1] md:type-h1">{title}</h1>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6">{children}</div>
          {aside}
        </div>
      </Container>
    </>
  );
}
