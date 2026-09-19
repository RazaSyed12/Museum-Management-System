import { Section } from '@/components/layout/Section';
import { Button } from '@/components/forms/Button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Media } from '@/components/foundation/Media';

/* Ported from the MembershipPromo section in design-system/ui_kits/visitor_site/HomeScreen.jsx. */
export interface MembershipPromoProps {
  isMember?: boolean;
  go: (label: string) => void;
}

export function MembershipPromo({ isMember, go }: MembershipPromoProps) {
  return (
    <Section tone="accent">
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid gap-4">
          <span className="type-eyebrow tracking-wider text-gold-700 uppercase">
            {isMember ? 'Your membership' : 'Membership'}
          </span>
          <h2 className="type-h2">{isMember ? 'Thank you for supporting the museum' : 'See more, pay less, come back often'}</h2>
          <p className="type-body max-w-130">
            {isMember
              ? 'Your member price is applied automatically at checkout, and member tickets are held for you until 48 hours before each event.'
              : 'Members pay a reduced price on every ticketed event, book from a reserved allocation, and see new exhibitions a week early.'}
          </p>
          <div className="flex flex-wrap gap-3">
            {isMember
              ? <><StatusBadge tone="member">Active member</StatusBadge><Button variant="secondary" onClick={() => go('Membership')}>View your benefits</Button></>
              : <><Button className="sheen" onClick={() => go('Membership')}>Become a member</Button><Button variant="ghost" onClick={() => go('Membership')}>Compare benefits</Button></>}
          </div>
        </div>
        <Media ratio="4 / 3" tone="sand" caption="Members' evening, Great Hall" className="hidden lg:block" />
      </div>
    </Section>
  );
}
