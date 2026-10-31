-- ============================================================
-- Payment provider layer: two-step payments for bookings AND memberships,
-- safe settlement, refunds. Real providers (e.g. PayPal) settle through the server only.
-- ============================================================

-- 1. More detail on a payment; one reference per provider; the allowed status words.
alter table public.payments
  add column if not exists currency varchar(3) not null default 'AUD',
  add column if not exists method varchar,
  add column if not exists failure_code varchar,
  add column if not exists failure_message text,
  add column if not exists provider_data jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists refunded_at timestamptz;

create unique index if not exists payments_provider_reference_unique
  on public.payments (provider, transaction_reference)
  where transaction_reference is not null;

alter table public.payments
  add constraint payments_status_check
  check (payment_status in ('pending', 'completed', 'failed', 'refund_pending', 'refunded')) not valid;

-- At most one unpaid membership purchase per user.
create unique index if not exists memberships_one_pending_per_user
  on public.memberships (user_id) where status = 'pending';

-- 2. Production switch. In production run once:
--      alter database postgres set app.simulated_payments = 'off';
create or replace function public.simulated_payments_enabled()
returns boolean
language sql
stable
as $$
  select coalesce(nullif(current_setting('app.simulated_payments', true), ''), 'on') <> 'off';
$$;

-- 3. Who may settle a payment: our server (service role), or the owner of a SIMULATED payment.
create or replace function public.payment_caller_allowed(p_payment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.role(), '') = 'service_role'
      or exists (
        select 1
          from public.payments p
          left join public.bookings b on b.booking_id = p.booking_id
          left join public.memberships m on m.membership_id = p.membership_id
         where p.payment_id = p_payment_id
           and p.provider = 'simulated'
           and public.simulated_payments_enabled()
           and coalesce(b.user_id, m.user_id) = auth.uid());
$$;

-- 4. A booking as JSON. Payments no longer carry the provider's private data.
create or replace function public.booking_json(p_booking_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select to_jsonb(b)
    || jsonb_build_object(
         'event', jsonb_build_object('event_id', e.event_id, 'name', e.name, 'start_at', e.start_at, 'end_at', e.end_at),
         'tickets', coalesce((select jsonb_agg(to_jsonb(t) order by t.ticket_id) from public.tickets t where t.booking_id = b.booking_id), '[]'::jsonb),
         'payments', coalesce((select jsonb_agg(to_jsonb(p) - 'provider_data' order by p.created_at, p.payment_id) from public.payments p where p.booking_id = b.booking_id), '[]'::jsonb),
         'expires_at', case when b.booking_status = 'pending' then b.booked_at + interval '15 minutes' end
       )
  from public.bookings b
  join public.events e on e.event_id = b.event_id
  where b.booking_id = p_booking_id;
$$;

-- 5. A membership as JSON (with its plan and, while unpaid, when the purchase window ends).
create or replace function public.membership_json(p_membership_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select to_jsonb(m)
    || jsonb_build_object(
         'plan', jsonb_build_object('plan_id', p.plan_id, 'name', p.name, 'price', p.price, 'duration_months', p.duration_months),
         'expires_at', case when m.status = 'pending' then m.starts_at + interval '15 minutes' end
       )
  from public.memberships m
  join public.membership_plans p on p.plan_id = m.plan_id
  where m.membership_id = p_membership_id;
$$;

-- 6. "The booking or the membership this payment belongs to", as JSON.
create or replace function public.payment_target_json(p_booking_id uuid, p_membership_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select case
    when p_booking_id is not null then jsonb_build_object('booking', public.booking_json(p_booking_id))
    else jsonb_build_object('membership', public.membership_json(p_membership_id))
  end;
$$;

-- 7. Giving a booking's seats back now also closes its open payment attempts.
create or replace function public.release_booking(p_booking_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  for r in
    select allocation_id, count(*)::int as n
    from public.tickets
    where booking_id = p_booking_id and ticket_status in ('held', 'valid')
    group by allocation_id
  loop
    update public.ticket_allocations
    set reserved_quantity = greatest(reserved_quantity - r.n, 0)
    where allocation_id = r.allocation_id;
  end loop;

  update public.tickets set ticket_status = 'cancelled'
  where booking_id = p_booking_id and ticket_status in ('held', 'valid');

  update public.payments
     set payment_status = 'failed',
         failure_code = 'booking_closed',
         failure_message = 'The booking was cancelled or expired.',
         updated_at = now()
   where booking_id = p_booking_id and payment_status = 'pending';

  update public.bookings set booking_status = p_status where booking_id = p_booking_id;
end;
$$;

-- 8. Refund a booking's completed payments: instant for the simulation,
--    "refund_pending" for a real provider (our server asks the provider, then confirms).
create or replace function public.refund_booking_payments(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.payments
     set payment_status = case when provider = 'simulated' then 'refunded' else 'refund_pending' end,
         refunded_at = case when provider = 'simulated' then now() else refunded_at end,
         updated_at = now()
   where booking_id = p_booking_id and payment_status = 'completed';
end;
$$;

create or replace function public.cancel_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_staff boolean;
  v_b public.bookings%rowtype;
  v_start timestamptz;
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;
  v_staff := public.is_staff();

  select * into v_b from public.bookings
  where booking_id = p_booking_id and (user_id = v_user or v_staff) for update;
  if not found then
    raise exception 'booking_not_found';
  end if;

  if v_b.booking_status in ('cancelled', 'expired') then
    return public.booking_json(p_booking_id);
  end if;

  if v_b.booking_status = 'confirmed' and not v_staff then
    select start_at into v_start from public.events where event_id = v_b.event_id;
    if v_start <= now() then
      raise exception 'cannot_cancel';
    end if;
  end if;

  perform public.release_booking(p_booking_id, 'cancelled');
  perform public.refund_booking_payments(p_booking_id);

  return public.booking_json(p_booking_id);
end;
$$;

create or replace function public.cancel_bookings_of_cancelled_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  for r in
    select booking_id from public.bookings
    where event_id = new.event_id and booking_status in ('pending', 'confirmed')
  loop
    perform public.release_booking(r.booking_id, 'cancelled');
    perform public.refund_booking_payments(r.booking_id);
  end loop;
  return new;
end;
$$;

-- 9. Booking step one: start a payment attempt for the caller's own pending booking.
--    Safe to repeat: an open attempt with the same provider is returned again.
create or replace function public.payment_begin(p_booking_id uuid, p_provider text, p_method text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_b public.bookings%rowtype;
  v_pay public.payments%rowtype;
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;
  if exists (select 1 from public.profiles where id = v_user and account_status <> 'active') then
    raise exception 'account_not_active';
  end if;
  if p_provider is null or btrim(p_provider) = '' then
    raise exception 'invalid_provider';
  end if;
  if p_provider = 'simulated' and not public.simulated_payments_enabled() then
    raise exception 'simulation_disabled';
  end if;

  select * into v_b from public.bookings where booking_id = p_booking_id and user_id = v_user for update;
  if not found then
    raise exception 'booking_not_found';
  end if;
  if v_b.booking_status = 'confirmed' then
    raise exception 'already_paid';
  end if;
  if v_b.booking_status <> 'pending' then
    raise exception 'booking_closed';
  end if;

  if v_b.booked_at < now() - interval '15 minutes' then
    perform public.release_booking(p_booking_id, 'expired');
    return jsonb_build_object('result', 'expired', 'booking', public.booking_json(p_booking_id));
  end if;

  select * into v_pay from public.payments
   where booking_id = p_booking_id and payment_status = 'pending' and provider = p_provider
   order by created_at desc limit 1;
  if not found then
    insert into public.payments (booking_id, provider, payment_status, amount, method)
    values (p_booking_id, p_provider, 'pending', v_b.total_amount, p_method)
    returning * into v_pay;
  end if;

  return jsonb_build_object('result', 'started', 'payment', to_jsonb(v_pay));
end;
$$;

-- 10. Membership step one: start buying a plan. Safe to repeat: the open attempt is reused.
create or replace function public.membership_begin(p_plan_id uuid, p_provider text, p_method text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_plan public.membership_plans%rowtype;
  v_m public.memberships%rowtype;
  v_old public.memberships%rowtype;
  v_pay public.payments%rowtype;
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;
  if exists (select 1 from public.profiles where id = v_user and account_status <> 'active') then
    raise exception 'account_not_active';
  end if;
  if p_provider is null or btrim(p_provider) = '' then
    raise exception 'invalid_provider';
  end if;
  if p_provider = 'simulated' and not public.simulated_payments_enabled() then
    raise exception 'simulation_disabled';
  end if;

  select * into v_plan from public.membership_plans where plan_id = p_plan_id and active;
  if not found then
    raise exception 'plan_not_found';
  end if;

  -- one purchase at a time per user
  perform pg_advisory_xact_lock(hashtext('membership:' || v_user::text));

  update public.memberships set status = 'expired'
   where user_id = v_user and status = 'active' and ends_at is not null and ends_at <= now();

  if exists (select 1 from public.memberships where user_id = v_user and status = 'active') then
    raise exception 'already_member';
  end if;

  -- close an old unpaid purchase if it timed out or is for another plan
  for v_old in
    select * from public.memberships
     where user_id = v_user and status = 'pending'
       and (starts_at < now() - interval '15 minutes' or plan_id <> p_plan_id)
     for update
  loop
    update public.memberships set status = 'cancelled' where membership_id = v_old.membership_id;
    update public.payments
       set payment_status = 'failed',
           failure_code = 'membership_closed',
           failure_message = 'The membership purchase was cancelled or expired.',
           updated_at = now()
     where membership_id = v_old.membership_id and payment_status = 'pending';
  end loop;

  select * into v_m from public.memberships where user_id = v_user and status = 'pending';
  if not found then
    if v_plan.price = 0 then
      insert into public.memberships (user_id, plan_id, status, starts_at, ends_at)
      values (v_user, p_plan_id, 'active', now(), now() + make_interval(months => v_plan.duration_months))
      returning * into v_m;
      insert into public.payments (membership_id, provider, payment_status, amount, transaction_reference, paid_at)
      values (v_m.membership_id, p_provider, 'completed', 0,
              'FREE-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)), now())
      returning * into v_pay;
      return jsonb_build_object('result', 'free',
                                'membership', public.membership_json(v_m.membership_id),
                                'payment', to_jsonb(v_pay) - 'provider_data');
    end if;

    insert into public.memberships (user_id, plan_id, status, starts_at, ends_at)
    values (v_user, p_plan_id, 'pending', now(), null)
    returning * into v_m;
  end if;

  select * into v_pay from public.payments
   where membership_id = v_m.membership_id and payment_status = 'pending' and provider = p_provider
   order by created_at desc limit 1;
  if not found then
    insert into public.payments (membership_id, provider, payment_status, amount, method)
    values (v_m.membership_id, p_provider, 'pending', v_plan.price, p_method)
    returning * into v_pay;
  end if;

  return jsonb_build_object('result', 'started',
                            'membership', public.membership_json(v_m.membership_id),
                            'payment', to_jsonb(v_pay));
end;
$$;

-- 11. Step two: store the provider's reference and next-step details on the pending payment.
create or replace function public.payment_attach(p_payment_id uuid, p_reference text, p_data jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pay public.payments%rowtype;
begin
  select * into v_pay from public.payments where payment_id = p_payment_id;
  if not found then
    raise exception 'payment_not_found';
  end if;
  if not public.payment_caller_allowed(p_payment_id) then
    raise exception 'forbidden';
  end if;

  select * into v_pay from public.payments where payment_id = p_payment_id for update;
  if v_pay.payment_status <> 'pending' then
    raise exception 'payment_closed';
  end if;

  update public.payments
     set transaction_reference = p_reference,
         provider_data = provider_data || coalesce(p_data, '{}'::jsonb),
         updated_at = now()
   where payment_id = p_payment_id
   returning * into v_pay;

  return to_jsonb(v_pay);
end;
$$;

-- 12. Step three: settle a payment with the provider's answer ('completed' or 'failed').
--     Works for bookings and memberships. Repeating it changes nothing. If the money arrives but
--     the booking/membership can no longer be honoured, the payment goes to refunded / refund_pending.
create or replace function public.payment_settle(
  p_payment_id uuid,
  p_outcome text,
  p_reference text default null,
  p_failure_code text default null,
  p_failure_message text default null,
  p_data jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking_id uuid;
  v_membership_id uuid;
  v_owner uuid;
  v_b public.bookings%rowtype;
  v_m public.memberships%rowtype;
  v_plan public.membership_plans%rowtype;
  v_pay public.payments%rowtype;
  v_ok boolean;
begin
  if p_outcome not in ('completed', 'failed') then
    raise exception 'invalid_outcome';
  end if;

  select booking_id, membership_id into v_booking_id, v_membership_id
    from public.payments where payment_id = p_payment_id;
  if not found then
    raise exception 'payment_not_found';
  end if;

  if not public.payment_caller_allowed(p_payment_id) then
    select coalesce(
             (select user_id from public.bookings where booking_id = v_booking_id),
             (select user_id from public.memberships where membership_id = v_membership_id)
           ) into v_owner;
    if v_owner is not null and v_owner = auth.uid() then
      raise exception 'forbidden';
    end if;
    raise exception 'payment_not_found';
  end if;

  -- the booking or membership first, then the payment (same order everywhere, so no deadlocks)
  if v_booking_id is not null then
    select * into v_b from public.bookings where booking_id = v_booking_id for update;
  else
    select * into v_m from public.memberships where membership_id = v_membership_id for update;
  end if;
  select * into v_pay from public.payments where payment_id = p_payment_id for update;

  -- already settled: report it, change nothing (a repeated provider callback lands here)
  if v_pay.payment_status in ('completed', 'refund_pending', 'refunded')
     or (v_pay.payment_status = 'failed'
         and not (v_pay.failure_code in ('booking_closed', 'membership_closed') and p_outcome = 'completed')) then
    return jsonb_build_object('result', 'already_settled', 'payment', to_jsonb(v_pay) - 'provider_data')
           || public.payment_target_json(v_booking_id, v_membership_id);
  end if;

  if p_outcome = 'failed' then
    update public.payments
       set payment_status = 'failed',
           failure_code = coalesce(p_failure_code, 'payment_failed'),
           failure_message = p_failure_message,
           transaction_reference = coalesce(p_reference, transaction_reference),
           provider_data = provider_data || coalesce(p_data, '{}'::jsonb),
           updated_at = now()
     where payment_id = p_payment_id
     returning * into v_pay;
    return jsonb_build_object('result', 'failed', 'payment', to_jsonb(v_pay) - 'provider_data')
           || public.payment_target_json(v_booking_id, v_membership_id);
  end if;

  -- completed: can the booking / membership still be honoured?
  if v_booking_id is not null then
    v_ok := v_b.booking_status = 'pending' and v_b.booked_at >= now() - interval '15 minutes';
  else
    v_ok := v_m.status = 'pending'
        and v_m.starts_at >= now() - interval '15 minutes'
        and not exists (select 1 from public.memberships x
                         where x.user_id = v_m.user_id and x.status = 'active'
                           and (x.ends_at is null or x.ends_at > now()));
  end if;

  if v_ok then
    update public.payments
       set payment_status = 'completed',
           paid_at = now(),
           failure_code = null,
           failure_message = null,
           transaction_reference = coalesce(p_reference, transaction_reference),
           provider_data = provider_data || coalesce(p_data, '{}'::jsonb),
           updated_at = now()
     where payment_id = p_payment_id
     returning * into v_pay;

    if v_booking_id is not null then
      update public.bookings set booking_status = 'confirmed' where booking_id = v_booking_id;
      update public.tickets
         set ticket_status = 'valid', ticket_code = public.new_ticket_code()
       where booking_id = v_booking_id and ticket_status = 'held';
    else
      select * into v_plan from public.membership_plans where plan_id = v_m.plan_id;
      update public.memberships
         set status = 'active',
             starts_at = now(),
             ends_at = now() + make_interval(months => v_plan.duration_months)
       where membership_id = v_membership_id;
    end if;

    return jsonb_build_object('result', 'paid', 'payment', to_jsonb(v_pay) - 'provider_data')
           || public.payment_target_json(v_booking_id, v_membership_id);
  end if;

  -- completed, but it can no longer be honoured: give the money back
  if v_booking_id is not null then
    if v_b.booking_status = 'pending' then
      perform public.release_booking(v_booking_id, 'expired');
    end if;
  elsif v_m.status = 'pending' then
    update public.memberships set status = 'cancelled' where membership_id = v_membership_id;
  end if;

  update public.payments
     set payment_status = case when provider = 'simulated' then 'refunded' else 'refund_pending' end,
         refunded_at = case when provider = 'simulated' then now() else null end,
         paid_at = now(),
         failure_code = case when v_booking_id is not null then 'booking_closed' else 'membership_closed' end,
         failure_message = 'The purchase was no longer open when the payment arrived, so the payment is being refunded.',
         transaction_reference = coalesce(p_reference, transaction_reference),
         provider_data = provider_data || coalesce(p_data, '{}'::jsonb),
         updated_at = now()
   where payment_id = p_payment_id
   returning * into v_pay;

  return jsonb_build_object('result', 'refunded_booking_closed', 'payment', to_jsonb(v_pay) - 'provider_data')
         || public.payment_target_json(v_booking_id, v_membership_id);
end;
$$;

-- 13. After the provider has really refunded a payment (our server only).
create or replace function public.payment_refund_done(p_payment_id uuid, p_reference text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pay public.payments%rowtype;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'forbidden';
  end if;

  update public.payments
     set payment_status = 'refunded',
         refunded_at = now(),
         provider_data = provider_data || jsonb_build_object('refund_reference', p_reference),
         updated_at = now()
   where payment_id = p_payment_id and payment_status = 'refund_pending'
   returning * into v_pay;
  if not found then
    raise exception 'payment_not_found';
  end if;
  return to_jsonb(v_pay) - 'provider_data';
end;
$$;

-- 14. The caller's own payments (bookings and memberships), newest first.
create or replace function public.my_payments(p_limit int default 20, p_offset int default 0)
returns jsonb
language sql
stable
set search_path = public
as $$
  with mine as (
    select p.*, e.name as event_name
      from public.payments p
      left join public.bookings b on b.booking_id = p.booking_id
      left join public.events e on e.event_id = b.event_id
      left join public.memberships m on m.membership_id = p.membership_id
     where b.user_id = auth.uid() or m.user_id = auth.uid()
  )
  select jsonb_build_object(
    'total', (select count(*) from mine),
    'payments', coalesce((
      select jsonb_agg(to_jsonb(x) - 'provider_data' order by x.created_at desc, x.payment_id)
        from (select * from mine order by created_at desc, payment_id limit p_limit offset p_offset) x
    ), '[]'::jsonb));
$$;

-- 15. The old one-step functions are gone: they let a user confirm their own booking / membership directly.
drop function if exists public.pay_booking(uuid, boolean);
drop function if exists public.purchase_membership(uuid);

-- 16. Who may call what.
revoke all on function public.payment_caller_allowed(uuid) from public, anon, authenticated;
revoke all on function public.refund_booking_payments(uuid) from public, anon, authenticated;
revoke all on function public.membership_json(uuid) from public, anon, authenticated;
revoke all on function public.payment_target_json(uuid, uuid) from public, anon, authenticated;
revoke all on function public.payment_begin(uuid, text, text) from public, anon;
revoke all on function public.membership_begin(uuid, text, text) from public, anon;
revoke all on function public.payment_attach(uuid, text, jsonb) from public, anon;
revoke all on function public.payment_settle(uuid, text, text, text, text, jsonb) from public, anon;
revoke all on function public.payment_refund_done(uuid, text) from public, anon, authenticated;
revoke all on function public.my_payments(int, int) from public, anon;
grant execute on function public.payment_begin(uuid, text, text) to authenticated;
grant execute on function public.membership_begin(uuid, text, text) to authenticated;
grant execute on function public.payment_attach(uuid, text, jsonb) to authenticated, service_role;
grant execute on function public.payment_settle(uuid, text, text, text, text, jsonb) to authenticated, service_role;
grant execute on function public.payment_refund_done(uuid, text) to service_role;
grant execute on function public.my_payments(int, int) to authenticated;