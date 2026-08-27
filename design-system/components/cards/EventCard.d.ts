import * as React from 'react';
export interface EventCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  /** Display price string, e.g. "£14 · £10 members". Ignored when free. */
  price?: string;
  free?: boolean;
  /** Drives the badge and the CTA. cancelled/soldout never render a bookable primary button. */
  availability?: 'available' | 'limited' | 'soldout' | 'cancelled';
  image?: string;
  /** horizontal is the events-listing row on desktop; vertical is the home grid. */
  layout?: 'vertical' | 'horizontal';
  href?: string;
  onBook?: () => void;
}
export declare function EventCard(props: EventCardProps): JSX.Element;
