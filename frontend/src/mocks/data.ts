/**
 * Fixture data backing the MSW handlers in handlers.ts — nothing outside
 * this mocks/ folder should import from here directly. Ported from
 * design-system/ui_kits/visitor_site/data.js (the design system's own
 * `window.HM` fixture). This whole folder goes away once the real backend
 * exists; see lib/api/* for the contract it's standing in for.
 */
import type { Collection, Category, Item } from '@/lib/api/collections';
import type { MuseumEvent } from '@/lib/api/events';
import type { Booking } from '@/lib/api/bookings';
import type { Role } from '@/lib/api/auth';

/** Mock category ids are this fixture's own closed id space — unrelated to
 *  (never mixed with) the real backend's category UUIDs. */
function cat(id: string, name: string): { id: string; name: string } {
  return { id, name };
}

export const categories: Category[] = [
  { id: 'prehistory', name: 'Prehistory', description: null, parentCategoryId: null, active: true },
  { id: 'dinosaurs', name: 'Dinosaurs', description: null, parentCategoryId: null, active: true },
  { id: 'archaeology', name: 'Archaeology', description: null, parentCategoryId: null, active: true },
  { id: 'ancient-history', name: 'Ancient History', description: null, parentCategoryId: null, active: true },
  { id: 'medieval', name: 'Medieval', description: null, parentCategoryId: null, active: true },
  { id: 'renaissance', name: 'Renaissance', description: null, parentCategoryId: null, active: true },
  { id: 'art', name: 'Art', description: null, parentCategoryId: null, active: true },
];

export const collections: Collection[] = [
  { id: 'ice-age', name: 'Ice Age Britain', categories: [cat('prehistory', 'Prehistory')], status: 'published', featured: true,
    description: 'Mammoth, aurochs and the first people to cross the land bridge.', location: { name: 'Gallery 1 · Ground floor', city: null },
    createdAt: '2025-01-10T00:00:00Z', updatedAt: '2025-01-10T00:00:00Z' },
  { id: 'dinosaurs', name: 'Age of Dinosaurs', categories: [cat('dinosaurs', 'Dinosaurs')], status: 'published', featured: true,
    description: 'Fossils and reconstructions from the Jurassic and Cretaceous.', location: { name: 'Gallery 2 · Ground floor', city: null },
    createdAt: '2025-02-14T00:00:00Z', updatedAt: '2025-02-14T00:00:00Z' },
  { id: 'lanthorn', name: 'The Lanthorn Hoard', categories: [cat('archaeology', 'Archaeology')], status: 'published', featured: true,
    description: 'Ninety-two objects buried in the third century BCE.', location: { name: 'Gallery 4 · First floor', city: null },
    createdAt: '2025-03-01T00:00:00Z', updatedAt: '2025-03-01T00:00:00Z' },
  { id: 'armoury', name: 'Medieval Armoury', categories: [cat('medieval', 'Medieval')], status: 'published', featured: false,
    description: 'Arms, armour and the craft of the medieval smith.', location: { name: 'Gallery 7 · First floor', city: null },
    createdAt: '2025-03-20T00:00:00Z', updatedAt: '2025-03-20T00:00:00Z' },
  { id: 'portraits', name: 'Renaissance Portraits', categories: [cat('renaissance', 'Renaissance')], status: 'published', featured: false,
    description: 'Faces of merchants, scholars and their households.', location: { name: 'Gallery 9 · Second floor', city: null },
    createdAt: '2025-04-05T00:00:00Z', updatedAt: '2025-04-05T00:00:00Z' },
  { id: 'ceramics', name: 'Ancient Ceramics', categories: [cat('ancient-history', 'Ancient History')], status: 'published', featured: false,
    description: 'Vessels for grain, wine, oil and the dead.', location: { name: 'Gallery 5 · First floor', city: null },
    createdAt: '2025-04-22T00:00:00Z', updatedAt: '2025-04-22T00:00:00Z' },
  { id: 'birds', name: 'Birds of the Estuary', categories: [cat('art', 'Art')], status: 'published', featured: false,
    description: 'Watercolours and specimens from the Lanthorn marshes.', location: { name: 'Gallery 11 · Second floor', city: null },
    createdAt: '2025-05-11T00:00:00Z', updatedAt: '2025-05-11T00:00:00Z' },
  { id: 'coins', name: 'Coin & Currency', categories: [cat('archaeology', 'Archaeology')], status: 'published', featured: false,
    description: 'Two thousand years of money made and spent locally.', location: { name: 'Gallery 6 · First floor', city: null },
    createdAt: '2025-06-02T00:00:00Z', updatedAt: '2025-06-02T00:00:00Z' },
];

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
