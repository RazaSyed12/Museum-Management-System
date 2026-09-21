-- ============================================================
-- RLS Policies — profiles
-- ============================================================
-- Three things happen here:
-- 1. A helper function to check "is this user staff?" without
--    causing infinite recursion (profiles policies can't query
--    profiles directly to check role — this sidesteps that).
-- 2. Row-level policies: who can SELECT / UPDATE which rows.
-- 3. Two triggers:
--    a) auto-create a profiles row when someone signs up
--       (without this, nothing else in the schema can work,
--       since every user_id FK points at profiles)
--    b) block a non-staff user from changing their own role
--       or account_status via a plain UPDATE — RLS alone only
--       controls which ROWS you can touch, not which COLUMNS
--       you're allowed to change within your own row.
-- ============================================================


-- --------------------------------------------------------------
-- 1. Helper: is the current logged-in user staff?
--    security definer = runs with elevated privileges, so this
--    check itself doesn't get blocked by the RLS it's helping enforce.
-- --------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff'
  );
$$;


-- --------------------------------------------------------------
-- 2. Row-level policies
-- --------------------------------------------------------------

-- Anyone logged in can read their own profile
create policy "profiles_select_own"
on profiles for select
using (auth.uid() = id);

-- Staff can read every profile
create policy "profiles_select_staff"
on profiles for select
using (public.is_staff());

-- Anyone logged in can update their own profile
-- (the trigger below stops them sneaking a role/status change through)
create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Staff can update any profile, including role/account_status
create policy "profiles_update_staff"
on profiles for update
using (public.is_staff())
with check (public.is_staff());

-- Deliberately no INSERT or DELETE policy for regular users.
-- Row creation happens only via the trigger below (trusted path).


-- --------------------------------------------------------------
-- 3a. Auto-create a profiles row on signup
-- --------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();


-- --------------------------------------------------------------
-- 3b. Block self-escalation: only staff can change role/account_status
-- --------------------------------------------------------------
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
as $$
begin
  -- No authenticated end-user context (SQL Editor, service_role,
  -- direct DB access) — trust it, skip the check. A real end-user
  -- request through the app always has a non-null auth.uid(), so
  -- the protection against a visitor self-promoting is unchanged.
  if auth.uid() is null then
    return new;
  end if;

  if (new.role <> old.role or new.account_status <> old.account_status)
     and not public.is_staff() then
    raise exception 'Only staff can change role or account status';
  end if;
  return new;
end;
$$;

create trigger enforce_role_change_permission
before update on profiles
for each row execute function public.prevent_role_self_escalation();
