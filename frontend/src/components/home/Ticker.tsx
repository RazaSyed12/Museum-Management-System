import { Icon } from '@/components/foundation/Icon';

/* The list is rendered twice so the track can slide by exactly half its width
   and loop seamlessly; hovering pauses it. */
const ITEMS = ['Beneath the Lanthorn — now on view', 'Free general admission', 'Members see new exhibitions a week early', 'Curator talk: Reading the Lanthorn Hoard · 24 Sep', 'BSL tours first Saturday of the month'];

export function Ticker() {
  const run = ITEMS.concat(ITEMS);
  return (
    <div className="group overflow-hidden border-b border-line-subtle bg-surface-accent py-2.5 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] md:py-3">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {run.map((t, i) => (
          <span key={i} className="type-body-sm inline-flex items-center gap-4 px-6 whitespace-nowrap text-heading">
            {t}
            <Icon name="sparkles" size={13} className="text-gold-700" />
          </span>
        ))}
      </div>
    </div>
  );
}
