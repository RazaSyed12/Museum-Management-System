# What the frontend needs from the API

Concrete, in priority order. The frontend already has working screens built
against the shapes below (currently reading from `frontend/src/lib/sample-data.ts`,
a static fixture) — swapping that fixture for real API calls shouldn't require
changing the screens themselves, so matching these shapes closely saves a
rework pass on both sides. See `README.md` for the domain model and business
rules this builds on.

## Now — blocking: Collections and artefacts

The Collections browse, collection detail and artefact detail pages are built
and live on the fixture today. This is the next thing to unblock.

**`GET /collections`** — list, with query params:
- `q` — search by name
- `category` — repeatable, matches any of the given categories
- `sort` — `popular` (default) | `az`
- `page`, `pageSize`

Returns a page of:
```
{ id, name, category, period, description, location, itemCount, coverImage? }
```
`itemCount` is the catalogue total (e.g. "92 objects"), independent of how
many artefacts are individually digitised. `coverImage` is optional — when
absent the frontend renders a placeholder, so no need to backfill one for
every collection before this ships.

**`GET /collections/:id`** — single collection, same shape as above.

**`GET /collections/:id/items`** — artefacts in that collection:
```
{ id, name, period, date, origin, description, location, image? }
```
`date` is the approximate/display date ("c. 300 BCE") — free text, not a
real `Date`. Most collections will return an empty list for a while; the
detail page already handles that (shows an empty state, not an error).

**`GET /collections/:id/items/:itemId`** — single artefact, same shape.

**`GET /categories`** — the list of category names for the filter UI.
Staff-managed, per the domain table — never hard-code this list on either side.

**Dropped, not needed:** a "period" filter (Pleistocene, Iron Age, 1400–1600,
...) doesn't group into the kind of clean buckets a filter UI needs, so the
frontend isn't asking for one. Likewise no "recently added" sort — that's a
real feature if you want to build it (needs a created-date field we don't
have yet), just not one the current screens are waiting on.

## Next: Events

The frontend is about to build this. Same shape family as Collections:

**`GET /events`** and **`GET /events/:id`**:
```
{ id, title, description, location, startAt, endAt, status,
  price, memberPrice, capacity, remaining }
```
Two asks, both to avoid duplicating business logic on the frontend:
- Send `startAt`/`endAt` as real timestamps, not pre-formatted display
  strings ("18:30–21:00") — the frontend will format them.
- Send availability as a computed field (`available` | `limited` | `soldout`
  | `cancelled`), not just raw `remaining`/`capacity` — the "limited"
  threshold is a business rule, and we'd rather it lived in one place.

## Then: Accounts

Needed once the frontend starts on Sign in / Register / Profile / Membership
(currently placeholder pages). Open question for the meeting: session cookie
or token-based auth? Either works from the frontend side, but it decides how
we call the API, so worth settling early.

- Register, sign in, sign out, current-session lookup
- Profile read/update
- Membership status (active/inactive, plus whatever a member price check needs)

## Later: Ticketing

Needed once Accounts exists. Ticket types and pricing per event (general /
member / child, matching the domain table's per-event pricing), a booking
creation endpoint, and a way to read back a confirmed booking.

## Open for discussion, not blocking anything yet

**Recommendations.** The domain rules already say these must read as plain
language ("Because you explored Prehistory"), never expose a score or model
name. We don't need a real recommendation engine yet — happy to start with
something rule-based (e.g. match a visitor's stated interests, or just
surface the most-booked collections/events) if that's easier to stand up
first and swap later.

## Staff portal frontend contract

The staff frontend is implemented in `frontend/src/components/staff`, with
typed requests in `frontend/src/lib/api/staff.ts` and response types in
`frontend/src/lib/staff/types.ts`. This section specifies backend work;
it does not introduce a backend implementation or database migrations.

### Connection and shared conventions

- All paths below are relative to `/api/staff`. The frontend uses
  `NEXT_PUBLIC_API_BASE_URL` when provided, otherwise the current origin.
- Set `NEXT_PUBLIC_API_MOCKING=disabled` to use the real API. The default
  development preview uses MSW and browser-local fixture persistence.
- Requests include credentials. The backend owns authentication/session
  verification, cross-origin credentials configuration where needed,
  request-origin protection, and all role enforcement.
- Successful reads and writes return JSON; logout, recovery and notification
  acknowledgement may return 204. Errors return
  `{ message: string, fields?: { [fieldName]: string } }` with 400/422 for
  validation, 401 for a missing/expired session, 403 for denied access,
  404 for missing records, and 409 for conflicting state/capacity.
- IDs are opaque strings. Timestamps are ISO 8601 instants. Date-only fields
  use `YYYY-MM-DD`. Museum calendar boundaries use `Australia/Adelaide`,
  including daylight saving. Currency is AUD; monetary amounts are integer
  cents. The frontend formats amounts and dates.
- List results use `{ items, total, page, pageSize }`. Supported query
  parameters: `q`, `status`, `type`, `role`, `eventId`, `visitorId`,
  `categoryId`, `collectionId`, `period`, `origin`, `from`, `to`, `tab`,
  `sort`, `direction`, `page`, `pageSize`, where applicable. Search should
  include linked visitor/event names on bookings. Period/origin searches
  are case-insensitive substrings. Sorting must use an allowlist and a
  deterministic tie-breaker. Bound page sizes; the UI requests 10 rows.
- `tab=today|upcoming|past` uses visit date on bookings and the event's
  programme dates on events. Date-range filters use visit date on bookings,
  join date on memberships, and recorded time on visits. Event date ranges
  should include events overlapping the range, including ongoing exhibitions.
- The lightweight `/references` response supplies selector options to the
  prototype. Return role-appropriate records; support searchable/paged
  selectors if data volume grows beyond a reasonable reference response.

### Authentication and fixed roles

| Method and path | Input | Response |
| --- | --- | --- |
| `GET /auth/session` | — | Staff user or `null` |
| `POST /auth/login` | `{ email, password, remember }` | Staff user; establish session |
| `POST /auth/logout` | — | 204; invalidate session |
| `POST /auth/forgot-password` | `{ email }` | 204 regardless of account existence |
| `POST /auth/reset-password` | `{ token, password }` | 204 |
| `POST /auth/accept-invitation` | `{ token, password }` | 204 |

Staff user: `{ id, name, email, phone, role, status, lastLogin }`.
`role` is exactly `Admin | Manager | Staff`; `status` is
`Active | Inactive | Invited`; `lastLogin` is a timestamp or null.
Use the existing Supabase Auth integration for authentication. Do not accept
roles supplied by an untrusted client as proof of access.

All three roles can view/create/edit operational records, create/cancel
bookings, record visits, and view reports. Admin and Manager can archive
catalogue records, cancel events, record prototype refunds, and export
reports. Admin alone manages staff accounts, pricing, membership plan
configuration and system settings. Admin and Manager can edit museum
contact information and notification preferences. Staff can view museum
contact information/preferences but cannot access pricing/system settings.
Manager can read operational pricing configuration. Roles are fixed; there
is no permission-editor endpoint. Prevent disabling/demoting the last active
Admin, and reject inactive staff on protected operations.

### Resource endpoints and records

For `events`, `visitors`, `bookings`, `memberships`, `collections`, `items`,
`categories`, and `users`: provide `GET /{resource}`, `GET /{resource}/:id`,
`POST /{resource}`, and `PATCH /{resource}/:id`. Writes return the saved record.
Visits need list, detail and creation only. Preserve immutable IDs,
creation times and other server-owned fields during updates.

| Resource | Required response shape |
| --- | --- |
| events | `{ id, title, description, type, startAt, endAt, location, price, memberPrice, childPrice, capacity, memberAllocation, booked, status, images }` |
| visitors | `{ id, name, email, phone, address, registeredAt }` |
| bookings | `{ id, visitorId, eventId, visitDate, quantity, ticketType, total, payment, status, createdAt, checkedInAt }` |
| memberships | `{ id, visitorId, type, joinDate, expiryDate, payment, price }` |
| collections | `{ id, name, description, categoryId, period, location, catalogueTotal, featured, status, images }` |
| items | `{ id, name, collectionId, categoryId, period, date, origin, maker, description, location, accession, tags, status, images }` |
| categories | `{ id, name, description, status }` |
| users | Staff user shape above |
| visits | `{ id, visitorId, bookingId, quantity, visitedAt }` |

`images` is an ordered array of `{ id, url, name, alt }`; the first is primary.
Artefact `date` is descriptive text, not a timestamp. `tags` is a string array.
Collection `catalogueTotal` is independent of the number of digitised artefacts.
`checkedInAt` and walk-in `bookingId` may be null. Walk-ins may have an empty
visitor ID; map this to a nullable database relationship. A visitor does not
require a website account. Contact details are maintained on that visitor.

Event statuses are `Draft | Published | Cancelled | Completed`.
Collection/item statuses are `Draft | Published | Archived`.
Category statuses are `Active | Archived`.
Booking statuses are `Pending | Confirmed | Cancelled`.
Booking payment states are `Pending | Paid | Free | Refunded`.
Membership payment states are `Pending | Paid`; calculate effective membership
status as Pending before the join date or payment, Expired after the expiry
date, otherwise Active. Include/filter this computed status in list results.

### Bookings and action endpoints

- `POST /bookings/quote`: input `{ id?, visitorId, eventId, visitDate,
  quantity, ticketType }`; return `{ total, remaining }`. `ticketType` is
  `General | Member | Child`. Recompute this quote when saving; ignore any
  client-supplied total. The prototype uses quantity × event ticket price,
  without added fees/tax or a stacked membership discount.
- Capacity is per event across all dates. Pending and confirmed bookings
  reserve places. Validate all ticket quantities together, transactionally,
  and exclude the previous reservation when editing a booking. Member
  prices require an active membership. Unused member allocation is released
  48 hours before the event starts. Cancelled, completed, ended, draft and
  sold-out events cannot accept new bookings. Visit dates must be within the
  event dates and cannot be in the past for new reservations.
- `POST /bookings/:id/cancel` releases places; it does not by itself mark a
  paid amount refunded. `POST /bookings/:id/refund` records a simulated full
  refund and cancels the booking. These prototype operations move no money.
- `POST /bookings/:id/check-in` records attendance once, for a confirmed
  booking on its visit date. Set `checkedInAt` and create a visit record with
  the ticket quantity. Repeated requests must not double-count attendance.
  Checked-in or cancelled bookings are not editable in the prototype.
- `POST /events/:id/cancel` takes `{ reason }`, preserves the public event,
  marks it cancelled, and handles linked cancellations/refunds/notifications.
  Backend processing must be idempotent. Do not permit cancellation through
  a plain status edit that bypasses these effects.
- `POST /collections/:id/archive`, `/items/:id/archive`, and
  `/categories/:id/archive` soft-archive records. A category still used by
  active records must be reassigned or rejected with a useful error.
- `POST /users/:id/invite` requests an invitation email via Supabase Auth.
  The frontend preview records requests but sends no email.
- `POST /visits` accepts `{ visitorId?, quantity }`; the backend sets
  `visitedAt`. Recorded visits, including walk-ins, drive visitor metrics.

### Memberships, settings and images

Membership plans are annual: Individual (one adult, A$60), Joint (two adults,
A$100), Family (two adults and up to four children, A$140). These are editable
prototype defaults, not externally approved museum prices. The frontend
suggests expiry one year after joining. Snapshot the plan price on purchase;
plan changes must not rewrite historical memberships.

`GET /settings` and `PATCH /settings` use:
`{ name, address, phone, email, website, logo, timezone, currency,
bookingNotifications, eventNotifications, membershipNotifications,
defaultPrice, cancellationHours, individualPrice, jointPrice, familyPrice }`.
`logo` is an asset or null. Timezone/currency are fixed to Adelaide/AUD.
Enforce field-level role restrictions; secrets are never part of settings.

`POST /uploads` accepts multipart form data with `file`; return an asset.
Use Supabase Storage. The UI currently accepts JPEG, PNG and WebP up to 2 MB
each. Validate actual image content and size server-side. Staff must be
authorised to upload/change assets. Return stable URLs suitable for previews
and published content. Clean up unattached uploads according to backend policy.

`GET /references` returns
`{ events, visitors, categories, collections, memberships, settings }`.
The frontend uses these references for linked labels, visitor membership
eligibility, pricing defaults and editor selectors.

### Dashboard, reports, search and notifications

- `GET /dashboard`: `{ metrics, bookings, events, references }`.
  Each metric is `{ label, value, previous, icon }`. Return recorded visit
  quantities this month, non-cancelled booked ticket quantities this month,
  currently active memberships, and published upcoming/ongoing events.
  Previous visit/ticket totals refer to the previous calendar month;
  membership comparison is the active count at the start of this month.
  Include up to five recent bookings and four upcoming/ongoing event records.
- `GET /reports/:kind?from=&to=&groupBy=` where kind is
  `visitors | tickets | memberships | events | collections` returns
  `{ rows, total, revenue, label }`. Each row:
  `{ id, label, count, revenue, capacity?, attendance?, cancelled?, active?, expired?, pending? }`.
  Visitor rows are daily recorded-visit totals (the UI also groups by month
  and year). Ticket/event rows group bookings by event and booking creation
  date; counts exclude cancellations and revenue excludes refunded payments.
  Event rows include capacity, checked-in ticket quantity and cancelled ticket
  quantities. Membership rows group purchases by plan/join date and include
  their current active, expired and pending counts. Catalogue rows count current
  non-archived digitised artefacts by `groupBy=category|period` and ignore the
  date range.
  Return zero activity honestly; do not fabricate comparison percentages.
  CSV export is generated by the frontend for Admin/Manager using these rows.
- `GET /search?q=` returns up to 15 role-filtered results:
  `{ id, label, kind, href }[]`. Search visitors, events, bookings,
  memberships, collections and artefacts; staff accounts are Admin-only.
- `GET /notifications` returns `{ id, title, href, createdAt, read }[]` for
  the signed-in staff member. `POST /notifications/:id/read` returns 204.
  Notification links must be permission-aware. New bookings, low capacity,
  expiring memberships and staff invitations are expected notification sources.
  Operational email delivery is backend work; in-app notifications are the
  initial frontend behaviour.

### Existing visitor integration

Staff and visitor endpoints must share the same records. Published catalogue
and event changes should appear through the existing public endpoints;
draft/archived records must not leak publicly. Adapt database responses in
the frontend API layer to existing public card/detail shapes where necessary.
The staff development fixture is browser-local and is not a replacement for
this shared backend. It does not mutate server-rendered public fixtures.

The local MSW preview supports persisted staff CRUD, quotes, attendance,
dashboard/report updates, uploads and role scenarios. It deliberately cannot
send invitation/reset emails, validate emailed tokens, charge cards, or
perform real refunds. Those features require the endpoints above.
