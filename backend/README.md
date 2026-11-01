# Backend API

REST API for the Regional Museum Visitor Experience Platform: accounts, collections and items, events and seat allocation, membership, ticket booking with simulated payments, search, recommendations, newsletter, staff tools (reports, search, notifications, hero slides) and admin.

Stack: Node 24, Express 5, TypeScript, zod, Supabase (Postgres, Auth, Storage), Docker.

API reference: open `backend/api-docs.html` in a browser (source: `backend/openapi.yaml`).

## Requirements

- Docker Desktop (running)
- Node 24
- Supabase CLI

## Run locally

From the project root (the folder with `docker-compose.yml`):

    supabase start
    supabase db reset
    docker compose up --build -d

- `supabase start` starts the local database, auth and storage (Studio at http://127.0.0.1:54323).
- `supabase db reset` applies every migration in `supabase/migrations/`. The demo data (location, categories, collections, events, plan, images) is loaded by the migrations, so `supabase/seed.sql` is intentionally empty.
- `docker compose up --build -d` builds and starts the API at http://127.0.0.1:4000.

Check: open http://127.0.0.1:4000/events - JSON with the demo events and their `images`.

After changing backend code, from `backend`: `npm run build`, then `docker compose down`, then `docker compose up --build -d`.

## Environment (backend/.env)

| Variable | Meaning |
| --- | --- |
| `SUPABASE_URL` | Supabase API address (local: http://127.0.0.1:54321) |
| `SUPABASE_ANON_KEY` | Supabase publishable key (printed by `supabase start`) |
| `PORT` | Port the API listens on |
| `ALLOWED_ORIGINS` | Comma-separated browser origins allowed by CORS (default http://localhost:3000). Set it to the deployed frontend URL |
| `PAYMENT_PROVIDER` | Optional. `simulated` (default) |
| `SESSION_MAX_DAYS` | Optional. Maximum login length in days (default 30) |
| `PASSWORD_RESET_REDIRECT_URL` | Optional. Where reset-password emails send the user |

Only the publishable (anon) key is used. Security is enforced by database policies, so no secret key is stored in the app.

## Demo accounts and extra demo data

Create a staff account: sign up through `POST /auth/sign-up` with `staff-test@museum.local` / `StaffPassword123`, then in Studio's SQL editor run:

    update public.profiles set role='staff' where id=(select id from auth.users where email='staff-test@museum.local');

Then from `backend` run `node scripts/seed-demo-data.ts`. It adds ticket types, membership plans, collection items, images and two demo accounts (`visitor-demo@museum.local` with 2 paid tickets, `member-demo@museum.local` with an active membership; password `TestPassword123`). It is safe to run twice. Local development only.

## Tests

From `backend`:

- `node scripts/load-test.ts` - 100 users compete for 50 seats; expects `ALL CHECKS PASSED` (no overselling).
- `npx tsc -p scripts/tsconfig.json` - type-checks the scripts (no output means OK).

## How the main features work

- Roles: `registered`, `member`, `staff`; staff also have tiers (Admin, Manager, Staff). `GET /auth/me` returns the user, role and `onboarding_completed`.
- Booking: quote, create booking (seats held 15 minutes), pay, confirm. Max 10 tickets, tax 10%, service fee 2%, member discount from the plan. Ticket codes look like `MUS-XXXXXXXXXX`.
- Payments are simulated behind a provider layer in `src/payments/`. A switch in the `app_settings` table (`simulated_payments`) turns simulation off. Adding PayPal later means adding a provider file there.
- Sessions last at most 30 days from sign-in; refreshing does not extend it. After that the API answers 401 `session_expired`.
- Errors always look like `{"error":{"message":"...","code":"..."}}`.

## Deploy

1. Create a Supabase project, then `supabase login` and `supabase link --project-ref <ref>`.
2. `supabase db push` (do not add `--include-seed`; the demo data is already in the migrations).
3. In the project's Auth settings: turn off email confirmation and set minimum password length to 10.
4. Set the backend environment: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PORT`, `ALLOWED_ORIGINS`. The Render blueprint is `render.yaml` in the project root.
5. Create a staff user as above.

Note: Supabase limits sign-ups and sign-ins to about 30 per burst from one IP address. All sign-ins come from the backend, so plan for this on the Free plan.

## Layout

- `src/index.ts` - starts Express, enables CORS, mounts routes
- `src/routes/` - one file per feature area
- `src/payments/` - payment provider layer
- `scripts/` - load test and demo data scripts
- `openapi.yaml`, `api-docs.html` - API contract and readable docs
- `../supabase/migrations/` - database schema, rules and security policies
