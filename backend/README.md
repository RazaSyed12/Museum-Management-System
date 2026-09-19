# Heritage Museum — backend

Node/Express API over PostgreSQL, serving the visitor website and the staff portal.
It lives in the `Museum-Management-System` monorepo alongside `frontend/`.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the values
npm run migrate
npm run dev              # http://localhost:4000
```

## Domain

What the visitor website and the staff portal need from the API:

| Resource | Notes |
| --- | --- |
| `collections` | name, description, category, period, gallery location, cover image, status (draft/published/archived), featured flag |
| `items` | artefacts within a collection: name, description, period, approximate date, origin, materials, accession number, display location, status |
| `categories` | staff-managed; drives public filtering — never hard-coded in the frontend |
| `events` | name, description, start/end date, start/end time, location, associated collections, status (draft/published/cancelled/completed) |
| `tickets` | per-event capacity, standard price, member price, **member allocation** (held until 48h before, then released to general sale) |
| `bookings` | reference, customer, event, quantity, totals, payment status, booking status |
| `users` | visitors; free accounts that personalise the site |
| `memberships` | paid supporter scheme — separate from an account; drives member pricing and reserved allocation |
| `interests` | visitor-selected categories, used for recommendations |
| `staff` + `roles` | role-based permissions (`collection.*`, `event.cancel`, `ticket.manage`, `booking.checkin`, `staff.manage`, …) |

## Rules the API must enforce

- **An account is not a membership.** Accounts are free and personalise the site;
  membership is paid, and grants member pricing plus a reserved ticket allocation.
- **Cancelled and sold-out events are never bookable.** The UI disables the CTA,
  but the API is the authority.
- **Cancelling an event** refunds and notifies every existing booking, and keeps
  the event publicly visible, clearly marked as cancelled.
- **Member allocation** is held back from general sale until 48 hours before an
  event, then released.
- **Recommendations** are explained in human terms ("Because you explored
  Prehistory"). Never expose scores, model names, or the words algorithm/engine/AI.

## Layout

```
src/
├── routes/       # HTTP routes per resource
├── controllers/  # request handling
├── models/       # data access
├── middleware/   # auth, role checks, validation, errors
├── db/           # pool, migrations, seeds
└── config/       # env loading
tests/
```
