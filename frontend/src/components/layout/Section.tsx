import type { HTMLAttributes, ReactNode } from 'react';
import { Container } from './Container';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  tone?: 'muted' | 'accent';
}

export function Section({ title, eyebrow, action, children, tone, className, ...rest }: SectionProps) {
  return (
    <section
      className={cn(
        'py-10 md:py-16',
        tone === 'muted' && 'bg-surface-sunken',
        tone === 'accent' && 'bg-surface-accent',
        className,
      )}
      {...rest}
    >
      <Container>
        {(title || action) && (
          <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1.5">
              {eyebrow && <span className="type-eyebrow tracking-wider text-olive-600 uppercase">{eyebrow}</span>}
              {title && <h2 className="ruled text-2xl/[1.2] md:text-3xl/snug">{title}</h2>}
            </div>
            {action}
          </Reveal>
        )}
        <Reveal delay={110}>{children}</Reveal>
      </Container>
    </section>
  );
}
