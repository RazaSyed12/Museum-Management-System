import { Icon } from '@/components/foundation/Icon';
import { Container } from '@/components/layout/Container';
import type { ResponsiveMode } from '@/lib/useResponsiveMode';

/* Ported from the VisitStrip section in design-system/ui_kits/visitor_site/HomeScreen.jsx. */
export interface VisitStripProps {
  mode: ResponsiveMode;
}

const CELLS = [
  { icon: 'clock', title: 'Open today', body: '10:00 – 17:30 · last entry 16:45' },
  { icon: 'ticket', title: 'General admission', body: 'Free · exhibitions ticketed separately' },
  { icon: 'map-pin', title: '18 Lanthorn Street', body: 'Six minutes from Lanthorn Bridge station' },
  { icon: 'accessibility', title: 'Step-free throughout', body: 'BSL tours on the first Saturday' },
];

export function VisitStrip({ mode }: VisitStripProps) {
  return (
    <div style={{ background: 'var(--surface-inverse)', borderTop: '1px solid rgba(242,226,166,.18)' }}>
      <Container mode={mode}>
        <div style={{ display: 'grid', gridTemplateColumns: mode === 'mobile' ? '1fr' : mode === 'tablet' ? '1fr 1fr' : 'repeat(4,1fr)', gap: 'var(--space-6)', padding: 'var(--space-6) 0' }}>
          {CELLS.map((c) => (
            <div key={c.title} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
              <Icon name={c.icon} size={20} color="var(--sand-300)" />
              <span style={{ display: 'grid', gap: 2 }}>
                <span style={{ font: 'var(--type-label)', color: 'var(--paper-50)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {c.title === 'Open today' && <i className="hm-dot" />}{c.title}
                </span>
                <span style={{ font: 'var(--type-body-sm)', color: 'rgba(245,243,233,.66)' }}>{c.body}</span>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
