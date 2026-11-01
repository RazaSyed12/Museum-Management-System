-- ============================================================
-- Hero slides — staff-manageable homepage hero carousel
-- ============================================================
-- The homepage hero is currently 100% hardcoded on the frontend.
-- This gives staff a real table to manage it from, without a
-- developer. Backend/database only — the frontend keeps reading
-- its hardcoded sample data until a follow-up task wires it up.
--
-- A slide may link to at most one of an event or a collection
-- (never both, enforced below) so its card can show live, never-
-- stale details — the date/location of a linked event or the
-- period of a linked collection always reflects the real row,
-- not a copy frozen at slide-creation time.
--
-- starts_at/ends_at let a slide be scheduled in and out
-- automatically (e.g. a slide that should only appear the week of
-- an event) without staff needing to flip is_active by hand.
-- ============================================================

create table hero_slides (
  slide_id          uuid primary key default gen_random_uuid(),
  eyebrow           varchar,
  title             varchar not null,
  description       text,
  primary_label     varchar,
  primary_href      varchar,
  secondary_label   varchar,
  secondary_href    varchar,
  event_id          uuid references events(event_id),
  collection_id     uuid references collections(collection_id),
  media_id          uuid references media(media_id),
  sort_order        int not null default 0,
  is_active         boolean not null default true,
  starts_at         timestamptz,
  ends_at           timestamptz,
  created_by        uuid references profiles(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint hero_slides_single_link_check
    check (not (event_id is not null and collection_id is not null)),
  constraint hero_slides_schedule_order_check
    check (starts_at is null or ends_at is null or ends_at > starts_at)
);

alter table hero_slides enable row level security;

-- Every read sorts by this.
create index hero_slides_sort_order_idx on hero_slides (sort_order);

-- --------------------------------------------------------------
-- RLS — mirrors the events_select_public / events_staff_all pair.
-- --------------------------------------------------------------

-- Public: only slides that are active AND currently inside their
-- schedule window (an unset starts_at/ends_at means no bound on
-- that side).
create policy "hero_slides_select_public"
on hero_slides for select
using (
  is_active
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

create policy "hero_slides_staff_all"
on hero_slides for all
using (public.is_staff())
with check (public.is_staff());
