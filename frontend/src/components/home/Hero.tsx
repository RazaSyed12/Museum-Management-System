import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { Media } from '@/components/foundation/Media';
import { Container } from '@/components/layout/Container';
import type { ResponsiveMode } from '@/lib/useResponsiveMode';
import { events } from '@/lib/sample-data';

/* Ported from the Hero section in design-system/ui_kits/visitor_site/HomeScreen.jsx. */
export interface HeroProps {
  mode: ResponsiveMode;
  go: (label: string) => void;
}

export function Hero({ mode, go }: HeroProps) {
  const e = events.find((x) => x.id === 'beneath')!;
  const small = mode === 'mobile';
  return (
    <section style={{ position: 'relative', background: 'var(--green-900)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }} className="hm-hero-bg">
        <Media tone="green" ratio="auto" radius="0" caption="Exhibition photography — Great Hall" style={{ height: '100%', aspectRatio: 'auto' }} />
        <div style={{ position: 'absolute', inset: 0, background: small ? 'var(--scrim-image)' : 'var(--scrim-hero)' }} />
      </div>
      <Container mode={mode} style={{ position: 'relative' }}>
        <div className="hm-hero-in" style={{ maxWidth: small ? '100%' : 560, padding: small ? 'var(--space-16) 0 var(--space-10)' : 'var(--space-24) 0', display: 'grid', gap: 'var(--space-5)' }}>
          <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--sand-300)' }}>Current exhibition</span>
          <h1 style={{ font: small ? 'var(--weight-regular) var(--text-4xl)/1.05 var(--font-display)' : 'var(--weight-regular) var(--text-6xl)/1.05 var(--font-display)', color: 'var(--paper-50)' }}>{e.title}</h1>
          <p style={{ font: 'var(--type-body)', fontSize: small ? 16 : 18, color: 'rgba(245,243,233,.86)', maxWidth: 480 }}>{e.description}</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', font: 'var(--type-body-sm)', color: 'var(--sand-300)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon name="calendar-days" size={16} />3 Jul 2026 – 3 Jan 2027</span>
            <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon name="map-pin" size={16} />Exhibition Wing</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
            <Button className="hm-sheen" variant="accent" size={small ? 'md' : 'lg'} onClick={() => go('Collection')}>Explore exhibition</Button>
            <Button className="hm-sheen" variant="secondary" size={small ? 'md' : 'lg'} onClick={() => go('Tickets')}
              style={{ color: 'var(--paper-50)', borderColor: 'rgba(242,226,166,.5)' }}>Book tickets</Button>
          </div>
        </div>
      </Container>
      {!small && (
        <div style={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', display: 'grid', justifyItems: 'center', gap: 6, color: 'var(--sand-300)' }}>
          <span style={{ font: 'var(--type-body-sm)', fontSize: 11, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', opacity: .75 }}>Scroll</span>
          <span className="hm-cue" style={{ display: 'inline-flex' }}><Icon name="chevron-down" size={18} /></span>
        </div>
      )}
    </section>
  );
}
