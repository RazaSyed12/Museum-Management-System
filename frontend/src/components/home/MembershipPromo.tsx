import { Section } from '@/components/layout/Section';
import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Media } from '@/components/foundation/Media';
import type { ResponsiveMode } from '@/lib/useResponsiveMode';

/* Ported from the MembershipPromo section in design-system/ui_kits/visitor_site/HomeScreen.jsx. */
export interface MembershipPromoProps {
  mode: ResponsiveMode;
  isMember?: boolean;
  go: (label: string) => void;
}

export function MembershipPromo({ mode, isMember, go }: MembershipPromoProps) {
  return (
    <Section mode={mode} tone="accent">
      <div style={{ display: 'grid', gridTemplateColumns: mode === 'desktop' ? '1.3fr 1fr' : '1fr', gap: 'var(--space-10)', alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--gold-700)' }}>
            {isMember ? 'Your membership' : 'Membership'}
          </span>
          <h2 style={{ font: 'var(--type-h2)' }}>{isMember ? 'Thank you for supporting the museum' : 'See more, pay less, come back often'}</h2>
          <p style={{ font: 'var(--type-body)', maxWidth: 520 }}>
            {isMember
              ? 'Your member price is applied automatically at checkout, and member tickets are held for you until 48 hours before each event.'
              : 'Members pay a reduced price on every ticketed event, book from a reserved allocation, and see new exhibitions a week early.'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {isMember
              ? <><StatusBadge tone="member">Active member</StatusBadge><Button variant="secondary" onClick={() => go('Membership')}>View your benefits</Button></>
              : <><Button className="hm-sheen" onClick={() => go('Membership')}>Become a member</Button><Button variant="ghost" onClick={() => go('Membership')}>Compare benefits</Button></>}
          </div>
        </div>
        {mode === 'desktop' && <Media ratio="4 / 3" tone="sand" caption="Members' evening, Great Hall" />}
      </div>
    </Section>
  );
}
