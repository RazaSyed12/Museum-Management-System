import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { Media } from '@/components/foundation/Media';
import { Container } from '@/components/layout/Container';
import { events } from '@/lib/sample-data';

export interface HeroProps {
  go: (label: string) => void;
}

export function Hero({ go }: HeroProps) {
  const e = events.find((x) => x.id === 'beneath')!;
  return (
    <section className="relative overflow-hidden bg-green-900">
      <div className="absolute inset-0 animate-kenburns motion-reduce:animate-none">
        <Media tone="green" ratio="auto" caption="Exhibition photography — Great Hall" className="h-full rounded-none" />
        {/* Vertical scrim on mobile, horizontal once the copy sits beside the image. */}
        <div className="scrim-image md:scrim-hero absolute inset-0" />
      </div>
      <Container className="relative">
        <div className="stagger-in grid gap-5 pt-16 pb-10 md:max-w-140 md:py-24">
          <span className="type-eyebrow tracking-wider text-sand-300 uppercase">Current exhibition</span>
          <h1 className="text-4xl/[1.05] text-paper-50 md:text-6xl/[1.05]">{e.title}</h1>
          <p className="type-body max-w-120 text-paper-100/86 md:text-md">{e.description}</p>
          <div className="type-body-sm flex flex-wrap items-center gap-4 text-sand-300">
            <span className="inline-flex items-center gap-1.5"><Icon name="calendar-days" size={16} />3 Jul 2026 – 3 Jan 2027</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="map-pin" size={16} />Exhibition Wing</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button className="sheen" variant="accent" size="fluid" onClick={() => go('Collection')}>Explore exhibition</Button>
            {/* Secondary is an olive outline for light surfaces; on the dark hero it's recoloured, hover included. */}
            <Button
              className="sheen border-sand-300/50 text-paper-50 hover:bg-white/10 active:bg-white/15"
              variant="secondary"
              size="fluid"
              onClick={() => go('Tickets')}
            >
              Book tickets
            </Button>
          </div>
        </div>
      </Container>
      <div className="absolute bottom-[18px] left-1/2 hidden -translate-x-1/2 justify-items-center gap-1.5 text-sand-300 md:grid">
        <span className="font-body text-2xs leading-normal tracking-wider uppercase opacity-75">Scroll</span>
        <span className="inline-flex animate-cue motion-reduce:animate-none"><Icon name="chevron-down" size={18} /></span>
      </div>
    </section>
  );
}
