-- 1. A payment can belong to a membership instead of a booking.
alter table public.payments alter column booking_id drop not null;
alter table public.payments add column membership_id uuid references public.memberships(membership_id);
alter table public.payments add constraint payments_one_target
  check (num_nonnulls(booking_id, membership_id) = 1);

create policy "payments_select_own_membership"
  on public.payments for select
  using (exists (
    select 1 from public.memberships m
    where m.membership_id = payments.membership_id and m.user_id = auth.uid()
  ));

-- 2. A user has at most one active membership at a time.
create unique index memberships_one_active_per_user
  on public.memberships (user_id) where status = 'active';

-- 3. Members can still read their own plan and its benefits even after staff deactivate the plan.
create policy "membership_plans_select_own"
  on public.membership_plans for select
  using (exists (
    select 1 from public.memberships m
    where m.plan_id = membership_plans.plan_id and m.user_id = auth.uid()
  ));

create policy "membership_benefits_select_own"
  on public.membership_benefits for select
  using (exists (
    select 1 from public.memberships m
    where m.plan_id = membership_benefits.plan_id and m.user_id = auth.uid()
  ));

-- 4. "Is this user a member right now?" for use inside other database functions (bookings).
create or replace function public.is_active_member(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where user_id = p_user_id
      and status = 'active'
      and (ends_at is null or ends_at > now())
  );
$$;
revoke all on function public.is_active_member(uuid) from public, anon, authenticated;

-- 5. The simulated purchase. Runs with elevated rights but only ever for the signed-in user.
create or replace function public.purchase_membership(p_plan_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_plan public.membership_plans%rowtype;
  v_membership public.memberships%rowtype;
  v_payment public.payments%rowtype;
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;

  if exists (select 1 from public.profiles where id = v_user and account_status <> 'active') then
    raise exception 'account_not_active';
  end if;

  select * into v_plan from public.membership_plans where plan_id = p_plan_id and active;
  if not found then
    raise exception 'plan_not_found';
  end if;

  -- Memberships past their end date are marked expired first.
  update public.memberships set status = 'expired'
  where user_id = v_user and status = 'active' and ends_at is not null and ends_at <= now();

  if exists (select 1 from public.memberships where user_id = v_user and status = 'active') then
    raise exception 'already_member';
  end if;

  insert into public.memberships (user_id, plan_id, status, starts_at, ends_at)
  values (v_user, p_plan_id, 'active', now(), now() + make_interval(months => v_plan.duration_months))
  returning * into v_membership;

  insert into public.payments (membership_id, provider, payment_status, amount, transaction_reference, paid_at)
  values (
    v_membership.membership_id, 'simulated', 'completed', v_plan.price,
    'SIM-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)), now()
  )
  returning * into v_payment;

  return jsonb_build_object('membership', to_jsonb(v_membership), 'payment', to_jsonb(v_payment));
end;
$$;
revoke all on function public.purchase_membership(uuid) from public, anon;
grant execute on function public.purchase_membership(uuid) to authenticated;