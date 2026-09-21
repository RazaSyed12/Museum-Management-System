-- ============================================================
-- RLS Policies — Collections & Media
-- (collections, collection_categories, collection_items,
--  media, collection_media)
-- ============================================================
-- First group where "public" and "everything" genuinely differ:
-- collections has a status field (draft/published). The public
-- should only ever see published collections; staff see and
-- manage everything, including drafts still being worked on.
--
-- collection_categories and collection_items don't have their
-- own visibility rule — they inherit it from the parent
-- collection's status via an EXISTS check. A draft collection's
-- items/category links stay invisible to the public even though
-- those child tables have no status column of their own.
--
-- media is public-readable outright (a media URL alone isn't
-- sensitive) but only staff can upload/manage it.
-- ============================================================


-- --------------------------------------------------------------
-- collections
-- --------------------------------------------------------------

create policy "collections_select_published"
on collections for select
using (status = 'published');

create policy "collections_staff_all"
on collections for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- collection_items (inherits visibility from parent collection)
-- --------------------------------------------------------------

create policy "collection_items_select_published"
on collection_items for select
using (
  exists (
    select 1 from collections c
    where c.collection_id = collection_items.collection_id
    and c.status = 'published'
  )
);

create policy "collection_items_staff_all"
on collection_items for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- collection_categories (join table — inherits from collection)
-- --------------------------------------------------------------

create policy "collection_categories_select_published"
on collection_categories for select
using (
  exists (
    select 1 from collections c
    where c.collection_id = collection_categories.collection_id
    and c.status = 'published'
  )
);

create policy "collection_categories_staff_all"
on collection_categories for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- media
-- --------------------------------------------------------------

create policy "media_select_public"
on media for select
using (true);

create policy "media_staff_all"
on media for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- collection_media (join table — inherits from collection)
-- --------------------------------------------------------------

create policy "collection_media_select_published"
on collection_media for select
using (
  exists (
    select 1 from collections c
    where c.collection_id = collection_media.collection_id
    and c.status = 'published'
  )
);

create policy "collection_media_staff_all"
on collection_media for all
using (public.is_staff())
with check (public.is_staff());
