/**
 * Placeholder content for the visitor site, ported from
 * design-system/ui_kits/visitor_site/data.js (the design system's own
 * `window.HM` fixture). Replace with real API calls once the collections
 * and events endpoints exist on the backend — every screen that reads from
 * here takes plain props, so swapping the data source doesn't touch them.
 */
export type Tone = 'olive' | 'green' | 'sand' | 'stone';

export interface Collection {
  id: string;
  name: string;
  category: string;
  period: string;
  items: number;
  tone: Tone;
  description: string;
  location: string;
}

export type EventAvailability = 'available' | 'limited' | 'soldout' | 'cancelled';

export interface MuseumEvent {
  id: string;
  title: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  price: string;
  priceValue: number;
  memberPrice?: number;
  free?: boolean;
  availability: EventAvailability;
  remaining: number;
  capacity: number;
  description: string;
}

export interface Recommendation {
  title: string;
  kind: string;
  reason: string;
  tone: Tone;
}

export const collections: Collection[] = [
  { id: 'ice-age', name: 'Ice Age Britain', category: 'Prehistory', period: 'Pleistocene', items: 128, tone: 'olive',
    description: 'Mammoth, aurochs and the first people to cross the land bridge.', location: 'Gallery 1 · Ground floor' },
  { id: 'dinosaurs', name: 'Age of Dinosaurs', category: 'Dinosaurs', period: 'Mesozoic', items: 96, tone: 'green',
    description: 'Fossils and reconstructions from the Jurassic and Cretaceous.', location: 'Gallery 2 · Ground floor' },
  { id: 'lanthorn', name: 'The Lanthorn Hoard', category: 'Archaeology', period: 'Iron Age', items: 92, tone: 'stone',
    description: 'Ninety-two objects buried in the third century BCE.', location: 'Gallery 4 · First floor' },
  { id: 'armoury', name: 'Medieval Armoury', category: 'Medieval', period: '1100–1450', items: 41, tone: 'green',
    description: 'Arms, armour and the craft of the medieval smith.', location: 'Gallery 7 · First floor' },
  { id: 'portraits', name: 'Renaissance Portraits', category: 'Renaissance', period: '1400–1600', items: 64, tone: 'sand',
    description: 'Faces of merchants, scholars and their households.', location: 'Gallery 9 · Second floor' },
  { id: 'ceramics', name: 'Ancient Ceramics', category: 'Ancient History', period: '800 BCE–200 CE', items: 210, tone: 'stone',
    description: 'Vessels for grain, wine, oil and the dead.', location: 'Gallery 5 · First floor' },
  { id: 'birds', name: 'Birds of the Estuary', category: 'Art', period: '19th century', items: 37, tone: 'olive',
    description: 'Watercolours and specimens from the Lanthorn marshes.', location: 'Gallery 11 · Second floor' },
  { id: 'coins', name: 'Coin & Currency', category: 'Archaeology', period: 'Roman–Georgian', items: 480, tone: 'sand',
    description: 'Two thousand years of money made and spent locally.', location: 'Gallery 6 · First floor' },
];

export const events: MuseumEvent[] = [
  { id: 'twilight', title: 'Twilight at the Museum', date: '14 Sep 2026', endDate: '14 Sep 2026', time: '18:30–21:00', location: 'Great Hall',
    price: '£14 · £10 members', priceValue: 14, memberPrice: 10, availability: 'limited', remaining: 38, capacity: 200,
    description: 'After-hours access to the Great Hall with curator talks, live music and a late bar.' },
  { id: 'hoard-talk', title: 'Curator talk: Reading the Lanthorn Hoard', date: '21 Sep 2026', endDate: '21 Sep 2026', time: '13:00–14:00', location: 'Lecture Theatre',
    price: 'Free', free: true, priceValue: 0, availability: 'available', remaining: 82, capacity: 120,
    description: 'Dr Naomi Vale on what ninety-two buried objects tell us about belief.' },
  { id: 'family-fossil', title: 'Family fossil workshop', date: '27 Sep 2026', endDate: '27 Sep 2026', time: '10:00–12:30', location: 'Learning Studio',
    price: '£8 · £5 members', priceValue: 8, memberPrice: 5, availability: 'soldout', remaining: 0, capacity: 40,
    description: 'Cast your own ammonite and meet the museum’s palaeontologists.' },
  { id: 'night-drawing', title: 'Late-night life drawing', date: '2 Oct 2026', endDate: '2 Oct 2026', time: '19:00–21:00', location: 'Gallery 9',
    price: '£18 · £14 members', priceValue: 18, memberPrice: 14, availability: 'cancelled', remaining: 0, capacity: 30,
    description: 'This session has been cancelled. Ticket holders have been refunded in full.' },
  { id: 'beneath', title: 'Beneath the Lanthorn Fields', date: '3 Jul 2026', endDate: '3 Jan 2027', time: 'Daily, 10:00–17:00', location: 'Exhibition Wing',
    price: '£16 · £12 members', priceValue: 16, memberPrice: 12, availability: 'available', remaining: 640, capacity: 1200,
    description: 'Ninety-two objects from a single Iron Age hoard, shown together for the first time since their discovery in 1974.' },
];

export const recommendedForYou: Recommendation[] = [
  { title: 'Ice Age Britain', kind: 'Collection', reason: 'Because you explored Prehistory', tone: 'olive' },
  { title: 'Age of Dinosaurs', kind: 'Collection', reason: 'Similar to the fossils you viewed', tone: 'green' },
  { title: 'Curator talk: Reading the Lanthorn Hoard', kind: 'Event', reason: 'Archaeology, near you this month', tone: 'stone' },
  { title: 'Coin & Currency', kind: 'Collection', reason: 'Often viewed with The Lanthorn Hoard', tone: 'sand' },
];

export const popularRightNow: Recommendation[] = [
  { title: 'The Lanthorn Hoard', kind: 'Collection', reason: 'Most visited this month', tone: 'stone' },
  { title: 'Age of Dinosaurs', kind: 'Collection', reason: 'Popular with families', tone: 'green' },
  { title: 'Twilight at the Museum', kind: 'Event', reason: 'Selling quickly', tone: 'olive' },
  { title: 'Medieval Armoury', kind: 'Collection', reason: 'Trending this week', tone: 'sand' },
];
