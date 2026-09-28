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
