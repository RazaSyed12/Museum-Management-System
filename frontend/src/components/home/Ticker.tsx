import { Icon } from '@/components/foundation/Icon';
import type { ResponsiveMode } from '@/lib/useResponsiveMode';

/* Ported from the Ticker section in design-system/ui_kits/visitor_site/HomeScreen.jsx. */
export interface TickerProps {
  mode: ResponsiveMode;
}

const ITEMS = ['Beneath the Lanthorn — now on view', 'Free general admission', 'Members see new exhibitions a week early', 'Curator talk: Reading the Lanthorn Hoard · 24 Sep', 'BSL tours first Saturday of the month'];

export function Ticker({ mode }: TickerProps) {
  const run = ITEMS.concat(ITEMS);
  return (
    <div className="hm-ticker" style={{ background: 'var(--surface-accent)', borderBottom: '1px solid var(--border-subtle)', padding: `${mode === 'mobile' ? 10 : 12}px 0` }}>
      <div className="hm-ticker-track">
        {run.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 var(--space-6)', font: 'var(--type-body-sm)', color: 'var(--text-heading)', whiteSpace: 'nowrap' }}>
            {t}<Icon name="sparkles" size={13} color="var(--gold-700)" />
          </span>
        ))}
      </div>
    </div>
  );
}
