-- ============================================================
-- Museum Visitor Experience Platform — Initial Schema
-- Based on the team's ERD (Database_ER_diagram (crow's foot).pdf)
-- with two corrections applied, per team discussion:
--
-- 1. Role/Permission/UserRole/RolePermission removed.
--    Replaced with a single `role` enum column — matches the
--    team's earlier decision to stick to simple role-based access
--    control rather than the full extensible permission model.
--
-- 2. `User` table with its own password_hash removed.
--    Replaced with `profiles`, which references Supabase's
--    built-in `auth.users` table. Supabase Auth already handles
--    login, password hashing, and sessions — we don't reimplement
--    that. `profiles` only holds the app-specific fields.
--
-- Every table below has RLS enabled at creation (no retrofitting).
-- Policies are NOT included yet — until policies are added, these
-- tables are reachable only via the service_role key. That's the
-- deliberate, safe starting state.
-- ============================================================


-- ============================================================
-- 1. IDENTITY & ACCESS
-- ============================================================

create type user_role as enum ('registered', 'member', 'staff');
create type account_status as enum ('active', 'suspended', 'deleted');

create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  display_name      varchar,
  role              user_role not null default 'registered',
  account_status    account_status not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table profiles enable row level security;


-- ============================================================
-- 2. MEMBERSHIP
-- ============================================================

create table membership_plans (
  plan_id           uuid primary key default gen_random_uuid(),
  name              varchar not null,
  description       text,
  price             decimal(10,2) not null default 0,
  duration_months   int not null,
  active            boolean not null default true
);
alter table membership_plans enable row level security;

create table memberships (
  membership_id     uuid primary key default gen_random_uuid(),
  user_id           uuid references profiles(id) on delete cascade not null,
  plan_id           uuid references membership_plans(plan_id) not null,
  status            varchar not null default 'active',
  starts_at         timestamptz not null default now(),
  ends_at           timestamptz
);
alter table memberships enable row level security;

create table membership_benefits (
  benefit_id        uuid primary key default gen_random_uuid(),
  plan_id           uuid references membership_plans(plan_id) on delete cascade not null,
  benefit_type      varchar not null,
  benefit_value     varchar,
  configuration     jsonb
);
alter table membership_benefits enable row level security;


-- ============================================================
-- 3. LOCATIONS & CATEGORIES
-- ============================================================

create table locations (
  location_id       uuid primary key default gen_random_uuid(),
  name              varchar not null,
  address           text,
  city              varchar,
  country           varchar,
  capacity          int
);
alter table locations enable row level security;

create table categories (
  category_id           uuid primary key default gen_random_uuid(),
  name                  varchar not null,
  description           text,
  parent_category_id    uuid references categories(category_id),
  active                boolean not null default true
);
alter table categories enable row level security;


-- ============================================================
-- 4. COLLECTIONS & MEDIA
-- ============================================================

create table collections (
  collection_id     uuid primary key default gen_random_uuid(),
  name              varchar not null,
  description       text,
  status            varchar not null default 'draft',
  location_id       uuid references locations(location_id),
  price             decimal(10,2),
  featured          boolean not null default false,
  created_by        uuid references profiles(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table collections enable row level security;

create table collection_categories (
  collection_id     uuid references collections(collection_id) on delete cascade,
  category_id       uuid references categories(category_id) on delete cascade,
  primary key (collection_id, category_id)
);
alter table collection_categories enable row level security;

create table collection_items (
  item_id             uuid primary key default gen_random_uuid(),
  collection_id       uuid references collections(collection_id) on delete cascade not null,
  name                varchar not null,
  description         text,
  historical_period   varchar,
  year_label          varchar,
  origin              varchar,
  creator             varchar,
  location_id         uuid references locations(location_id),
  created_at          timestamptz not null default now()
);
alter table collection_items enable row level security;

create table media (
  media_id          uuid primary key default gen_random_uuid(),
  uploaded_by       uuid references profiles(id),
  url               varchar not null,
  media_type        varchar,
  alt_text          varchar,
  created_at        timestamptz not null default now()
);
alter table media enable row level security;

create table collection_media (
  collection_id     uuid references collections(collection_id) on delete cascade,
  media_id          uuid references media(media_id) on delete cascade,
  sort_order        int not null default 0,
  primary key (collection_id, media_id)
);
alter table collection_media enable row level security;


-- ============================================================
-- 5. EVENTS
-- ============================================================

create table events (
  event_id          uuid primary key default gen_random_uuid(),
  name              varchar not null,
  description       text,
  start_at          timestamptz not null,
  end_at            timestamptz not null,
  status            varchar not null default 'scheduled',
  location_id       uuid references locations(location_id),
  ticket_price      decimal(10,2) not null default 0,
  capacity          int not null,
  created_by        uuid references profiles(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table events enable row level security;

create table event_collections (
  event_id          uuid references events(event_id) on delete cascade,
  collection_id     uuid references collections(collection_id) on delete cascade,
  primary key (event_id, collection_id)
);
alter table event_collections enable row level security;

create table event_media (
  event_id          uuid references events(event_id) on delete cascade,
  media_id          uuid references media(media_id) on delete cascade,
  sort_order        int not null default 0,
  primary key (event_id, media_id)
);
alter table event_media enable row level security;


-- ============================================================
-- 6. TICKETING, BOOKINGS & PAYMENTS
-- ============================================================

create table ticket_allocations (
  allocation_id         uuid primary key default gen_random_uuid(),
  event_id              uuid references events(event_id) on delete cascade not null,
  membership_required   boolean not null default false,
  allocation_name       varchar not null,
  quantity              int not null,
  reserved_quantity     int not null default 0
);
alter table ticket_allocations enable row level security;

create table bookings (
  booking_id        uuid primary key default gen_random_uuid(),
  user_id           uuid references profiles(id) not null,
  event_id          uuid references events(event_id) not null,
  booking_status    varchar not null default 'pending',
  quantity          int not null,
  subtotal          decimal(10,2) not null,
  tax_amount        decimal(10,2) not null default 0,
  service_fee       decimal(10,2) not null default 0,
  total_amount      decimal(10,2) not null,
  booked_at         timestamptz not null default now()
);
alter table bookings enable row level security;

create table tickets (
  ticket_id         uuid primary key default gen_random_uuid(),
  booking_id        uuid references bookings(booking_id) on delete cascade not null,
  allocation_id     uuid references ticket_allocations(allocation_id) not null,
  ticket_status     varchar not null default 'valid',
  price             decimal(10,2) not null,
  ticket_code       varchar unique
);
alter table tickets enable row level security;

create table payments (
  payment_id            uuid primary key default gen_random_uuid(),
  booking_id            uuid references bookings(booking_id) not null,
  provider              varchar not null default 'simulated',
  payment_status        varchar not null default 'pending',
  amount                decimal(10,2) not null,
  transaction_reference varchar,
  paid_at               timestamptz
);
alter table payments enable row level security;


-- ============================================================
-- 7. PERSONALISATION
-- ============================================================

create table user_preferences (
  user_id               uuid references profiles(id) on delete cascade,
  category_id           uuid references categories(category_id) on delete cascade,
  preference_weight     decimal(5,2) not null default 1.0,
  created_at            timestamptz not null default now(),
  primary key (user_id, category_id)
);
alter table user_preferences enable row level security;

create table user_interactions (
  interaction_id    uuid primary key default gen_random_uuid(),
  user_id           uuid references profiles(id),
  collection_id     uuid references collections(collection_id),
  item_id           uuid references collection_items(item_id),
  event_id          uuid references events(event_id),
  category_id       uuid references categories(category_id),
  interaction_type  varchar not null,
  occurred_at       timestamptz not null default now()
);
alter table user_interactions enable row level security;

create table recommendations (
  recommendation_id     uuid primary key default gen_random_uuid(),
  user_id               uuid references profiles(id) not null,
  collection_id         uuid references collections(collection_id),
  item_id               uuid references collection_items(item_id),
  event_id              uuid references events(event_id),
  source                varchar not null,
  score                 decimal(6,4),
  generated_at          timestamptz not null default now()
);
alter table recommendations enable row level security;


-- ============================================================
-- 8. NEWSLETTER (kept, but client hasn't confirmed this is required —
--    see requirements doc, "still needs clarification later")
-- ============================================================

create table newsletter_subscriptions (
  subscription_id   uuid primary key default gen_random_uuid(),
  user_id           uuid references profiles(id),
  email             varchar not null,
  status            varchar not null default 'subscribed',
  subscribed_at     timestamptz not null default now()
);
alter table newsletter_subscriptions enable row level security;
