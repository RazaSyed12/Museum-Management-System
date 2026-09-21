-- ============================================================
-- RLS Policies — Membership
-- (membership_plans, membership_benefits, memberships)
-- ============================================================
-- Design decision, flagged for the team:
--
-- membership_plans / membership_benefits are public reference
-- data (like a price list) — visitors should see them even
-- before logging in, so they can decide whether to register
-- and become a member. Staff manage them.
--
-- memberships (a specific user's membership record) is treated
-- as sensitive: a user can READ their own row, but CANNOT
-- insert or update it directly. Even though payment is
-- simulated, allowing a raw client insert would let anyone set
-- their own status to 'active' without going through checkout.
-- Creation/changes happen via staff, or via the backend's
-- service_role key (which bypasses RLS entirely) once a
-- simulated payment succeeds. If the team later wants a fully
-- self-service "become a member" flow with no backend step,
-- this policy is the one to revisit.
-- ============================================================


-- --------------------------------------------------------------
-- membership_plans
-- --------------------------------------------------------------

-- Public (including logged-out visitors) can see active plans
create policy "membership_plans_select_public"
on membership_plans for select
using (active = true);

-- Staff have full access (see all, including inactive; create/edit/delete)
create policy "membership_plans_staff_all"
on membership_plans for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- membership_benefits
-- --------------------------------------------------------------

-- Public can see benefits belonging to an active plan
create policy "membership_benefits_select_public"
on membership_benefits for select
using (
  exists (
    select 1 from membership_plans mp
    where mp.plan_id = membership_benefits.plan_id
    and mp.active = true
  )
);

-- Staff have full access
create policy "membership_benefits_staff_all"
on membership_benefits for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- memberships
-- --------------------------------------------------------------

-- A user can see their own membership record
create policy "memberships_select_own"
on memberships for select
using (auth.uid() = user_id);

-- Staff have full access (see all, create, edit, cancel)
create policy "memberships_staff_all"
on memberships for all
using (public.is_staff())
with check (public.is_staff());

-- Deliberately no insert/update policy for regular users.
-- Membership records are created/changed by staff, or by the
-- backend service role after a (simulated) payment succeeds.
