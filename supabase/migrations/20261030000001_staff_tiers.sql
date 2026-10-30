-- ============================================================
-- BE-01: Staff profile & tier authorization
-- ============================================================
-- Adds an Admin / Manager / Staff permission tier on top of the existing
-- `role` column. `role` stays the general identity classification
-- (registered/member/staff — "is this a staff account at all"); `tier`
-- is the NEW, separate thing that decides WHAT a staff account may do
-- once inside the portal. A staff account with no tier assigned yet has
-- no portal access — this is deliberate (see is_staff(), redefined
-- below): the frontend must never assume a default tier, an admin has
-- to set one explicitly.
--
-- Pre-existing staff accounts (created before tiers existed) are
-- backfilled to 'admin' below, so nobody who already had full staff
-- access loses it the moment this migration runs. Every staff account
-- created from now on starts with tier = null until an admin sets one.
-- ============================================================

create type staff_tier as enum ('admin', 'manager', 'staff');

alter table profiles
  add column tier staff_tier,
  add column phone varchar;

-- A tier only means something for a staff account. Keeping this as a
-- CHECK constraint (not just app-level discipline) means a bug can
-- never leave a registered/member account holding admin rights.
alter table profiles
  add constraint tier_only_for_staff
  check (tier is null or role = 'staff');

comment on column profiles.tier is
  'Admin/Manager/Staff permission level inside the staff portal. Null = role is staff but no tier has been assigned yet, i.e. no portal access.';
comment on column profiles.phone is
  'Contact phone number. Optional for every account; shown on staff profiles.';

-- Preserve current behaviour for accounts that already had staff access
-- before tiers existed, by giving them the top tier.
update profiles set tier = 'admin' where role = 'staff';


-- --------------------------------------------------------------
-- 1. Tier-aware staff checks (used by RLS policies and RPCs).
--    is_staff() already exists (redefined in 20261023000007_admin.sql
--    as role = 'staff' and account_status = 'active'); it now ALSO
--    requires a tier to be assigned, which is exactly "has portal
--    access right now" per BE-01's acceptance criteria.
-- --------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff' and account_status = 'active' and tier is not null
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff' and account_status = 'active' and tier = 'admin'
  );
$$;

create or replace function public.is_admin_or_manager()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff' and account_status = 'active' and tier in ('admin', 'manager')
  );
$$;

revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_admin_or_manager() from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin_or_manager() to authenticated;


-- --------------------------------------------------------------
-- 2. Extend the self-escalation guard: only an admin may change a
--    tier (role/account_status keep their existing is_staff() rule).
--    RLS alone can't enforce this (it governs which rows, not which
--    columns, you may touch within your own row).
-- --------------------------------------------------------------
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if (new.role <> old.role or new.account_status <> old.account_status)
     and not public.is_staff() then
    raise exception 'Only staff can change role or account status';
  end if;

  if new.tier is distinct from old.tier and not public.is_admin() then
    raise exception 'Only an admin can change a staff tier';
  end if;

  return new;
end;
$$;


-- --------------------------------------------------------------
-- 3. GET /staff/me backing function: the caller's own staff profile,
--    including last_sign_in_at (only readable via auth.users, which
--    needs security definer — RLS on profiles already lets someone
--    read their own row, so this adds no new exposure).
-- --------------------------------------------------------------
create or replace function public.staff_me()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb;
begin
  select jsonb_build_object(
           'id', p.id,
           'email', u.email,
           'full_name', p.full_name,
           'phone', p.phone,
           'role', p.role,
           'tier', p.tier,
           'account_status', p.account_status,
           'last_sign_in_at', u.last_sign_in_at,
           'created_at', p.created_at
         )
    into v
    from public.profiles p
    join auth.users u on u.id = p.id
   where p.id = auth.uid();

  if v is null then
    raise exception 'not_found';
  end if;
  return v;
end;
$$;

revoke all on function public.staff_me() from public, anon;
grant execute on function public.staff_me() to authenticated;


-- --------------------------------------------------------------
-- 4. Staff account management (admin.sql) becomes tier-aware and
--    Admin-only, per the portal's permission matrix ("Manage staff
--    accounts and system settings": Admin yes, Manager/Staff no).
--    Also protects the LAST ACTIVE ADMIN from losing that status,
--    whether by role change, deactivation, or tier change.
-- --------------------------------------------------------------
-- admin_list_users and admin_set_user both gain a new `tier` parameter below,
-- which changes their argument-type signature. CREATE OR REPLACE cannot update
-- a function's parameter list in place -- it would silently create a SECOND,
-- additional overload and leave the old, less-restrictive version (checking
-- only is_staff(), not is_admin()) still callable via the REST RPC endpoint.
-- Drop the old signatures explicitly so only the new, tier-aware ones exist.
drop function if exists public.admin_list_users(text, text, text, int, int);
drop function if exists public.admin_set_user(uuid, text, text);

create or replace function public.admin_list_users(
  p_q text default null,
  p_role text default null,
  p_status text default null,
  p_tier text default null,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  id uuid, email text, full_name text, role text, tier text, account_status text,
  created_at timestamptz, last_sign_in_at timestamptz,
  is_member boolean, bookings_count bigint, total bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return query
  select p.id, u.email::text, p.full_name::text, p.role::text, p.tier::text, p.account_status::text,
         p.created_at, u.last_sign_in_at,
         public.is_active_member(p.id),
         (select count(*) from public.bookings b where b.user_id = p.id),
         count(*) over ()
    from public.profiles p
    join auth.users u on u.id = p.id
   where (p_role is null or p.role::text = p_role)
     and (p_status is null or p.account_status::text = p_status)
     and (p_tier is null or p.tier::text = p_tier)
     and (p_q is null or p_q = ''
          or strpos(lower(p.full_name), lower(p_q)) > 0
          or strpos(lower(u.email), lower(p_q)) > 0)
   order by p.created_at desc, p.id
   limit p_limit offset p_offset;
end;
$$;

create or replace function public.admin_get_user(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select jsonb_build_object(
           'id', p.id,
           'email', u.email,
           'full_name', p.full_name,
           'phone', p.phone,
           'role', p.role,
           'tier', p.tier,
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

create or replace function public.admin_set_user(
  p_id uuid,
  p_role text default null,
  p_status text default null,
  p_tier text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_target record;
  v_new_role text;
  v_new_status text;
  v_new_tier text;
  v_remaining_admins int;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  if p_role is null and p_status is null and p_tier is null then
    raise exception 'nothing_to_change';
  end if;
  if p_role is not null and p_role not in ('registered', 'staff') then
    raise exception 'invalid_role';
  end if;
  if p_status is not null and p_status not in ('active', 'suspended') then
    raise exception 'invalid_status';
  end if;
  if p_tier is not null and p_tier not in ('admin', 'manager', 'staff') then
    raise exception 'invalid_tier';
  end if;

  select role::text as role, account_status::text as status, tier::text as tier
    into v_target
    from public.profiles where id = p_id;
  if not found then
    raise exception 'user_not_found';
  end if;

  v_new_role := coalesce(p_role, v_target.role);
  v_new_status := coalesce(p_status, v_target.status);
  v_new_tier := coalesce(p_tier, v_target.tier);
  -- A role change away from staff always clears the tier — the CHECK
  -- constraint requires it, and it stops a demoted account quietly
  -- keeping admin rights if it's ever promoted back without a tier.
  if v_new_role <> 'staff' then
    v_new_tier := null;
  end if;

  -- Staff cannot demote or suspend themselves, or change their own tier.
  -- This also guarantees the last staff/admin account can never remove
  -- itself (the caller is always one of them, since only an admin may
  -- call this function at all).
  if p_id = v_me
     and (v_new_role <> 'staff' or v_new_status <> 'active' or v_new_tier is distinct from v_target.tier) then
    raise exception 'cannot_change_self';
  end if;

  -- Whoever is calling this, never let the LAST active admin stop being
  -- one — whether by role, status, or tier change, and regardless of
  -- who the target is.
  if v_target.role = 'staff' and v_target.status = 'active' and v_target.tier = 'admin'
     and (v_new_role <> 'staff' or v_new_status <> 'active' or v_new_tier <> 'admin') then
    select count(*) into v_remaining_admins
      from public.profiles
     where role = 'staff' and account_status = 'active' and tier = 'admin';
    if v_remaining_admins <= 1 then
      raise exception 'cannot_remove_last_admin';
    end if;
  end if;

  update public.profiles
     set role = v_new_role::user_role,
         account_status = v_new_status::account_status,
         tier = v_new_tier::staff_tier,
         updated_at = now()
   where id = p_id;

  if v_new_status = 'suspended' then
    delete from auth.sessions where user_id = p_id;
    delete from auth.refresh_tokens where user_id::text = p_id::text;
  end if;

  return public.admin_get_user(p_id);
end;
$$;

revoke all on function public.admin_list_users(text, text, text, text, int, int) from public, anon;
revoke all on function public.admin_set_user(uuid, text, text, text) from public, anon;
grant execute on function public.admin_list_users(text, text, text, text, int, int) to authenticated;
grant execute on function public.admin_set_user(uuid, text, text, text) to authenticated;
-- admin_get_user and admin_stats keep their existing grants (signatures unchanged).
