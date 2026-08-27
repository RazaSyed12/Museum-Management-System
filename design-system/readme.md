# Heritage Museum — Design System

A complete visual identity, token set, component library and two UI kits for a **single-location museum website and staff management portal**. Built to be translated directly into a **Next.js** front end backed by Supabase or Node/PostgreSQL.

The system covers four visitor states — anonymous, registered, member, staff — on one public site (YouTube-style: same layout, personalised content) plus a clearly separate staff portal.

---

## Sources used

| Source | What it gave us | Notes |
| --- | --- | --- |
| `uploads/ChatGPT Image Aug 26, 2026, 04_38_55 PM (1).png` | Brand identity sheet: logo lockups, three-colour palette with Pantone references, typography pairing, tagline, brand purpose | The authoritative source for this system |
| `uploads/ChatGPT Image Aug 26, 2026, 04_38_55 PM (2).png` | Full-resolution primary lockup + circular mark — cropped into `assets/` | |
| https://github.com/RazaSyed12/Museum-Management-System | **Empty at the time of writing** — the repository contains a single 26-byte `README.md` and no code | Nothing could be recreated from it. Explore it again once code lands; a future pass should re-read it and align component names, data shapes and routes with the real implementation |

Everything not present in those sources (photography, category data, prices, copy) is **placeholder** and clearly marked as such.

---

## Brand at a glance

- **Name** Heritage Museum · **Tagline** *Our past. Our stories. Our future.* · **Line** *Heritage lives here.*
- **Purpose** (from the brand sheet) to honour our heritage, inspire learning, and connect our community through authentic stories and meaningful experiences.
- **Palette** Olive green `#6B7F3B` (Pantone 5757 C), Dark green `#1F3B24` (5535 C), Pale yellow `#F2E2A6` (7401 C), on warm off-white paper.
- **Type** Cormorant Garamond (display) + Source Sans 3 (body).
- **Feel** Cultural, educational, welcoming, premium but approachable. Contemporary, never futuristic.

---

## CONTENT FUNDAMENTALS

**Voice.** Curatorial and plain. The museum speaks as *we*; the visitor is *you*. Sentences are short and factual — the objects are interesting, so the copy does not have to strain.

**Casing.** Sentence case everywhere except three places: eyebrows above section headings, badge labels, and header navigation, which are uppercase with wide tracking (an echo of the wordmark's letterspacing). Never Title Case A Whole Heading.

**Punctuation and numbers.** No exclamation marks. Dates read `14 Sep 2026`; ranges use an en dash (`3 Jul 2026 – 3 Jan 2027`); times use the 24-hour clock (`18:30–21:00`). Prices are `£14`, member prices stated alongside (`£14 · £10 members`). Object dates use `c. 300 BCE`.

**Emoji.** Never. Not in UI, not in marketing copy, not in staff tooling.

**Examples**

| Say | Not |
| --- | --- |
| "Book your visit" | "Grab your tickets now!" |
| "What's on" | "Experiences & Happenings" |
| "Free for members" | "MEMBERS GO FREE 🎟️" |
| "Because you explored Prehistory" | "Recommended by our algorithm" |
| "This event has been cancelled. Everyone who booked has been refunded." | "Sorry! This event is no longer available." |

**Recommendations.** Always explained in human terms — *Because you explored Prehistory*, *Often viewed with The Lanthorn Hoard*, *Popular with families*. Never expose scoring, models or the words "algorithm", "engine" or "AI".

**Accounts vs membership.** The single most important distinction in the copy. An account is free and personalises the site. Membership is a paid supporter scheme with discounts and reserved tickets. Registration screens state this explicitly.

**Object descriptions.** Lead with what a thing is and where it was found, then one specific, physical detail. *"Cast in a single piece and never worn in battle, this helmet was placed at the centre of the hoard, upturned and filled with river silt."*

---

## VISUAL FOUNDATIONS

**Colour.** Dark green carries authority (primary buttons, the footer, the staff rail); olive carries interaction (secondary actions, focus rings, icons, active underlines); pale yellow carries warmth and membership (accent buttons on dark, member badges, the membership band). Backgrounds are warm off-white `#FBFAF4` with a slightly deeper `#F5F3E9` for alternating sections — at most two background tones per page. Status colours are muted and heritage-toned, never fluorescent, and never used alone (see Accessibility).

**Type.** One pairing, applied strictly. Cormorant Garamond, regular weight, for anything display-scale: page titles (48px), section headings (38px), card titles (20–24px), and big numbers on staff stat cards. Source Sans 3 for everything else: body at 16/1.65, small at 14/1.5, labels at 14/600. Uppercase eyebrows at 12px/600 with `0.12em` tracking. Nothing below 11px anywhere.

**Spacing.** 4px base. `--space-4` (16) inside components, `--space-6` (24) between them, `--space-16` (64) between page sections — `--space-10` (40) on mobile. 1280px max container with 48 / 32 / 20px gutters at desktop / tablet / mobile.

**Backgrounds and imagery.** Photography is the hero: full-bleed exhibition shots behind the home hero and every detail-page header, always with a protection gradient (`--scrim-hero` horizontally on desktop, `--scrim-image` vertically on mobile) so type stays legible. No decorative gradients as backgrounds, no patterns, no textures, no illustration. Where photography does not exist yet, the `Media` component renders a duotone olive/green/sand/stone block labelled with the shot it is waiting for. Image tone should be warm and naturally lit — daylight galleries, raking light on objects — never cold, never heavily filtered, never black-and-white as a system-wide treatment.

**Cards.** White surface, 1px `--border-subtle` hairline, 10px radius, `--shadow-xs` at rest. Interactive cards lift 2px, deepen to `--shadow-md` and switch the border to olive on hover. Images inside cards go edge-to-edge with the card's own radius clipping them (padding 0 on the card, padding on the text block).

**Corners.** Restrained: 3px on small controls, 6px on buttons and inputs, 10px on cards and panels, 16px on modals and drawers, full pill on badges, search fields, tabs and quantity controls. Nothing is fully rounded that contains a paragraph.

**Borders.** Hairlines do the structural work. `--border-subtle` (paper-200) separates surfaces, `--border-default` (neutral-300) outlines controls, `--border-strong` (olive-300) marks hover and selection. On dark green, borders are `rgba(242,226,166,.28)` — pale yellow at low opacity, never white.

**Shadows.** Green-tinted, low-opacity, five steps. `xs` on resting cards, `sm` on sticky panels, `md` on hover, `lg` on the preview frames, `xl` on modals and drawers. No inner shadows on inputs; depth comes from the border, not a bevel.

**Transparency and blur.** Used in exactly two places: the modal scrim (`rgba(20,35,26,.56)` plus a 2px blur) and the sand tint on dark-green nav items. Never on cards, never as frosted glass.

**Animation.** Calm and short. 140ms for control state changes (colour, border, shadow), 220ms for surfaces (card lift, drawer and modal entry), 360ms for page-level transitions. Default curve `cubic-bezier(.16,1,.3,1)` — an ease-out that settles, with no overshoot or bounce anywhere in the system. All durations collapse to 0 under `prefers-reduced-motion`.

**Hover, focus, press.** Hover darkens filled buttons one step (`green-900 → green-700`) and tints ghost/secondary buttons with the lightest olive; cards lift. Press darkens one step further (`green-950`) — nothing shrinks or scales. Focus is a 2px olive outline at 2px offset on every focusable element, plus a 3px `rgba(107,127,59,.35)` ring on text inputs; error focus swaps the ring to danger red. Disabled controls go to `--paper-200` with `--neutral-400` text and lose their border.

**Layout rules.** The visitor header is sticky and 80px tall (60px on mobile). Detail pages use a sticky right rail (tickets, order summary) on desktop that becomes a stacked block below 1100px. The staff portal is a fixed dark rail plus a scrolling content column; the rail collapses to icons on tablet and moves into a left drawer on mobile.

**Iconography.** See below.

---

## ICONOGRAPHY

The brand sheet ships **no icon set** — only the logo artwork. **Substitution flagged:** the system standardises on **[Lucide](https://lucide.dev)** (ISC licence), pulled from the `lucide-static` CDN, as the closest match to the identity: a single 2px-stroke, rounded-cap, outline set that sits comfortably beside the humanist sans and does not compete with the engraved feel of the wordmark. *If the museum has, or commissions, its own glyph set, replace the CDN base in `components/foundation/Icon.jsx` and everything downstream updates.*

- **How** the `Icon` component paints the SVG as a CSS mask filled with `currentColor`, so glyphs inherit text colour and never need recolouring by hand.
- **Sizes** 16 inline in body copy, 18 in buttons, 20 default, 22–26 in feature blocks and empty states.
- **Colour** olive-600 on light surfaces, sand-300 on dark green, `currentColor` inside buttons and badges.
- **Never** hand-write SVG paths, use emoji as icons, or press Unicode symbols (✓ ★ →) into service — the one exception is the `⚠` in the inline field-error line and the `…` in pagination.
- **Recurring glyphs** `ticket`, `calendar-days`, `clock`, `map-pin`, `library-big`, `gem`, `tags`, `award` (membership), `shield-check` (roles), `sparkles` (recommendations), `sliders-horizontal` (filters), `qr-code` (tickets).
- **Logo assets** are PNGs cropped from the supplied brand artwork (`assets/logo-primary.png`, `assets/logo-lockup-horizontal.png`, `assets/logo-mark.png`) with the white background keyed out. No vector original was supplied — **please send the SVG or AI original** if one exists.

---

## Accessibility rules baked into the system

- Every form control has a visible `<label>`; placeholders are examples, never labels.
- Status is always **icon + word**, never colour alone (`StatusBadge`, `Alert`, availability CTAs).
- 44px minimum touch target on every interactive element outside dense staff tables (which use 36px on pointer devices only).
- 2px olive focus outline at 2px offset, visible on every focusable element including cards and tabs.
- Body text at 16px minimum; the smallest type in the system is an 11px uppercase badge with `0.04em` tracking on a tinted background.
- Cancelled and sold-out events never render a bookable primary button — the component enforces it.
- All motion respects `prefers-reduced-motion`.

---

## Index of this repository

| Path | What's in it |
| --- | --- |
| `styles.css` | Entry point — `@import`s every token file. Consumers link this one file. |
| `tokens/` | `fonts.css` (Google Fonts), `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `motion.css`, `base.css` |
| `assets/` | `logo-primary.png`, `logo-lockup-horizontal.png`, `logo-mark.png` |
| `guidelines/` | 20 specimen cards — colour ramps, type scale, spacing, radius, elevation, focus states, motion, logo lockups, voice |
| `components/` | 37 React components in six groups (below) |
| `ui_kits/visitor_site/` | 15 visitor screens, three breakpoints, three signed-in states |
| `ui_kits/staff_portal/` | 10 staff screens, three breakpoints |
| `SKILL.md` | Agent-skill wrapper so this system can be used from Claude Code |
| `github.md` | Source-repository association for one-click sync |

### Components

**foundation** — `Icon`, `Logo`, `Media`
**forms** — `Button`, `IconButton`, `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `SearchField`, `QuantityStepper`, `DateTimeField`, `ImageUpload`
**feedback** — `StatusBadge`, `Alert`, `EmptyState`, `Skeleton`, `SkeletonCard`, `Modal`, `Drawer`
**cards** — `Card`, `CollectionCard`, `EventCard`, `ItemCard`, `RecommendationCard`, `StatCard`
**navigation** — `SiteHeader`, `SiteFooter`, `Tabs`, `Breadcrumbs`, `Pagination`, `StaffSidebar`, `StaffTopBar`
**data** — `DataTable`, `FilterPanel`

Each component directory holds `<Name>.jsx`, `<Name>.d.ts` (props contract) and `<Name>.prompt.md` (what & when, with a usage example).

#### Intentional additions

The brand sheet defined no component inventory, so the list above was authored against the product brief. Three components go slightly beyond the brief's list, each for a stated reason:

- **`Icon`** — a wrapper for the substituted Lucide set, so a future in-house glyph set is a one-file change.
- **`Media`** — a photography frame with a labelled duotone placeholder, because no museum photography was supplied.
- **`Field`** — the shared label / hint / error shell, which enforces the "no placeholder-only forms" accessibility rule across every control.
- **`StatCard`** and **`QuantityStepper`** are named in the brief's screens (staff summary cards, ticket quantity) but not in its component list.

### UI kits

**`ui_kits/visitor_site/index.html`** — Home (signed-out and personalised), Collections browse, Collection detail, Artefact detail, What's on, Event detail (available / limited / sold out / free / cancelled), Ticket selection, Checkout, Payment (success + failure), Confirmation, Sign in, Register, Interests onboarding, Profile, Membership. Toolbar switches breakpoint (1440 / 768 / 390) and visitor state (anonymous / registered / member); the ticketing flow carries real quantity and total state through all four steps.

**`ui_kits/staff_portal/index.html`** — Dashboard, Collection management, Create/edit collection, Item management, Category management, Event management, Create/edit event, Ticket management, Booking management, Staff & roles. Same breakpoint switcher; sidebar collapses to icons at 768 and to a drawer at 390.

---

## Known gaps — please help

1. **No real photography.** Every image is a labelled placeholder. Send gallery and object shots and the kits become presentable to stakeholders.
2. **No vector logo.** The marks are cropped raster. An SVG or AI original would sharpen every surface, especially the favicon.
3. **Fonts are loaded from Google Fonts**, matching the names on the brand sheet exactly. If the museum has licensed cuts, drop the files in and swap `tokens/fonts.css` for real `@font-face` rules.
4. **The GitHub repository was empty**, so nothing here is validated against real code. Re-run a pass once the Next.js app exists.
5. **Prices, capacities and category lists are invented** placeholders.
