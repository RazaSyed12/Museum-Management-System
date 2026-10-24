-- ============================================================
-- Admin: user management, stats, and suspension that actually bites
-- ============================================================

-- 1. A suspended (or deleted) staff account is no longer staff.
--    Every staff rule in the database goes through this function.
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff' and account_status = 'active'
  );
$$;

-- 2. List users (staff only). Email comes from the auth system.
create or replace function public.admin_list_users(
  p_q text default null,
  p_role text default null,
  p_status text default null,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  id uuid, email text, full_name text, role text, account_status text,
  created_at timestamptz, last_sign_in_at timestamptz,
  is_member boolean, bookings_count bigint, total bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  return query
  select p.id, u.email::text, p.full_name::text, p.role::text, p.account_status::text,
         p.created_at, u.last_sign_in_at,
         public.is_active_member(p.id),
         (select count(*) from public.bookings b where b.user_id = p.id),
         count(*) over ()
    from public.profiles p
    join auth.users u on u.id = p.id
   where (p_role is null or p.role::text = p_role)
     and (p_status is null or p.account_status::text = p_status)
     and (p_q is null or p_q = ''
          or strpos(lower(p.full_name), lower(p_q)) > 0
          or strpos(lower(u.email), lower(p_q)) > 0)
   order by p.created_at desc, p.id
   limit p_limit offset p_offset;
end;
$$;

-- 3. One user in detail (staff only).
create or replace function public.admin_get_user(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb;
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  select jsonb_build_object(
           'id', p.id,
           'email', u.email,
           'full_name', p.full_name,
           'role', p.role,
           'account_status', p.account_status,
           'created_at', p.created_at,
           'updated_at', p.updated_at,
           'last_sign_in_at', u.last_sign_in_at,
           'is_member', public.is_active_member(p.id),
           'membership', (
             select to_jsonb(m) || jsonb_build_object('plan', to_jsonb(mp))
               from public.memberships m
               join public.membership_plans mp on mp.plan_id = m.plan_id
              where m.user_id = p.id and m.status = 'active'
                and (m.ends_at is null or m.ends_at > now())
              order by m.ends_at desc nulls first
              limit 1),
           'bookings_count', (select count(*) from public.bookings b where b.user_id = p.id),
           'recent_bookings', coalesce((
             select jsonb_agg(r)
               from (select b.booking_id, b.booking_status, b.quantity, b.total_amount,
                            b.booked_at, e.name as event_name
                       from public.bookings b
                       join public.events e on e.event_id = b.event_id
                      where b.user_id = p.id
                      order by b.booked_at desc
                      limit 10) r), '[]'::jsonb)
         )
    into v
    from public.profiles p
    join auth.users u on u.id = p.id
   where p.id = p_id;

  if v is null then
    raise exception 'user_not_found';
  end if;
  return v;
end;
$$;

-- 4. Change a user's role and/or status (staff only).
--    Suspending also ends all of that user's sessions.
create or replace function public.admin_set_user(
  p_id uuid,
  p_role text default null,
  p_status text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;
  if p_role is null and p_status is null then
    raise exception 'nothing_to_change';
  end if;
  if p_role is not null and p_role not in ('registered', 'staff') then
    raise exception 'invalid_role';
  end if;
  if p_status is not null and p_status not in ('active', 'suspended') then
    raise exception 'invalid_status';
  end if;
  if not exists (select 1 from public.profiles where id = p_id) then
    raise exception 'user_not_found';
  end if;

  -- Staff cannot demote or suspend themselves. This also guarantees the last
  -- staff account can never be removed (the caller is always one of them).
  if p_id = v_me
     and ((p_role is not null and p_role <> 'staff')
          or (p_status is not null and p_status <> 'active')) then
    raise exception 'cannot_change_self';
  end if;

  update public.profiles
     set role = coalesce(p_role::user_role, role),
         account_status = coalesce(p_status::account_status, account_status),
         updated_at = now()
   where id = p_id;

  if p_status = 'suspended' then
    delete from auth.sessions where user_id = p_id;
    delete from auth.refresh_tokens where user_id::text = p_id::text;
  end if;

  return public.admin_get_user(p_id);
end;
$$;

-- 5. Dashboard numbers (staff only).
--    "collected" = completed payments (a refund moves a payment out of "completed").
create or replace function public.admin_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  return jsonb_build_object(
    'users', (
      select jsonb_build_object(
        'total', count(*),
        'active', count(*) filter (where account_status = 'active'),
        'suspended', count(*) filter (where account_status = 'suspended'),
        'staff', count(*) filter (where role = 'staff'),
        'new_last_30_days', count(*) filter (where created_at > now() - interval '30 days'),
        'active_members', (select count(*) from public.memberships m
                            where m.status = 'active' and (m.ends_at is null or m.ends_at > now()))
      ) from public.profiles),
    'events', (
      select jsonb_build_object(
        'total', count(*),
        'draft', count(*) filter (where status = 'draft'),
        'scheduled', count(*) filter (where status = 'scheduled'),
        'cancelled', count(*) filter (where status = 'cancelled'),
        'upcoming', count(*) filter (where status = 'scheduled' and end_at >= now())
      ) from public.events),
    'bookings', (
      select jsonb_build_object(
        'total', count(*),
        'pending', count(*) filter (where booking_status = 'pending'),
        'confirmed', count(*) filter (where booking_status = 'confirmed'),
        'cancelled', count(*) filter (where booking_status = 'cancelled'),
        'expired', count(*) filter (where booking_status = 'expired'),
        'tickets_confirmed', coalesce(sum(quantity) filter (where booking_status = 'confirmed'), 0)
      ) from public.bookings),
    'revenue', (
      select jsonb_build_object(
        'collected', coalesce(sum(amount) filter (where payment_status = 'completed'), 0),
        'tickets', coalesce(sum(amount) filter (where payment_status = 'completed' and booking_id is not null), 0),
        'memberships', coalesce(sum(amount) filter (where payment_status = 'completed' and membership_id is not null), 0),
        'refunded', coalesce(sum(amount) filter (where payment_status = 'refunded'), 0),
        'failed_payments', count(*) filter (where payment_status = 'failed')
      ) from public.payments),
    'popular_events', coalesce((
      select jsonb_agg(t)
        from (select e.event_id, e.name,
                     sum(b.quantity)::bigint as tickets,
                     sum(b.total_amount) as revenue
                from public.bookings b
                join public.events e on e.event_id = b.event_id
               where b.booking_status = 'confirmed'
               group by e.event_id, e.name
               order by tickets desc, e.name
               limit 5) t), '[]'::jsonb)
  );
end;
$$;

-- 6. Who may call what (each function also checks is_staff() itself).
revoke all on function public.admin_list_users(text, text, text, int, int) from public, anon;
revoke all on function public.admin_get_user(uuid) from public, anon;
revoke all on function public.admin_set_user(uuid, text, text) from public, anon;
revoke all on function public.admin_stats() from public, anon;
grant execute on function public.admin_list_users(text, text, text, int, int) to authenticated;
grant execute on function public.admin_get_user(uuid) to authenticated;
grant execute on function public.admin_set_user(uuid, text, text) to authenticated;
grant execute on function public.admin_stats() to authenticated;