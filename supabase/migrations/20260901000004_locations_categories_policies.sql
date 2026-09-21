-- ============================================================
-- RLS Policies — Locations & Categories
-- ============================================================
-- Both are open reference data: anyone (including logged-out
-- visitors) can browse locations and categories, since they're
-- just used to describe/filter collections and events on the
-- public site. Only staff can create, edit, or remove them —
-- this is what makes categories "dynamic" per the client's
-- requirement (staff add a new category like "Industrial
-- Revolution" with no code change — just a row insert, gated
-- by this policy).
-- ============================================================


-- --------------------------------------------------------------
-- locations
-- --------------------------------------------------------------

create policy "locations_select_public"
on locations for select
using (true);

create policy "locations_staff_all"
on locations for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- categories
-- --------------------------------------------------------------

create policy "categories_select_public"
on categories for select
using (active = true);

create policy "categories_staff_all"
on categories for all
using (public.is_staff())
with check (public.is_staff());
