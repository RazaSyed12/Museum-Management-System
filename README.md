# Regional Museum Visitor Experience Platform - Backend

REST API for the museum platform: accounts, collections and items, events and seat allocation, membership, ticket booking with simulated payments, search, recommendations, newsletter and staff admin tools.

Stack: Node 24, Express 5, TypeScript, zod, Supabase (Postgres, Auth, Storage), Docker.

Full API reference: open `backend/api-docs.html` in a browser (source: `backend/openapi.yaml`, 56 paths).

## Requirements

- Docker Desktop (running)
- Node 24
- Supabase CLI

## Run locally

Run these from the project root (the folder that contains `docker-compose.yml`):

    supabase start
    supabase db reset
    docker compose up --build -d

- `supabase start` starts the local database, auth and storage (Studio at http://127.0.0.1:54323).
- `supabase db reset` applies every migration in `supabase/migrations/` and loads the base seed data.
- `docker compose up --build -d` builds and starts the API at http://127.0.0.1:4000.

Check it works: open http://127.0.0.1:4000/events - you should see JSON with `total: 4`.

The backend reads `backend/.env`:

| Variable | Meaning |
| --- | --- |
| `SUPABASE_URL` | Supabase API address (local: http://127.0.0.1:54321) |
| `SUPABASE_ANON_KEY` | Supabase publishable key (printed by `supabase start`) |
| `PORT` | Port the API listens on |
| `PAYMENT_PROVIDER` | Optional. `simulated` (default) |
| `SESSION_MAX_DAYS` | Optional. Maximum login length in days (default 30) |
| `PASSWORD_RESET_REDIRECT_URL` | Optional. Where reset-password emails send the user |

After changing backend code, run from `backend`: `npm run build`, then `docker compose down`, then `docker compose up --build -d`.

## Demo data and accounts

From `backend`, run `node scripts/seed-demo-data.ts`. It adds ticket types, membership plans, collection items, images and accounts. It is safe to run twice (the second run prints `skipped`).

| Role | Email | Password |
| --- | --- | --- |
| Staff | staff-test@museum.local | StaffPassword123 |
| Registered visitor (2 paid tickets) | visitor-demo@museum.local | TestPassword123 |
| Member | member-demo@museum.local | TestPassword123 |

For local development only.

## Tests

From `backend`:

- `node scripts/load-test.ts` - 100 users compete for 50 seats; expects `ALL CHECKS PASSED` (no overselling).
- `npx tsc -p scripts/tsconfig.json` - type-checks the scripts (no output means OK).

## How the main features work

- Roles: `registered`, `member`, `staff`. `GET /auth/me` returns the user, role and `onboarding_completed`.
- Booking: quote, create booking (seats held 15 minutes), pay, confirm. Max 10 tickets, tax 10%, service fee 2%, member discount from the plan. Ticket codes look like `MUS-XXXXXXXXXX`.
- Payments are simulated behind a provider layer in `backend/src/payments/`. A switch in the `app_settings` table (`simulated_payments`) turns simulation off. Refunds are not implemented.
- Sessions last at most 30 days from sign-in; refreshing does not extend it. After that the API answers 401 `session_expired`.
- Errors always look like `{"error":{"message":"...","code":"..."}}`.

## Deploy to hosted Supabase

1. Create a Supabase project, then run `supabase login` and `supabase link --project-ref <ref>`.
2. `supabase db push --include-seed`
3. In the project's Auth settings: turn off email confirmation and set minimum password length to 10.
4. Set the backend environment: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PORT`.
5. Create a staff user: sign up, then in the SQL editor run `update public.profiles set role='staff' where id=(select id from auth.users where email='<their email>');`
6. For real payments later, run `update public.app_settings set value='off' where key='simulated_payments';` and add a payment provider.

Note: Supabase limits sign-ups and sign-ins to about 30 per burst from one IP address. Because all sign-ins come from the backend, plan for this on the Free plan.

## Project layout

- `backend/src/index.ts` - starts Express, mounts routes (CORS is open; restrict it before launch)
- `backend/src/routes/` - one file per feature area
- `backend/src/payments/` - payment provider layer
- `backend/scripts/` - load test and demo data scripts
- `backend/openapi.yaml`, `backend/api-docs.html` - API contract and readable docs
- `supabase/migrations/` - database schema, rules and security policies
- `supabase/config.toml` - local Supabase settings
- `docker-compose.yml` - runs the backend container
