'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/forms/Button';
import { IconButton } from '@/components/forms/IconButton';
import { Icon } from '@/components/foundation/Icon';
import { Media, type MediaProps } from '@/components/foundation/Media';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/cn';
import type { MuseumEvent } from '@/lib/api/events';
import type { HeroSlideData } from '@/lib/api/hero';

export interface HeroProps {
  go: (label: string) => void;
  events: MuseumEvent[];
  /** Real backend: the slides staff manage. Absent (or empty) = the built-in slides. */
  slides?: HeroSlideData[];
}

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: { icon: string; text: string }[];
  primary: { label: string; to: string } | { label: string; href: string };
  secondary: { label: string; to: string } | { label: string; href: string };
  tone: NonNullable<MediaProps['tone']>;
  caption: string;
  image?: string;
}

/** Time each slide stays up before advancing. */
const SLIDE_MS = 7000;

/* Event slides are just whichever two events are soonest — no real "is
   exhibition" flag to pick one specially. Membership slide is static copy. */
function buildSlides(events: MuseumEvent[]): Slide[] {
  const upcoming = [...events]
    .filter((e) => e.availability === 'available' || e.availability === 'limited')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const eventSlides: Slide[] = upcoming.slice(0, 2).map((e) => ({
    id: e.id,
    eyebrow: 'Coming up',
    title: e.title,
    description: e.description,
    meta: [
      { icon: 'calendar-days', text: e.date === e.endDate ? `${e.date} · ${e.time}` : `${e.date} – ${e.endDate}` },
      { icon: 'map-pin', text: e.location },
    ],
    primary: { label: 'Book tickets', href: `/tickets/${e.id}` },
    secondary: { label: 'See what’s on', to: 'Events' },
    tone: 'green',
    caption: `${e.title} — Heritage Museum`,
    image: e.image,
  }));
  // Alternate tone so two consecutive slides don't look identical.
  if (eventSlides[1]) eventSlides[1].tone = 'olive';

  return [
    ...eventSlides,
    {
      id: 'membership',
      eyebrow: 'Membership',
      title: 'See more, pay less',
      description:
        'Members pay a reduced price on every ticketed event, book from a reserved allocation, and see new exhibitions a week early.',
      meta: [
        { icon: 'award', text: 'Reduced prices on every ticketed event' },
        { icon: 'ticket', text: 'Reserved ticket allocation' },
      ],
      primary: { label: 'Become a member', to: 'Membership' },
      secondary: { label: 'Compare benefits', to: 'Membership' },
      tone: 'sand',
      caption: 'Members’ evening — Great Hall',
    },
  ];
}

const MUSEUM_TIMEZONE = 'Australia/Adelaide'; // matches lib/api/events.ts

function slideDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { timeZone: MUSEUM_TIMEZONE, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

/** Staff-managed slides from /hero. A slide's own buttons win; otherwise a
 *  linked event or collection gets a sensible default button. */
function slidesFromApi(data: HeroSlideData[]): Slide[] {
  const tones: Slide['tone'][] = ['green', 'olive', 'sand', 'stone'];
  return data.map((d, i) => {
    const meta: Slide['meta'] = [];
    if (d.eventMeta) {
      const start = slideDate(d.eventMeta.start);
      const end = slideDate(d.eventMeta.end);
      meta.push({ icon: 'calendar-days', text: start === end ? start : `${start} – ${end}` });
      if (d.eventMeta.location) meta.push({ icon: 'map-pin', text: d.eventMeta.location });
    }
    if (d.collectionPeriod) meta.push({ icon: 'landmark', text: d.collectionPeriod });

    const defaultPrimary = d.eventId
      ? d.eventBookable
        ? { label: 'Book tickets', href: `/tickets/${d.eventId}` }
        : { label: 'Event details', href: `/events/${d.eventId}` }
      : d.collectionId
        ? { label: 'Explore the collection', href: `/collections/${d.collectionId}` }
        : { label: 'See what’s on', href: '/events' };
    const defaultSecondary = d.eventId
      ? { label: 'Event details', href: `/events/${d.eventId}` }
      : { label: 'See what’s on', href: '/events' };

    return {
      id: d.id,
      eyebrow: d.eyebrow ?? (d.eventId ? 'Coming up' : 'Featured'),
      title: d.title,
      description: d.description ?? '',
      meta,
      primary: d.eventId && !d.eventBookable && d.primary?.href.startsWith('/tickets/') ? defaultPrimary : d.primary ?? defaultPrimary,
      secondary: d.secondary ?? defaultSecondary,
      tone: tones[i % tones.length]!,
      caption: d.imageAlt ?? `${d.title} — Heritage Museum`,
      image: d.imageUrl,
    };
  });
}

export function Hero({ go, events, slides: apiSlides }: HeroProps) {
  const slides = useMemo(() => (apiSlides?.length ? slidesFromApi(apiSlides) : buildSlides(events)), [apiSlides, events]);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [slides]);
  const [userPaused, setUserPaused] = useState(false);
  // Hover or keyboard focus inside the hero holds the slide in place too.
  const [holding, setHolding] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const playing = !userPaused && !reducedMotion;

  // One timeout per slide: changing slide by hand restarts the clock.
  useEffect(() => {
    if (!playing || holding) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, playing, holding, slides.length]);

  const slide = slides[index % slides.length]!;
  const step = (by: number) => setIndex((i) => (i + by + slides.length) % slides.length);

  function action(a: Slide['primary']) {
    return 'href' in a ? { as: 'a' as const, href: a.href } : { onClick: () => go(a.to) };
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured at the museum"
      className="relative overflow-hidden bg-green-900"
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={() => setHolding(false)}
    >
      <div key={`bg-${slide.id}`} className="absolute inset-0 animate-kenburns motion-reduce:animate-none">
        <Media src={slide.image} tone={slide.tone} ratio="auto" caption={slide.caption} className="h-full rounded-none" />
        {/* Vertical scrim on mobile, horizontal once the copy sits beside the image. */}
        <div className="scrim-image md:scrim-hero absolute inset-0" />
      </div>

      <Container className="relative">
        <div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
          // Announce slide changes only when the visitor moved them, not on every auto-advance.
          aria-live={playing ? 'off' : 'polite'}
          className="stagger-in grid content-start gap-5 pt-16 md:min-h-100 md:max-w-150 md:pt-20"
        >
          <span className="type-eyebrow tracking-wider text-sand-300 uppercase">{slide.eyebrow}</span>
          <h1 className="text-4xl/[1.05] text-paper-50 md:text-6xl/[1.05]">{slide.title}</h1>
          <p className="type-body max-w-120 text-paper-100/86 md:text-md">{slide.description}</p>
          <div className="type-body-sm flex flex-wrap items-center gap-x-4 gap-y-2 text-sand-300">
            {slide.meta.map((m) => (
              <span key={m.text} className="inline-flex items-center gap-1.5">
                <Icon name={m.icon} size={16} />
                {m.text}
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button className="sheen" variant="accent" size="fluid" {...action(slide.primary)}>
              {slide.primary.label}
            </Button>
            {/* Secondary is an olive outline for light surfaces; on the dark hero it's recoloured, hover included. */}
            <Button
              className="sheen border-sand-300/50 text-paper-50 hover:bg-white/10 active:bg-white/15"
              variant="secondary"
              size="fluid"
              {...action(slide.secondary)}
            >
              {slide.secondary.label}
            </Button>
          </div>
        </div>

        {/* Bottom padding leaves room for the plan-your-visit bar that overlaps the hero edge. */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pb-20 md:pb-24">
          <div className="flex items-center" role="group" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="group grid h-11 w-12 cursor-pointer place-items-center border-0 bg-transparent p-0 md:w-16"
              >
                <span
                  className={cn(
                    'block h-[3px] w-full rounded-pill transition-control',
                    i === index ? 'bg-sand-300' : 'bg-white/30 group-hover:bg-white/55',
                  )}
                />
              </button>
            ))}
          </div>
          <span className="type-body-sm text-sand-300 tabular-nums" aria-hidden="true">
            {index + 1} / {slides.length}
          </span>
          <div className="ml-auto flex items-center gap-2 md:ml-4">
            {!reducedMotion && (
              <IconButton
                variant="inverse"
                icon={userPaused ? 'play' : 'pause'}
                label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                onClick={() => setUserPaused((p) => !p)}
              />
            )}
            <IconButton variant="inverse" icon="chevron-left" label="Previous slide" onClick={() => step(-1)} />
            <IconButton variant="inverse" icon="chevron-right" label="Next slide" onClick={() => step(1)} />
          </div>
        </div>
      </Container>
    </section>
  );
}
