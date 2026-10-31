-- ============================================================
-- BE-05: Artefacts and category writes
-- ============================================================
-- Categories already have everything the handoff doc asks for (detail,
-- create/edit, active-flag deactivation — see BE-01's migration). This
-- migration is entirely about collection_items (artefacts):
--
--  - category_id: one category per artefact (the doc lists "category" as
--    a single field, unlike collections' many-to-many category_ids).
--  - accession_number: the museum's own unique physical-object ID. Given
--    a partial unique index (null allowed, duplicates among non-null
--    values are not) because that uniqueness is the entire point of an
--    accession number.
--  - tags: free-form text[] for whatever staff want to tag with.
--  - status (active/archived): the soft-delete lifecycle the doc asks
--    for, same varchar-with-app-level-validation convention as
--    collections.status and events.status — no DB enum/CHECK here either.
--  - updated_at: collection_items never had one; added so PATCH can set
--    it like every other editable table does.
--
-- The existing collection_items_select_published RLS policy only checked
-- the PARENT collection's status; it's altered below to also require the
-- item's own status = active, so an archived artefact behaves like an
-- archived collection or event (hidden from the public, visible to staff).
--
-- item_media is a new join table, identical in shape to the existing
-- collection_media / event_media, so the already-working media-attachment
-- API (BE-08) can be extended to cover artefacts too.
-- ============================================================

alter table collection_items
  add column category_id uuid references categories(category_id),
  add column accession_number varchar,
  add column tags text[] not null default '{}',
  add column status varchar not null default 'active',
  add column updated_at timestamptz not null default now();

create unique index collection_items_accession_number_key
  on collection_items (accession_number)
  where accession_number is not null;

comment on column collection_items.category_id is
  'One category per artefact (unlike collections, which use a many-to-many category_ids list).';
comment on column collection_items.accession_number is
  'The museum''s own unique physical-object identifier. Unique among non-null values.';
comment on column collection_items.tags is
  'Free-form tags, staff-assigned.';
comment on column collection_items.status is
  'active or archived. Same convention as collections.status/events.status: validated at the app layer, no DB enum.';

-- An archived artefact is now also hidden from the public, same as its
-- parent collection being a draft already hides it. Staff still see
-- everything via the existing collection_items_staff_all policy.
alter policy "collection_items_select_published"
  on collection_items
  using (
    status = 'active'
    and exists (
      select 1 from collections c
      where c.collection_id = collection_items.collection_id
      and c.status = 'published'
    )
  );

-- Ordered images for artefacts, same shape as collection_media/event_media.
create table item_media (
  item_id           uuid references collection_items(item_id) on delete cascade,
  media_id          uuid references media(media_id) on delete cascade,
  sort_order        int not null default 0,
  primary key (item_id, media_id)
);

alter table item_media enable row level security;

create policy "item_media_select_published"
on item_media for select
using (
  exists (
    select 1 from collection_items i
    join collections c on c.collection_id = i.collection_id
    where i.item_id = item_media.item_id
      and i.status = 'active'
      and c.status = 'published'
  )
);

create policy "item_media_staff_all"
on item_media for all
using (public.is_staff())
with check (public.is_staff());
