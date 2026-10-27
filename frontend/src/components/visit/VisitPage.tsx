'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { Media } from '@/components/foundation/Media';
import { DetailHero, MetaItem } from '@/components/layout/DetailHero';
import { Section } from '@/components/layout/Section';
import { cn } from '@/lib/cn';
import { useSiteNav } from '@/lib/nav';

/* Everything on this page comes from facts already used elsewhere in the site
   (components/home/VisitStrip.tsx and navigation/SiteFooter.tsx): hours, address,
   the station, step-free access and BSL tours. Nothing is invented. Where the
   museum still has to supply detail (parking, transport times beyond the station,
   the map), the page says so rather than guessing. When opening hours move into
   the database, replace HOURS and fetch them. */
const HOURS = [
  { label: 'Monday – Friday', time: '10:00 – 17:30', days: [1, 2, 3, 4, 5] },
  { label: 'Saturday – Sunday', time: '09:30 – 18:00', days: [0, 6] },
] as const;

const ADMISSION = [
  { icon: 'ticket', title: 'General admission is free', text: 'Walk in during opening hours. No booking needed for the galleries.' },
  { icon: 'calendar-days', title: 'Exhibitions and events', text: 'Ticketed separately, with reduced prices for members. Book ahead to guarantee a place.' },
  { icon: 'award', title: 'Members', text: 'Reduced prices on every ticketed event and a reserved allocation of places.' },
];

const ACCESS = [
  { icon: 'accessibility', title: 'Step-free throughout', text: 'Every public gallery can be reached without steps.' },
  { icon: 'hand', title: 'BSL tours', text: 'British Sign Language tours run on the first Saturday of the month.' },
  { icon: 'message-circle', title: 'Tell us what you need', text: 'Add access requirements when you book, or contact us before you visit.' },
];

const FAQ = [
  { q: 'Do I need a ticket to visit?', a: 'No. General admission is free. You only need a ticket for exhibitions and ticketed events.' },
  { q: 'What time is last entry?', a: 'Forty-five minutes before closing — 16:45 on weekdays and 17:15 at weekends.' },
  { q: 'Can I change or cancel a booking?', a: 'If the museum cancels an event, ticket holders are refunded in full. Contact us for any other change.' },
  { q: 'How do I get help on the day?', a: 'Ask any member of the front-of-house team, or call the number below.' },
];

export function VisitPage() {
  const nav = useSiteNav();
  // Read the day after mount so the server-rendered HTML never disagrees with the browser's clock.
  const [today, setToday] = useState<number>();
  useEffect(() => setToday(new Date().getDay()), []);
  const todays = HOURS.find((h) => (h.days as readonly number[]).includes(today ?? -1));

  return (
    <>
      <DetailHero
        crumbs={[{ label: 'Home', href: '/' }, 'Plan your visit']}
        eyebrow={<span className="type-eyebrow tracking-wider text-sand-300 uppercase">Visit</span>}
        title="Plan your visit"
        description="When we’re open, what it costs, how to get here and how we make the museum work for everyone."
        meta={
          <>
            {todays && <MetaItem icon="clock">Open today {todays.time}</MetaItem>}
            <MetaItem icon="map-pin">18 Lanthorn Street</MetaItem>
          </>
        }
        actions={
          <>
            <Button variant="accent" size="fluid" iconLeft="ticket" onClick={() => nav.go('Tickets')}>Book tickets</Button>
            <Button variant="secondary" size="fluid" className="border-sand-300/50 text-paper-50 hover:bg-white/10" onClick={() => nav.go('Events')}>See what’s on</Button>
          </>
        }
      />

      <Section id="hours" eyebrow="Opening" title="Hours and admission">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-4 rounded-lg border border-line-subtle bg-surface-card p-6">
            <h3 className="type-h3">Opening hours</h3>
            <dl className="m-0 divide-y divide-line-subtle">
              {HOURS.map((h) => {
                const isToday = h === todays;
                return (
                  <div key={h.label} className={cn('flex items-center justify-between gap-4 py-3', isToday && 'font-semibold')}>
                    <dt className="type-body flex items-center gap-2 text-heading">
                      {h.label}
                      {isToday && <StatusBadge tone="success" size="sm">Today</StatusBadge>}
                    </dt>
                    <dd className="type-body m-0 text-heading tabular-nums">{h.time}</dd>
                  </div>
                );
              })}
              <div className="flex justify-between gap-4 py-3">
                <dt className="type-body text-body">Last entry</dt>
                <dd className="type-body m-0 text-heading">45 minutes before close</dd>
              </div>
            </dl>
            <p className="type-body-sm text-muted">Hours may change for private events. Check this page on the day.</p>
          </div>
          <ul className="m-0 grid list-none content-start gap-4 p-0">
            {ADMISSION.map((a) => (
              <li key={a.title} className="flex gap-4 rounded-lg border border-line-subtle bg-surface-card p-5">
                <Icon name={a.icon} size={22} className="mt-0.5 flex-none text-olive-500" />
                <div className="grid gap-1">
                  <h3 className="type-h3">{a.title}</h3>
                  <p className="type-body-sm text-muted">{a.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="getting-here" tone="muted" eyebrow="Getting here" title="Find us">
        <div className="grid gap-8 lg:grid-cols-2">
          <Media tone="stone" ratio="4 / 3" caption="Map — 18 Lanthorn Street (embed once the museum confirms the map link)" />
          <div className="grid content-start gap-5">
            <address className="type-body not-italic text-heading">
              Heritage Museum<br />18 Lanthorn Street<br />
              <a href="mailto:hello@heritagemuseum.org">hello@heritagemuseum.org</a><br />
              <a href="tel:+442079460102">+44 20 7946 0102</a>
            </address>
            <div className="flex gap-3">
              <Icon name="train-front" size={20} className="mt-0.5 flex-none text-olive-500" />
              <div className="grid gap-0.5">
                <span className="type-label text-heading">By train</span>
                <span className="type-body-sm text-muted">Six minutes’ walk from Lanthorn Bridge station.</span>
              </div>
            </div>
            <p className="type-body-sm rounded-md border border-dashed border-line-default p-4 text-muted">
              Parking, bus routes and cycle storage will be listed here once the museum confirms them.
            </p>
          </div>
        </div>
      </Section>

      <Section id="accessibility" eyebrow="Everyone welcome" title="Accessibility">
        <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-3">
          {ACCESS.map((a) => (
            <li key={a.title} className="grid content-start gap-2 rounded-lg border border-line-subtle bg-surface-card p-5">
              <Icon name={a.icon} size={22} className="text-olive-500" />
              <h3 className="type-h3">{a.title}</h3>
              <p className="type-body-sm text-muted">{a.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" tone="muted" eyebrow="Good to know" title="Questions before you visit">
        <div className="grid max-w-190 gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-lg border border-line-subtle bg-surface-card px-5">
              <summary className="type-label flex min-h-13 cursor-pointer list-none items-center justify-between gap-4 text-heading">
                {f.q}
                <Icon name="chevron-down" size={18} className="flex-none transition-transform group-open:rotate-180" />
              </summary>
              <p className="type-body-sm pb-4 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
