-- ============================================================
-- BE-07: Visitors, memberships and attendance
-- ============================================================
-- Three things:
--
--  1. A new `visitors` table: people with no login (walk-ins). Separate
--     from `profiles` on purpose — a visitor isn't a Supabase Auth user
--     and never needs to be. `linked_profile_id` is how a visitor who
--     later creates a real account gets connected to their walk-in
--     history, without forcing staff to invent a password for them.
--     Email uniqueness is deliberately NOT enforced here: the doc flags
--     this as an open decision, and a false "already exists" block on
--     a legitimate re-entry (e.g. a family sharing an email) is worse
--     than an occasional duplicate that gets merged later by staff.
--
--  2. memberships gains a visitor_id alongside the existing user_id,
--     with exactly one of the two required — same pattern as #3 below.
--     purchase_price is added so a plan's price changing later never
--     rewrites what an existing member actually paid.
--
--  3. A new `attendance` table (the doc's "visits"): visitor_id and
--     booking_id are BOTH optional (an anonymous walk-in has neither),
--     quantity must be positive, and a booking can produce at most one
--     attendance row (enforced by a partial unique index), which is
--     the "duplicate prevention" the doc asks for on repeat check-in.
--     check_in_booking() (from BE-06) is extended to insert this row
--     the first time a booking is checked in.
-- ============================================================


-- --------------------------------------------------------------
-- 1. visitors
-- --------------------------------------------------------------

create table visitors (
  visitor_id          uuid primary key default gen_random_uuid(),
  full_name           varchar not null,
  email               varchar,
  phone               varchar,
  address             text,
  linked_profile_id   uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create unique index visitors_linked_profile_id_key
  on visitors (linked_profile_id)
  where linked_profile_id is not null;

comment on column visitors.linked_profile_id is
  'Set once this walk-in visitor creates (or is matched to) a real account. A profile can be linked to at most one visitor record.';
comment on column visitors.email is
  'Not enforced unique on purpose — see migration header. Staff should search before creating a new visitor to avoid accidental duplicates.';

alter table visitors enable row level security;

-- Visitor records are staff-only data — never self-service, never public.
create policy "visitors_staff_all"
on visitors for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- 2. memberships: visitor support + purchase price
-- --------------------------------------------------------------

alter table memberships
  alter column user_id drop not null,
  add column visitor_id uuid references visitors(visitor_id),
  add column purchase_price decimal(10,2);

alter table memberships add constraint memberships_one_owner
  check ((user_id is not null)::int + (visitor_id is not null)::int = 1);

alter table memberships add constraint memberships_purchase_price_non_negative
  check (purchase_price is null or purchase_price >= 0);

-- Backfill: best-effort snapshot of what existing members likely paid,
-- from their plan's CURRENT price (the real, exact amount they paid is
-- already recorded per-payment in the payments table — this column is
-- what prevents FUTURE plan price changes from rewriting history).
update memberships m
   set purchase_price = mp.price
  from membership_plans mp
 where m.plan_id = mp.plan_id
   and m.purchase_price is null;

comment on column memberships.visitor_id is
  'Set instead of user_id for a membership held by a visitor with no login. Exactly one of user_id/visitor_id is set (memberships_one_owner).';
comment on column memberships.purchase_price is
  'What was actually paid at purchase time, preserved even if membership_plans.price later changes.';


-- --------------------------------------------------------------
-- 3. attendance ("visits")
-- --------------------------------------------------------------

create table attendance (
  attendance_id   uuid primary key default gen_random_uuid(),
  visitor_id      uuid references visitors(visitor_id),
  booking_id      uuid references bookings(booking_id),
  quantity        int not null default 1,
  visited_at      timestamptz not null default now(),
  created_by      uuid references profiles(id),
  created_at      timestamptz not null default now()
);

alter table attendance add constraint attendance_quantity_positive
  check (quantity > 0);

-- A booking can produce at most one attendance row — this is the
-- "repeat check-in cannot create duplicate attendance" guarantee,
-- enforced at the database level rather than trusted to app code.
create unique index attendance_booking_id_key
  on attendance (booking_id)
  where booking_id is not null;

comment on column attendance.visitor_id is
  'Optional — an anonymous walk-in has neither this nor booking_id.';
comment on column attendance.booking_id is
  'Set when this attendance was created by checking in a ticketed booking. At most one attendance row per booking.';
comment on column attendance.created_by is
  'The staff member who recorded this (for a walk-in) or performed the check-in (for a ticketed one).';

alter table attendance enable row level security;

create policy "attendance_staff_all"
on attendance for all
using (public.is_staff())
with check (public.is_staff());

-- Ticketed attendance is created by check-in, not by hand.
create or replace function public.check_in_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_b public.bookings%rowtype;
  v_staff uuid := auth.uid();
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  select * into v_b from public.bookings where booking_id = p_booking_id for update;
  if not found then
    raise exception 'booking_not_found';
  end if;

  if v_b.checked_in_at is not null then
    return public.booking_json(p_booking_id); -- already checked in: report it, change nothing
  end if;

  if v_b.booking_status <> 'confirmed' then
    raise exception 'not_confirmed';
  end if;

  update public.bookings set checked_in_at = now() where booking_id = p_booking_id;

  insert into public.attendance (booking_id, quantity, visited_at, created_by)
  values (p_booking_id, v_b.quantity, now(), v_staff)
  on conflict (booking_id) where booking_id is not null do nothing;

  return public.booking_json(p_booking_id);
end;
$$;
