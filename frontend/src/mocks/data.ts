/**
 * Fixture data backing the MSW handlers in handlers.ts — nothing outside
 * this mocks/ folder should import from here directly. Ported from
 * design-system/ui_kits/visitor_site/data.js (the design system's own
 * `window.HM` fixture). This whole folder goes away once the real backend
 * exists; see lib/api/* for the contract it's standing in for.
 */
import type { Collection, Item } from '@/lib/api/collections';
import type { MuseumEvent } from '@/lib/api/events';
import type { Booking } from '@/lib/api/bookings';
import type { Role } from '@/lib/api/auth';

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

/** Staff-managed category list in the real API — never hard-code this at
 *  a call site. */
export const categories = ['Prehistory', 'Dinosaurs', 'Archaeology', 'Ancient History', 'Medieval', 'Renaissance', 'Art'];

/**
 * Artefact records. Only The Lanthorn Hoard has any — that's the design
 * system's own fixture, not a bug: every other collection's "Objects in
 * this collection" section will show an empty state until more are added.
 */
export const items: Item[] = [
  { id: 'helmet', name: 'Bronze ceremonial helmet', period: 'Iron Age', date: 'c. 300 BCE', origin: 'Lanthorn Fields, Kent',
    description: 'Cast in one piece and never worn in battle.', collection: 'The Lanthorn Hoard', location: 'Case 4A, Gallery 4' },
  { id: 'torc', name: 'Gold neck torc', period: 'Iron Age', date: 'c. 280 BCE', origin: 'Lanthorn Fields, Kent',
    description: 'Twisted from eight rods of high-purity gold.', collection: 'The Lanthorn Hoard', location: 'Case 4A, Gallery 4' },
  { id: 'bowl', name: 'Ritual bowl with boar frieze', period: 'Iron Age', date: 'c. 300 BCE', origin: 'Lanthorn Fields, Kent',
    description: 'Repoussé decoration showing a boar hunt.', collection: 'The Lanthorn Hoard', location: 'Case 4B, Gallery 4' },
  { id: 'brooch', name: 'Enamelled disc brooch', period: 'Iron Age', date: 'c. 250 BCE', origin: 'Unknown',
    description: 'Red and blue enamel set in bronze cells.', collection: 'The Lanthorn Hoard', location: 'Case 4C, Gallery 4' },
  { id: 'sword', name: 'Iron sword with wooden grip', period: 'Iron Age', date: 'c. 320 BCE', origin: 'Lanthorn Fields, Kent',
    description: 'Bent double before burial — a deliberate act.', collection: 'The Lanthorn Hoard', location: 'Case 4D, Gallery 4' },
  { id: 'cauldron', name: 'Riveted bronze cauldron', period: 'Iron Age', date: 'c. 300 BCE', origin: 'Lanthorn Fields, Kent',
    description: 'Repaired at least four times in antiquity.', collection: 'The Lanthorn Hoard', location: 'Case 4E, Gallery 4' },
];

export const events: MuseumEvent[] = [
  { id: 'twilight', title: 'Twilight at the Museum', date: '14 Sep 2026', endDate: '14 Sep 2026', time: '18:30–21:00', location: 'Great Hall',
    priceValue: 14, memberPrice: 10, childPrice: 7, availability: 'limited', remaining: 38, capacity: 200,
    description: 'After-hours access to the Great Hall with curator talks, live music and a late bar.' },
  { id: 'hoard-talk', title: 'Curator talk: Reading the Lanthorn Hoard', date: '21 Sep 2026', endDate: '21 Sep 2026', time: '13:00–14:00', location: 'Lecture Theatre',
    free: true, priceValue: 0, availability: 'available', remaining: 82, capacity: 120,
    description: 'Dr Naomi Vale on what ninety-two buried objects tell us about belief.' },
  { id: 'family-fossil', title: 'Family fossil workshop', date: '27 Sep 2026', endDate: '27 Sep 2026', time: '10:00–12:30', location: 'Learning Studio',
    priceValue: 8, memberPrice: 5, childPrice: 4, availability: 'soldout', remaining: 0, capacity: 40,
    description: 'Cast your own ammonite and meet the museum’s palaeontologists.' },
  { id: 'night-drawing', title: 'Late-night life drawing', date: '2 Oct 2026', endDate: '2 Oct 2026', time: '19:00–21:00', location: 'Gallery 9',
    priceValue: 18, memberPrice: 14, childPrice: 9, availability: 'cancelled', remaining: 0, capacity: 30,
    description: 'This session has been cancelled. Ticket holders have been refunded in full.' },
  { id: 'beneath', title: 'Beneath the Lanthorn Fields', date: '3 Jul 2026', endDate: '3 Jan 2027', time: 'Daily, 10:00–17:00', location: 'Exhibition Wing',
    priceValue: 16, memberPrice: 12, childPrice: 8, availability: 'available', remaining: 640, capacity: 1200,
    description: 'Ninety-two objects from a single Iron Age hoard, shown together for the first time since their discovery in 1974.' },
];

export const bookings: Booking[] = [
  { id: 'HM-2026-04821', ref: 'HM-2026-04821', event: 'Beneath the Lanthorn Fields', date: '12 Aug 2026', qty: 2, totalValue: 24, status: 'Confirmed' },
  { id: 'HM-2026-04455', ref: 'HM-2026-04455', event: 'Curator talk: Reading the Lanthorn Hoard', date: '21 Sep 2026', qty: 1, totalValue: 0, status: 'Confirmed' },
  { id: 'HM-2026-03910', ref: 'HM-2026-03910', event: 'Family fossil workshop', date: '4 May 2026', qty: 4, totalValue: 20, status: 'Cancelled' },
];

/** One sign-in for every visitor (see lib/api/auth.ts) — `role` is what
 *  tells the frontend apart a registered visitor, a member and a staff
 *  account, not a separate login. `admin@heritage.example` is deliberately
 *  the same person as the Admin seed in mocks/staff.ts (same name, same
 *  email) — signing in here and being recognised there is the whole point. */
export interface MockAccount {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: Role;
  onboardingCompleted: boolean;
  interests: string[];
}

export const accounts: MockAccount[] = [
  { id: 'amara', full_name: 'Amara Okafor', email: 'amara@example.com', password: 'password123',
    role: 'registered', onboardingCompleted: true, interests: ['Prehistory', 'Archaeology'] },
  { id: 'judith', full_name: 'Judith Clarke', email: 'judith@example.com', password: 'password123',
    role: 'member', onboardingCompleted: true, interests: ['Medieval', 'Renaissance'] },
  { id: 'admin', full_name: 'Sarah Mitchell', email: 'admin@heritage.example', password: 'museum-demo',
    role: 'staff', onboardingCompleted: true, interests: [] },
];
