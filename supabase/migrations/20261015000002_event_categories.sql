-- ============================================================
-- Museum Visitor Experience Platform — Event Categories
-- ============================================================
-- Recommendations work by matching the categories a user picked
-- during onboarding (user_preferences) against the categories of
-- events and collections. Collections already had categories
-- (collection_categories); events did not — the only route was
-- the indirect event -> event_collections -> collection_categories
-- path, so a talk or workshop with no linked collection could
-- never be recommended to anyone.
--
-- Events are now tagged directly. Staff must pick at least one
-- category per event (enforced by the API, since "at least one
-- child row" can't be a simple table constraint); the staff form
-- pre-fills the picker from the linked collections' categories.
-- ============================================================

create table public.event_categories (
  event_id          uuid not null references public.events(event_id) on delete cascade,
  category_id       uuid not null references public.categories(category_id) on delete cascade,
  primary key (event_id, category_id)
);
alter table public.event_categories enable row level security;


-- ------------------------------------------------------------
-- Indexes for "which events / collections are in category X?"
-- The primary keys lead with event_id / collection_id, so they
-- can't serve lookups that start from the category side — which
-- is exactly what recommendations and the ?category_id= filter do.
-- ------------------------------------------------------------
create index event_categories_category_id_idx
  on public.event_categories (category_id);

create index collection_categories_category_id_idx
  on public.collection_categories (category_id);


-- ------------------------------------------------------------
-- RLS — same join-table pattern as event_collections: a tag is
-- visible whenever its parent event is (anything but 'draft');
-- only staff can add or remove tags.
-- ------------------------------------------------------------
create policy "event_categories_select_public"
on public.event_categories for select
using (
  exists (
    select 1 from public.events e
    where e.event_id = event_categories.event_id
    and e.status <> 'draft'
  )
);

create policy "event_categories_staff_all"
on public.event_categories for all
using (public.is_staff())
with check (public.is_staff());
