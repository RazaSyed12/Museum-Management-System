'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/forms/Button';
import { IconButton } from '@/components/forms/IconButton';
import { Icon } from '@/components/foundation/Icon';
import { Media, type MediaProps } from '@/components/foundation/Media';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/cn';
import { events } from '@/lib/sample-data';

export interface HeroProps {
  go: (label: string) => void;
}

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: { icon: string; text: string }[];
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
  tone: NonNullable<MediaProps['tone']>;
  caption: string;
}

/** Time each slide stays up before advancing. */
const SLIDE_MS = 7000;

/* Slides draw on the same sample data as the rest of the home page, so they
   follow it when the events API replaces lib/sample-data. The membership slide
   is static copy from the design system. */
function buildSlides(): Slide[] {
  const exhibition = events.find((e) => e.id === 'beneath')!;
  const evening = events.find((e) => e.id === 'twilight')!;
  return [
    {
      id: exhibition.id,
      eyebrow: 'Current exhibition',
      title: exhibition.title,
      description: exhibition.description,
      meta: [
        { icon: 'calendar-days', text: `${exhibition.date} – ${exhibition.endDate}` },
        { icon: 'map-pin', text: exhibition.location },
      ],
      primary: { label: 'Explore exhibition', to: 'Collection' },
      secondary: { label: 'Book tickets', to: 'Tickets' },
      tone: 'green',
      caption: 'Exhibition photography — Great Hall',
    },
    {
      id: evening.id,
      eyebrow: 'This month',
      title: evening.title,
      description: evening.description,
      meta: [
        { icon: 'calendar-days', text: `${evening.date} · ${evening.time}` },
        { icon: 'map-pin', text: evening.location },
      ],
      primary: { label: 'Book tickets', to: 'Tickets' },
      secondary: { label: 'See what’s on', to: 'Events' },
      tone: 'olive',
      caption: 'Event photography — Great Hall after hours',
    },
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

const SLIDES = buildSlides();

export function Hero({ go }: HeroProps) {
  const [index, setIndex] = useState(0);
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
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, playing, holding]);

  // SLIDES is a non-empty constant and `index` always wraps within it.
  const slide = SLIDES[index] as Slide;
  const step = (by: number) => setIndex((i) => (i + by + SLIDES.length) % SLIDES.length);

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
        <Media tone={slide.tone} ratio="auto" caption={slide.caption} className="h-full rounded-none" />
        {/* Vertical scrim on mobile, horizontal once the copy sits beside the image. */}
        <div className="scrim-image md:scrim-hero absolute inset-0" />
      </div>

      <Container className="relative">
        <div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${SLIDES.length}`}
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
            <Button className="sheen" variant="accent" size="fluid" onClick={() => go(slide.primary.to)}>
              {slide.primary.label}
            </Button>
            {/* Secondary is an olive outline for light surfaces; on the dark hero it's recoloured, hover included. */}
            <Button
              className="sheen border-sand-300/50 text-paper-50 hover:bg-white/10 active:bg-white/15"
              variant="secondary"
              size="fluid"
              onClick={() => go(slide.secondary.to)}
            >
              {slide.secondary.label}
            </Button>
          </div>
        </div>

        {/* Bottom padding leaves room for the plan-your-visit bar that overlaps the hero edge. */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pb-20 md:pb-24">
          <div className="flex items-center" role="group" aria-label="Choose slide">
            {SLIDES.map((s, i) => (
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
            {index + 1} / {SLIDES.length}
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
