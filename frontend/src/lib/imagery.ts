/**
 * Original illustrations that stand in for museum photography until real
 * photos exist. Media (components/foundation/Media.tsx) looks a placeholder's
 * caption up here, so every card, hero and detail page that already passes a
 * caption gets its artwork without any of those components changing.
 *
 * To use a real photograph instead, pass `src` to <Media> (or an `image` prop
 * to a card) — `src` always wins over this table. To replace an illustration
 * with a photo everywhere, drop the photo over the PNG with the same name in
 * public/assets/art/.
 */
const ART = '/assets/art/';

const BY_CAPTION: Record<string, string> = {
  // Collections
  'Ice Age Britain': 'collection-ice-age',
  'Age of Dinosaurs': 'collection-dinosaurs',
  'The Lanthorn Hoard': 'collection-lanthorn',
  'Medieval Armoury': 'collection-armoury',
  'Renaissance Portraits': 'collection-portraits',
  'Ancient Ceramics': 'collection-ceramics',
  'Birds of the Estuary': 'collection-birds',
  'Coin & Currency': 'collection-coins',
  // Events and exhibition
  'Twilight at the Museum': 'event-twilight',
  'Curator talk: Reading the Lanthorn Hoard': 'collection-lanthorn',
  'Family fossil workshop': 'event-fossil',
  'Late-night life drawing': 'event-drawing',
  'Beneath the Lanthorn Fields': 'exhibition-beneath',
  // Home hero slides
  'Exhibition photography — Great Hall': 'exhibition-beneath',
  'Event photography — Great Hall after hours': 'event-twilight',
  'Members’ evening — Great Hall': 'members-hall',
  "Members' evening, Great Hall": 'members-hall',
  // Shared detail-page hero
  'Collection photography': 'hall-dark',
};

const normalise = (s: string) => s.replace(/[’‘]/g, "'").trim().toLowerCase();
const INDEX = new Map(Object.entries(BY_CAPTION).map(([caption, file]) => [normalise(caption), `${ART}${file}.webp`]));

/** Illustration for a placeholder caption, or undefined when there isn't one. */
export function artFor(caption?: string): string | undefined {
  return caption ? INDEX.get(normalise(caption)) : undefined;
}
