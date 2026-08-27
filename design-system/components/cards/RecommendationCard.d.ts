import * as React from 'react';
export interface RecommendationCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  /** What is being recommended: "Collection", "Event", "Artefact". */
  kind?: string;
  /** Plain-English justification, e.g. "Because you explored Prehistory". */
  reason?: string;
  image?: string;
  tone?: 'olive' | 'green' | 'sand' | 'stone';
  href?: string;
}
export declare function RecommendationCard(props: RecommendationCardProps): JSX.Element;
