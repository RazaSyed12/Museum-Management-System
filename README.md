# Museum-Management-System

Heritage Museum — a visitor website and a staff management portal, built on an
imported design system.

## Repository layout

| Path | What it is |
| --- | --- |
| `design-system/` | The Heritage Museum design system, imported from Claude Design |
| `frontend/` | Next.js visitor site + staff portal (TypeScript) |
| `backend/` | Node/Express + PostgreSQL API |

All three are tracked directly in this repository — a single repo, not separate
git histories per package.

## The design system

Imported from the Claude Design project
[Heritage Museum Design System](https://claude.ai/design/p/5a515469-233b-4a9f-968c-8fe333d5e14a).

```
design-system/
├── styles.css                # single entry point — @imports every token file
├── tokens/                   # colours, typography, spacing, elevation, motion, base
├── components/               # 37 React components in six groups
│   └── <group>/Name.jsx + Name.d.ts + Name.prompt.md
├── guidelines/               # 20 specimen cards — palette, type, spacing, motion, voice
├── ui_kits/
│   ├── visitor_site/         # 15 visitor screens, 3 breakpoints, 3 signed-in states
│   └── staff_portal/         # 10 staff screens, 3 breakpoints
├── assets/                   # logo lockups
├── readme.md                 # the authority on voice, colour, type, spacing, a11y
└── tools/                    # regenerate _ds_bundle.js and _ds_manifest.json
```

**Brand.** Olive green `#6B7F3B`, dark green `#1F3B24`, pale yellow `#F2E2A6`, on
warm off-white paper. Cormorant Garamond for display, Source Sans 3 for body.

**Preview the kits.** Open `design-system/ui_kits/visitor_site/index.html` or
`design-system/ui_kits/staff_portal/index.html` in a browser — a toolbar switches
breakpoint (1440 / 768 / 390) and visitor state (anonymous / registered / member).
They need network access for the React, Babel and Lucide CDNs.

**Rebuilding generated files.** `_ds_bundle.js` (the browser bundle the kits load)
and `_ds_manifest.json` are generated. After editing any component source:

```bash
npm i --no-save @babel/core @babel/preset-react
node design-system/tools/build-bundle.js
node design-system/tools/build-manifest.js
```

## Known gaps in the import

- `assets/logo-primary.png` and the two source brand sheets in `uploads/` exceed
  the design API's 192 KB per-file read limit and could not be pulled down. Only
  the large stacked lockup is affected — `logo-mark.png` and
  `logo-lockup-horizontal.png` imported intact, and those are the two the `Logo`
  component uses. `guidelines/logo-lockups.html` will show one broken image until
  the file is downloaded from the project page.
- All photography is a labelled duotone placeholder; prices, capacities and
  category lists are invented placeholders.
- Fonts load from Google Fonts. Swap `tokens/fonts.css` for `@font-face` rules if
  the museum has licensed cuts.
