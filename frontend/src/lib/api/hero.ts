import { apiFetch } from './client';

/* ── Real backend (openapi.yaml: GET /hero) ──
 *
 * Own toggle: NEXT_PUBLIC_HERO_API_MOCKING=disabled makes the homepage
 * carousel show the slides staff manage in the portal (order, schedule,
 * linked event or collection). Unset, the carousel keeps building its slides
 * from the soonest events plus the membership slide, as before. If the real
 * list is empty or can't be loaded the homepage falls back to that too. */

export function heroMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_HERO_API_MOCKING === 'disabled';
}

export interface HeroSlideData {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** The event or collection the slide points at, when it has one. */
  eventId?: string;
  collectionId?: string;
  eventMeta?: { start: string; end: string; location?: string };
  collectionPeriod?: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface RawSlide {
  slide_id: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  primary_label: string | null;
  primary_href: string | null;
  secondary_label: string | null;
  secondary_href: string | null;
  event_id: string | null;
  collection_id: string | null;
  linked_event: { name: string; start_at: string; end_at: string; location: { name?: string; city?: string | null } | null } | null;
  linked_collection: { name: string; historical_period: string | null } | null;
  image: { url: string; alt_text: string | null } | null;
}

function link(label: string | null, href: string | null): { label: string; href: string } | undefined {
  return label && href ? { label, href } : undefined;
}

/** The live slides, in staff's order — undefined while mocking is on, or when
 *  the call fails, so the caller falls back to its built-in slides. */
export async function listHeroSlides(): Promise<HeroSlideData[] | undefined> {
  if (!heroMockingDisabled()) return undefined;
  try {
    const data = await apiFetch<{ slides: RawSlide[] }>('/hero', { absolute: true });
    return data.slides.map((s) => ({
      id: s.slide_id,
      eyebrow: s.eyebrow ?? undefined,
      title: s.title,
      description: s.description ?? undefined,
      primary: link(s.primary_label, s.primary_href),
      secondary: link(s.secondary_label, s.secondary_href),
      eventId: s.event_id ?? undefined,
      collectionId: s.collection_id ?? undefined,
      eventMeta: s.linked_event
        ? {
            start: s.linked_event.start_at,
            end: s.linked_event.end_at,
            location: [s.linked_event.location?.name, s.linked_event.location?.city].filter(Boolean).join(', ') || undefined,
          }
        : undefined,
      collectionPeriod: s.linked_collection?.historical_period ?? undefined,
      imageUrl: s.image?.url,
      imageAlt: s.image?.alt_text ?? undefined,
    }));
  } catch {
    return undefined;
  }
}
