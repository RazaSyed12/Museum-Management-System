# Heritage Museum — frontend

Next.js app for the visitor website and the staff portal.

This is its **own git repository**, with a history separate from the backend.
It sits inside the `Museum-Management-System` working tree for convenience;
the parent repo does not track its contents.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Design system

The visual language lives in [`../design-system/`](../design-system/) — imported
from the Claude Design project "Heritage Museum Design System".

- **Tokens** — `design-system/styles.css` imports every token file. Link or
  `@import` that one file and use the CSS custom properties (`var(--action-primary)`,
  `var(--type-h1)`, `var(--space-6)`); never hard-code hex or px.
- **Components** — 37 React components in `design-system/components/`, each with a
  `.jsx` implementation, a `.d.ts` props contract and a `.prompt.md` describing when
  to use it. They are plain React with inline styles driven by the tokens, so they
  can be copied into `src/components/` or imported directly.
- **Screens** — `design-system/ui_kits/visitor_site/` and `.../staff_portal/` are
  working prototypes of all 25 screens. Open their `index.html` in a browser to
  step through breakpoints (1440 / 768 / 390) and visitor states.
- **Rules** — `design-system/readme.md` is the authority on voice, colour, type,
  spacing and accessibility. `design-system/_adherence.oxlintrc.json` encodes the
  component prop contracts and the no-raw-hex / no-raw-px rules as lint config.

## Screens to build

**Visitor site** — Home (signed-out and personalised), Collections browse,
Collection detail, Artefact detail, What's on, Event detail (available / limited /
sold out / free / cancelled), Ticket selection, Checkout, Payment, Confirmation,
Sign in, Register, Interests onboarding, Profile, Membership.

**Staff portal** — Dashboard, Collection management, Create/edit collection, Item
management, Category management, Event management, Create/edit event, Ticket
management, Booking management, Staff & roles.

## Layout

```
src/
├── app/          # Next.js routes
├── components/   # app components (design-system components adapted as needed)
├── lib/          # API client, formatting, auth helpers
└── styles/       # global css entry that pulls in the design tokens
```
