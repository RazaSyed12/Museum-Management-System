# Museum-Management-System

Heritage Museum — a visitor website and a staff management portal.

## Repository layout

| Path | What it is |
| --- | --- |
| `frontend/` | Next.js visitor site + staff portal (TypeScript, Tailwind CSS) |
| `backend/` | Node/Express + PostgreSQL API |

Both live in this single repository. Setup and conventions for each are in its
own README: [`frontend/`](frontend/README.md), [`backend/`](backend/README.md).

## Source ZIP for sharing

Run `pwsh -File scripts/Package-Source.ps1` from the project root to create
`Museum-Management-System-source.zip`. The archive includes source, assets,
tests, migrations, deployment configuration, documentation and dependency
lockfiles. It excludes Git history, installed dependencies, build output,
local environment files, logs, caches and test output. `.env.example` templates
are included; configure your own local environment after extracting.

For local Node development, copy `.env.example` to `backend/.env` and
`frontend/.env.example` to `frontend/.env.local`, then install dependencies
with `npm ci` inside both `backend/` and `frontend/`. See each folder's README
and `SETUP_SUPABASE_LOCAL.md` for database and startup instructions.
