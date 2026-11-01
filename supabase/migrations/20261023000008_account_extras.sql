-- ============================================================
-- Account extras: newsletter (guests + members) and catalogue search
-- ============================================================

-- 1. Newsletter: one row per email address, status limited to two words.
create unique index if not exists newsletter_email_unique
  on public.newsletter_subscriptions (lower(email));

alter table public.newsletter_subscriptions
  add constraint newsletter_status_check
  check (status in ('subscribed', 'unsubscribed')) not valid;

-- 2. Subscribe an email (guests and signed-in users).
--    A signed-in user subscribing their OWN account email links the row to their account.
--    Only that owner can bring back an address that was unsubscribed.
create or replace function public.newsletter_subscribe(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(btrim(p_email));
  v_user uuid := auth.uid();
  v_link uuid;
  v_row public.newsletter_subscriptions%rowtype;
begin
  if v_email is null or length(v_email) > 254
     or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email';
  end if;

  if v_user is not null and exists (
    select 1 from auth.users u where u.id = v_user and lower(u.email) = v_email
  ) then
    v_link := v_user;
  end if;

  insert into public.newsletter_subscriptions (user_id, email, status)
  values (v_link, v_email, 'subscribed')
  on conflict ((lower(email))) do nothing;
  if found then
    return;
  end if;

  select * into v_row from public.newsletter_subscriptions
   where lower(email) = v_email for update;

  if v_row.status = 'unsubscribed' and v_link is not null then
    update public.newsletter_subscriptions
       set status = 'subscribed', user_id = v_link, subscribed_at = now()
     where subscription_id = v_row.subscription_id;
  elsif v_row.user_id is null and v_link is not null then
    update public.newsletter_subscriptions
       set user_id = v_link
     where subscription_id = v_row.subscription_id;
  end if;
end;
$$;

-- 3. The caller's own newsletter status.
create or replace function public.my_newsletter()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_email text;
  v_status text;
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;
  select lower(email) into v_email from auth.users where id = v_user;
  select status into v_status from public.newsletter_subscriptions
   where user_id = v_user or lower(email) = v_email
   order by subscribed_at desc
   limit 1;
  return jsonb_build_object('email', v_email, 'subscribed', coalesce(v_status = 'subscribed', false));
end;
$$;

-- 4. Unsubscribe the caller's own address. Returns how many rows changed.
create or replace function public.newsletter_unsubscribe()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_email text;
  n int;
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;
  select lower(email) into v_email from auth.users where id = v_user;
  update public.newsletter_subscriptions
     set status = 'unsubscribed'
   where (user_id = v_user or lower(email) = v_email) and status = 'subscribed';
  get diagnostics n = row_count;
  return n;
end;
$$;

-- 5. Search across the catalogue. Runs as the caller, so row-level security decides
--    what each visitor can see (guests never get drafts). Text is matched literally.
--    Returns the best p_limit rows of EACH kind: names first, then prefixes, then the rest.
create or replace function public.search_catalogue(p_q text, p_limit int default 5)
returns table (
  kind text, id uuid, title text, description text, detail text, status text,
  starts_at timestamptz, collection_id uuid, collection_name text, score int
)
language sql
stable
set search_path = public
as $$
  with q as (select lower(btrim(p_q)) as t)
  (select * from (
     select 'event'::text, e.event_id, e.name::text as title, e.description,
            null::text, e.status::text, e.start_at, null::uuid, null::text,
            case when lower(e.name) = q.t then 3
                 when strpos(lower(e.name), q.t) = 1 then 2
                 when strpos(lower(e.name), q.t) > 0 then 1 else 0 end as score
       from public.events e cross join q
      where length(q.t) >= 2
        and (strpos(lower(e.name), q.t) > 0 or strpos(lower(coalesce(e.description, '')), q.t) > 0)
   ) s order by s.score desc, s.title limit p_limit)
  union all
  (select * from (
     select 'collection'::text, c.collection_id, c.name::text as title, c.description,
            null::text, c.status::text, null::timestamptz, null::uuid, null::text,
            case when lower(c.name) = q.t then 3
                 when strpos(lower(c.name), q.t) = 1 then 2
                 when strpos(lower(c.name), q.t) > 0 then 1 else 0 end as score
       from public.collections c cross join q
      where length(q.t) >= 2
        and (strpos(lower(c.name), q.t) > 0 or strpos(lower(coalesce(c.description, '')), q.t) > 0)
   ) s order by s.score desc, s.title limit p_limit)
  union all
  (select * from (
     select 'item'::text, ci.item_id, ci.name::text as title, ci.description,
            nullif(concat_ws(', ', ci.historical_period, ci.year_label, ci.origin), '')::text,
            null::text, null::timestamptz, ci.collection_id, c.name::text,
            case when lower(ci.name) = q.t then 3
                 when strpos(lower(ci.name), q.t) = 1 then 2
                 when strpos(lower(ci.name), q.t) > 0 then 1 else 0 end as score
       from public.collection_items ci
       join public.collections c on c.collection_id = ci.collection_id
       cross join q
      where length(q.t) >= 2
        and (strpos(lower(ci.name), q.t) > 0
             or strpos(lower(coalesce(ci.description, '')), q.t) > 0
             or strpos(lower(coalesce(ci.historical_period, '')), q.t) > 0
             or strpos(lower(coalesce(ci.origin, '')), q.t) > 0
             or strpos(lower(coalesce(ci.creator, '')), q.t) > 0)
   ) s order by s.score desc, s.title limit p_limit)
  union all
  (select * from (
     select 'location'::text, l.location_id, l.name::text as title, l.address,
            nullif(concat_ws(', ', l.city, l.country), '')::text,
            null::text, null::timestamptz, null::uuid, null::text,
            case when lower(l.name) = q.t then 3
                 when strpos(lower(l.name), q.t) = 1 then 2
                 when strpos(lower(l.name), q.t) > 0 then 1 else 0 end as score
       from public.locations l cross join q
      where length(q.t) >= 2
        and (strpos(lower(l.name), q.t) > 0
             or strpos(lower(coalesce(l.address, '')), q.t) > 0
             or strpos(lower(coalesce(l.city, '')), q.t) > 0)
   ) s order by s.score desc, s.title limit p_limit)
  union all
  (select * from (
     select 'category'::text, g.category_id, g.name::text as title, g.description,
            null::text, null::text, null::timestamptz, null::uuid, null::text,
            case when lower(g.name) = q.t then 3
                 when strpos(lower(g.name), q.t) = 1 then 2
                 when strpos(lower(g.name), q.t) > 0 then 1 else 0 end as score
       from public.categories g cross join q
      where length(q.t) >= 2
        and (strpos(lower(g.name), q.t) > 0 or strpos(lower(coalesce(g.description, '')), q.t) > 0)
   ) s order by s.score desc, s.title limit p_limit);
$$;

-- 6. Who may call what.
revoke all on function public.newsletter_subscribe(text) from public;
revoke all on function public.my_newsletter() from public, anon;
revoke all on function public.newsletter_unsubscribe() from public, anon;
revoke all on function public.search_catalogue(text, int) from public;
grant execute on function public.newsletter_subscribe(text) to anon, authenticated;
grant execute on function public.my_newsletter() to authenticated;
grant execute on function public.newsletter_unsubscribe() to authenticated;
grant execute on function public.search_catalogue(text, int) to anon, authenticated;