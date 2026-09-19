repo: RazaSyed12/Museum-Management-System
branch: main

## Last sync

date: 2026-09-17T13:48:00Z
method: manual zip export from the project page, unpacked and merged in by Claude Code (the design MCP's GitHub sync/API auth wasn't available in this session)

### Updated in this project
- New scroll-reveal motion system for the visitor site: `ui_kits/visitor_site/Motion.jsx` + `motion.css` (new files), wired into `Shell.jsx`, `HomeScreen.jsx`, `VisitorApp.jsx` and `index.html` via `hm-*` classes — hero Ken Burns pan, card lift, button sheen, scroll-triggered reveals.
- `assets/logo-primary.png` and both `uploads/ChatGPT Image Aug 26, 2026, 04_38_55 PM (*).png` brand-sheet sources are now present — the previous import truncated these at the design MCP's 192 KB per-file read limit; the zip export has no such cap. `uploads/README.md`, which documented that gap, has been removed since it no longer applies.
- New print-friendly kit exports: `ui_kits/visitor_site/index-print.html` and `ui_kits/staff_portal/index-print.html`.
- `_ds_bundle.js` recompiled to match; manifest, readme, github.md screen map, and all `staff_portal` screens were unchanged.

## Sync history

### 2026-08-26T07:18:24Z
- Read the repository tree and README; the repository is currently empty (one 26-byte README, no source).
- Nothing could be imported — the design system was built from the uploaded brand identity sheet instead.
- Re-sync once the Next.js application lands so components can be aligned with real code.

## Screen map

| Screen | Built from |
| --- | --- |
| ui_kits/visitor_site/* | uploads/ChatGPT Image Aug 26, 2026, 04_38_55 PM (1).png (brand sheet) + product brief |
| ui_kits/staff_portal/* | product brief |
| components/**, tokens/** | brand identity sheet (palette, type, logo) |
