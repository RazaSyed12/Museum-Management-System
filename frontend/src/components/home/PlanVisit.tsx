'use client';

import { useState } from 'react';
import { Button } from '@/components/forms/Button';
import { FilterPills } from '@/components/forms/FilterPills';
import { IconButton } from '@/components/forms/IconButton';
import { Container } from '@/components/layout/Container';

const DATES = ['Today', 'Tomorrow', 'This weekend'] as const;
const MIN_VISITORS = 1;
const MAX_VISITORS = 10;

export interface PlanVisitProps {
  /** The current exhibition's display price, e.g. "£16 · £12 members". */
  exhibitionPrice: string;
  /** Called with the visitor's choices. */
  onCheck: (plan: { date: string; visitors: number }) => void;
}

/* Sits across the bottom edge of the hero (negative top margin), so it must be
   rendered directly after <Hero />. */
export function PlanVisit({ exhibitionPrice, onCheck }: PlanVisitProps) {
  const [date, setDate] = useState<string>(DATES[0]);
  const [visitors, setVisitors] = useState(2);

  return (
    <Container className="relative z-10 -mt-12">
      <div className="grid gap-5 rounded-lg border border-line-subtle bg-surface-card p-5 shadow-lg md:p-6 lg:grid-cols-[auto_auto_minmax(0,1fr)_auto] lg:items-end lg:gap-10">
        <div className="grid gap-1">
          <h2 className="type-h3">Plan your visit</h2>
          <p className="type-body-sm text-muted">Choose a day and who’s coming.</p>
        </div>

        <fieldset className="grid gap-2">
          <legend className="type-eyebrow mb-2 tracking-wider text-muted uppercase">Date</legend>
          <FilterPills label="Date" options={DATES} value={date} onChange={setDate} />
        </fieldset>

        <div className="grid gap-2" role="group" aria-labelledby="plan-visitors">
          <span id="plan-visitors" className="type-eyebrow tracking-wider text-muted uppercase">Visitors</span>
          <div className="flex items-center gap-2">
            <IconButton
              variant="outline"
              icon="minus"
              label="Fewer visitors"
              disabled={visitors <= MIN_VISITORS}
              onClick={() => setVisitors((v) => Math.max(MIN_VISITORS, v - 1))}
            />
            <span className="w-8 text-center font-body text-md font-semibold text-heading tabular-nums" aria-live="polite">
              {visitors}
            </span>
            <IconButton
              variant="outline"
              icon="plus"
              label="More visitors"
              disabled={visitors >= MAX_VISITORS}
              onClick={() => setVisitors((v) => Math.min(MAX_VISITORS, v + 1))}
            />
          </div>
        </div>

        <Button size="lg" iconLeft="ticket" fullWidth onClick={() => onCheck({ date, visitors })} className="lg:w-auto">
          Check availability
        </Button>

        <p className="type-body-sm border-t border-line-subtle pt-4 text-muted lg:col-span-full">
          General admission is free. Exhibition tickets {exhibitionPrice}.
        </p>
      </div>
    </Container>
  );
}
