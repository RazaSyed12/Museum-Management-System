import { Icon } from '@/components/foundation/Icon';
import { Container } from '@/components/layout/Container';

const CELLS = [
  { icon: 'clock', title: 'Open today', body: '10:00 – 17:30 · last entry 16:45' },
  { icon: 'ticket', title: 'General admission', body: 'Free · exhibitions ticketed separately' },
  { icon: 'map-pin', title: '18 Lanthorn Street', body: 'Six minutes from Lanthorn Bridge station' },
  { icon: 'accessibility', title: 'Step-free throughout', body: 'BSL tours on the first Saturday' },
];

export function VisitStrip() {
  return (
    <div className="border-t border-sand-300/18 bg-surface-inverse">
      <Container>
        <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2 lg:grid-cols-4">
          {CELLS.map((c) => (
            <div key={c.title} className="flex items-start gap-3">
              <Icon name={c.icon} size={20} className="text-sand-300" />
              <span className="grid gap-0.5">
                <span className="type-label inline-flex items-center gap-2 text-paper-50">
                  {c.title === 'Open today' && <i className="size-2 flex-none animate-pulse-ring rounded-full bg-live" />}
                  {c.title}
                </span>
                <span className="type-body-sm text-paper-100/66">{c.body}</span>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
