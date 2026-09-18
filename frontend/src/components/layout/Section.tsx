import type { CSSProperties, ReactNode } from 'react';
import type { ResponsiveMode } from '@/lib/useResponsiveMode';
import { Container } from './Container';
import { Reveal } from '@/components/motion/Reveal';

/* Ported from the Section helper in design-system/ui_kits/visitor_site/Shell.jsx. */
export interface SectionProps {
  mode: ResponsiveMode;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children?: ReactNode;
  tone?: 'muted' | 'accent';
  style?: CSSProperties;
}

export function Section({ mode, title, eyebrow, action, children, tone, style }: SectionProps) {
  return (
    <section style={{ background: tone === 'muted' ? 'var(--surface-sunken)' : tone === 'accent' ? 'var(--surface-accent)' : 'transparent',
      padding: `${mode === 'mobile' ? 'var(--space-10)' : 'var(--space-16)'} 0`, ...style }}>
      <Container mode={mode}>
        {(title || action) && (
          <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: 6 }}>
              {eyebrow && <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--olive-600)' }}>{eyebrow}</span>}
              {title && <h2 className="hm-ruled" style={{ font: mode === 'mobile' ? 'var(--weight-regular) var(--text-2xl)/1.2 var(--font-display)' : 'var(--type-h2)' }}>{title}</h2>}
            </div>
            {action}
          </Reveal>
        )}
        <Reveal delay={110}>{children}</Reveal>
      </Container>
    </section>
  );
}
