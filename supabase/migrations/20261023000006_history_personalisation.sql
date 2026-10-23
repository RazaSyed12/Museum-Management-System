-- ============================================================
-- History-based personalisation for logged-in users + guest popularity
-- ============================================================

-- 1. user_interactions: remember what a search said, restrict the type words, add indexes.
alter table public.user_interactions add column if not exists search_query varchar(100);

alter table public.user_interactions
  add constraint user_interactions_type_check
  check (interaction_type in ('view', 'category_browse', 'search')) not valid;

create index if not exists user_interactions_user_time_idx
  on public.user_interactions (user_id, occurred_at desc);
create index if not exists user_interactions_collection_idx
  on public.user_interactions (collection_id) where collection_id is not null;

-- 2. Record one interaction as the caller (row-level security still applies).
--    Returns false when the same thing was already recorded in the last 10 minutes.
create or replace function public.log_interaction(
  p_type text,
  p_event_id uuid default null,
  p_collection_id uuid default null,
  p_item_id uuid default null,
  p_category_id uuid default null,
  p_query text default null
)
returns boolean
language plpgsql
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_query text := nullif(lower(btrim(p_query)), '');
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;

  if exists (
    select 1 from public.user_interactions
    where user_id = v_user
      and interaction_type = p_type
      and event_id is not distinct from p_event_id
      and collection_id is not distinct from p_collection_id
      and item_id is not distinct from p_item_id
      and category_id is not distinct from p_category_id
      and search_query is not distinct from v_query
      and occurred_at > now() - interval '10 minutes'
  ) then
    return false;
  end if;

  insert into public.user_interactions
    (user_id, interaction_type, event_id, collection_id, item_id, category_id, search_query)
  values
    (v_user, p_type, p_event_id, p_collection_id, p_item_id, p_category_id, v_query);
  return true;
end;
$$;

-- 3. The caller's category scores from the last 90 days.
--    view = 1, category browse = 2, search naming a category = 2, booking = 5.
create or replace function public.my_category_affinity()
returns table (category_id uuid, name text, weight numeric)
language sql
stable
set search_path = public
as $$
  with signals as (
    select ec.category_id, 1::numeric as w
      from public.user_interactions ui
      join public.event_categories ec on ec.event_id = ui.event_id
     where ui.user_id = auth.uid() and ui.interaction_type = 'view'
       and ui.occurred_at > now() - interval '90 days'
    union all
    select cc.category_id, 1::numeric
      from public.user_interactions ui
      join public.collection_categories cc on cc.collection_id = ui.collection_id
     where ui.user_id = auth.uid() and ui.interaction_type = 'view'
       and ui.occurred_at > now() - interval '90 days'
    union all
    select cc.category_id, 1::numeric
      from public.user_interactions ui
      join public.collection_items ci on ci.item_id = ui.item_id
      join public.collection_categories cc on cc.collection_id = ci.collection_id
     where ui.user_id = auth.uid() and ui.interaction_type = 'view'
       and ui.occurred_at > now() - interval '90 days'
    union all
    select ui.category_id, 2::numeric
      from public.user_interactions ui
     where ui.user_id = auth.uid() and ui.interaction_type = 'category_browse'
       and ui.category_id is not null
       and ui.occurred_at > now() - interval '90 days'
    union all
    select c.category_id, 2::numeric
      from public.user_interactions ui
      join public.categories c
        on length(ui.search_query) >= 3 and strpos(lower(c.name), ui.search_query) > 0
     where ui.user_id = auth.uid() and ui.interaction_type = 'search'
       and ui.occurred_at > now() - interval '90 days'
    union all
    select ec.category_id, 5::numeric
      from public.bookings b
      join public.event_categories ec on ec.event_id = b.event_id
     where b.user_id = auth.uid() and b.booking_status in ('pending', 'confirmed')
       and b.booked_at > now() - interval '90 days'
  )
  select c.category_id, c.name::text, sum(s.w)
    from signals s
    join public.categories c on c.category_id = s.category_id and c.active
   group by c.category_id, c.name;
$$;

-- 4. Guest "most popular": totals only, nothing personal.
--    Events = tickets booked (pending or confirmed). Collections = views by signed-in users.
create or replace function public.popularity_scores()
returns table (kind text, id uuid, score bigint)
language sql
stable
security definer
set search_path = public
as $$
  select 'event'::text, b.event_id, sum(b.quantity)::bigint
    from public.bookings b
    join public.events e on e.event_id = b.event_id
   where b.booking_status in ('pending', 'confirmed')
     and b.booked_at > now() - interval '90 days'
     and e.status = 'scheduled'
   group by b.event_id
  union all
  select 'collection'::text, v.collection_id, count(*)::bigint
    from (
      select ui.collection_id
        from public.user_interactions ui
       where ui.interaction_type = 'view' and ui.collection_id is not null
         and ui.occurred_at > now() - interval '90 days'
      union all
      select ci.collection_id
        from public.user_interactions ui
        join public.collection_items ci on ci.item_id = ui.item_id
       where ui.interaction_type = 'view'
         and ui.occurred_at > now() - interval '90 days'
    ) v
    join public.collections c on c.collection_id = v.collection_id and c.status = 'published'
   group by v.collection_id;
$$;

-- 5. Let a user wipe their own history.
create or replace function public.clear_my_interactions()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  if auth.uid() is null then
    raise exception 'not_signed_in';
  end if;
  delete from public.user_interactions where user_id = auth.uid();
  get diagnostics n = row_count;
  return n;
end;
$$;

-- 6. Who may call what.
revoke all on function public.log_interaction(text, uuid, uuid, uuid, uuid, text) from public, anon;
revoke all on function public.my_category_affinity() from public, anon;
revoke all on function public.clear_my_interactions() from public, anon;
revoke all on function public.popularity_scores() from public;
grant execute on function public.log_interaction(text, uuid, uuid, uuid, uuid, text) to authenticated;
grant execute on function public.my_category_affinity() to authenticated;
grant execute on function public.clear_my_interactions() to authenticated;
grant execute on function public.popularity_scores() to anon, authenticated;