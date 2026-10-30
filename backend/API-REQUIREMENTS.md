# Staff Portal — API requirements

The frontend's Staff Portal (`frontend/src/app/staff/*`) currently runs entirely
on mock data (`frontend/src/mocks/staff.ts`, an MSW handler simulating a full
backend in `localStorage`). This document lists what the **real** backend
still needs to provide for each area of the portal to go live, so the mock
can be retired piece by piece.

Collections and Events management is being wired to the real backend now,
since those endpoints already exist (see "Already real" below). Everything
else in this document is still mock-only and blocked on backend work.

## Already real — no work needed

These exist today (`backend/openapi.yaml`) and the client-facing site already
uses them:

- `POST /auth/sign-up`, `/auth/sign-in`, `/auth/refresh`, `/auth/sign-out`, `/auth/forgot-password`, `/auth/reset-password`, `GET /auth/me`
- `GET /me/preferences`, `PUT /me/preferences`
- `GET /categories` (read-only — see below for what's missing)
- `GET /collections`, `GET /collections/{id}`, `POST /collections`, `PATCH /collections/{id}`, `POST /collections/{id}/archive`
- `GET /events`, `GET /events/{id}`, `POST /events`, `PATCH /events/{id}`, `POST /events/{id}/cancel`
- `GET /recommendations`

## Cross-cutting design questions (resolve before building the rest)

1. **Staff tiers.** `profiles.role` is currently `'registered' | 'member' | 'staff'`
   — a single `staff` tier. The Staff Portal's permission model needs three:
   `Admin` / `Manager` / `Staff`, used to gate archiving, refunds, exports,
   settings, and user management (see `frontend/src/lib/staff/permissions.ts`
   for the exact matrix). Needs either a new `profiles.staff_tier` column,
   or folding into `role` as `staff_admin` / `staff_manager` / `staff`.
2. **Visitors vs. profiles.** The portal's "Visitors" are walk-in guests
   tracked by name/email/phone/address with no login — not the same as a
   `profiles` row (which requires a Supabase Auth account). Needs a decision:
   a new lightweight table, or treating them as `profiles` rows created
   without an auth identity.
3. **Settings.** Museum-wide config (contact details, notification toggles,
   default ticket price, cancellation window, per-membership-type pricing)
   has no backing table today. Needs a singleton `settings` row/table.
4. **collection_items has no status.** The schema's `collection_items` table
   (individual artefacts within a collection) has no draft/published/archived
   field, but the portal's artefact list needs one. Add a `status` column, or
   confirm items should just inherit their parent collection's status.

## Collections — gaps

- `GET /collections/{id}/items`, `GET /collections/{id}/items/{itemId}`,
  `POST .../items`, `PATCH .../items/{itemId}` — the `collection_items`
  table exists but has zero routes. Needed for the Staff Portal's Artefacts
  screens and the client site's item detail pages (both currently mock-only).
- Category management: `POST /categories`, `PATCH /categories/{id}`,
  `POST /categories/{id}/archive` (block the archive if any active
  collection/item still references it — see `validate()` in
  `frontend/src/mocks/staff.ts` for the exact rule). `GET /categories` is
  the only verb that exists today.

## Media

- A way to create a `media` row from an uploaded file (the table itself only
  stores a URL today; seeding used direct external URLs). Needs a storage
  backend (e.g. a Supabase Storage bucket) plus `POST /media` accepting a
  file, returning `{media_id, url, alt_text}`.
- `POST /collections/{id}/media`, `DELETE /collections/{id}/media/{mediaId}`,
  and the same pair for events, to attach/detach media after upload (the
  `collection_media`/`event_media` join tables already exist and are read by
  `GET /collections`/`GET /events` — see `COLLECTION_SELECT`/`EVENT_SELECT`
  in `backend/src/routes/collections.ts`/`events.ts`).

## Ticketing / bookings — biggest gap

Nothing exists yet, on either the client site (ticket checkout is fully
mocked) or the Staff Portal (bookings management). Needs:

- `POST /bookings/quote` — given `{event_id, ticket_type, quantity,
  visit_date}`, returns the price and whether it's available, without
  creating anything. Business rules to replicate (see `quote()` in
  `frontend/src/mocks/staff.ts`): event must be published and not yet
  ended; quantity must fit remaining capacity; `Member` tickets require an
  active membership; non-member tickets booked less than 48h before an event
  that still has member allocation reserved are rejected; visit date must
  fall within the event's date range and not be in the past.
- `POST /bookings` — create a booking (client self-service and staff-created).
- `GET /bookings` (staff, filterable by event/visitor/status/date range),
  `GET /bookings/{id}`, `GET /me/bookings` (the signed-in visitor's own).
- `POST /bookings/{id}/cancel`, `POST /bookings/{id}/refund` (Admin/Manager
  only), `POST /bookings/{id}/check-in` (only on the booked visit date, only
  once).
- Cancelling an event (`POST /events/{id}/cancel`, which already exists)
  should cascade: cancel every booking for that event and mark paid ones
  refunded.

## Visitors & walk-in visits

- `GET /visitors`, `GET /visitors/{id}`, `POST /visitors`, `PATCH /visitors/{id}`
  (depends on the cross-cutting question above).
- `POST /visits` — records a walk-in visit (distinct from a ticket check-in),
  used for footfall reporting. `GET /visits`.

## Memberships

- `GET /membership-plans` (a `membership_plans` table already exists and is
  seeded with one plan).
- `GET /memberships` (staff list), `POST /memberships` (assign a plan to a
  visitor), `PATCH /memberships/{id}`.
- Optionally `POST /membership/purchase` for client self-service, separate
  from staff manually assigning one.

## Staff user management (Admin only)

- `GET /staff-users`, `POST /staff-users/{id}/invite`, `PATCH /staff-users/{id}`
  (role/tier, status: Active/Inactive/Invited). Must keep at least one active
  Admin at all times (see the guard in `mocks/staff.ts`'s save handler).

## Dashboard, notifications, reports, search

These can likely be composed from the endpoints above once they exist,
rather than needing bespoke routes — listed here for completeness, not as a
fixed API shape:

- **Dashboard**: recorded visits this/last month, tickets booked this/last
  month, active member count, upcoming published event count, 5 most recent
  bookings, next 4 upcoming events.
- **Notifications**: a feed combining low-capacity-event and
  expiring-membership alerts. Could be computed on read (as the mock does)
  or a real stored table with a background job.
- **Reports**: `GET /reports/{kind}?from=&to=&groupBy=` for
  `visitors | tickets | memberships | events | collections`, each returning
  grouped counts/revenue (see the `kind` branches in `mocks/staff.ts` for the
  exact grouping logic per report).
- **Search**: a single query across visitors/events/bookings/
  memberships/collections/items(/staff users for Admins), returning
  `{id, label, kind, href}` — could be one endpoint or composed client-side
  from each resource's own list endpoint with a `q` param.
