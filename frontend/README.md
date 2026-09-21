# Heritage Museum — frontend

Next.js (App Router, TypeScript) app for the visitor website and the staff portal.
It lives in the `Museum-Management-System` monorepo alongside `backend/`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start` (serve the build), `npm run lint`.

## Styling

Styling is [Tailwind CSS v4](https://tailwindcss.com). The brand tokens are the
Tailwind theme, so the utility classes are the brand vocabulary — there is no raw
hex or px in components.

- **Theme** — [`src/styles/theme.css`](src/styles/theme.css) defines the brand
  tokens as a Tailwind `@theme`: colours (`bg-olive-500`, `text-heading`,
  `border-line-subtle`), type scale, radii, shadows, breakpoints and motion. Tailwind
  defaults the brand doesn't use are reset, so an off-brand colour is a missing class
  rather than a silent fallback. Note the type scale is the brand's, not Tailwind's:
  `text-md` is 18px and `text-lg` is 20px.
- **Type roles** — `type-h1`…`type-h3`, `type-body`, `type-body-sm`, `type-eyebrow`,
  `type-label`, … ([`utilities.css`](src/styles/utilities.css)) are composite roles
  (family + weight + size + leading). Add colour, tracking and casing with ordinary
  utilities: `type-eyebrow tracking-wider uppercase`.
- **Responsive** — mobile-first, with two breakpoints: `md` (≥ 768px, tablet) and
  `lg` (≥ 1100px, desktop). Components use `md:` / `lg:` utilities; there is no JS
  breakpoint hook, so the server renders the right layout with no flash.
- **Merging classes** — components take a `className`, and `cn()`
  ([`src/lib/cn.ts`](src/lib/cn.ts)) joins it and resolves Tailwind conflicts (it
  knows this project's custom class names). One gotcha: inside a single `cn()` call,
  put a `leading-*` **after** any `text-*` size — `tailwind-merge` drops an earlier one.
- **Motion** — decorative only. Keyframes and `animate-*` utilities are in the theme;
  every animated element also carries `motion-reduce:` opt-outs.

## Screens to build

**Visitor site** — Home (signed-out and personalised), Collections browse,
Collection detail, Artefact detail, What's on, Event detail (available / limited /
sold out / free / cancelled), Ticket selection, Checkout, Payment, Confirmation,
Sign in, Register, Interests onboarding, Profile, Membership.

**Staff portal** — Dashboard, Collection management, Create/edit collection, Item
management, Category management, Event management, Create/edit event, Ticket
management, Booking management, Staff & roles.

Routes that are linked from navigation but not built yet show an "under
construction" page (`src/components/shared/UnderConstruction.tsx`).

Content is placeholder for now: photography is a labelled placeholder (`Media`), and
collections, events, prices and capacities come from `src/lib/sample-data.ts` until
the API exists.

## Layout

```
src/
├── app/          # Next.js routes, root layout, global stylesheet entry
├── components/   # foundation, forms, feedback, cards, navigation, layout, motion, home
├── lib/          # cn (class merging), nav (routes), sample data — API client, auth to come
└── styles/       # Tailwind theme, base layer and custom utilities
```
