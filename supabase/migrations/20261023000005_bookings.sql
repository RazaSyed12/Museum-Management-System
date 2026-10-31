-- ============================================================
-- Bookings: secure, atomic booking, simulated payment and cancellation
-- ============================================================

-- 1. Close the hole: users can no longer insert bookings directly.
drop policy if exists "bookings_insert_own_pending" on public.bookings;

-- 2. Ticket codes like MUS-3F9A1C07BE
create or replace function public.new_ticket_code()
returns text
language sql
as $$
  select 'MUS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
$$;

-- 3. Give a booking's seats back and set its final status.
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

  update public.bookings set booking_status = p_status where booking_id = p_booking_id;
end;
$$;

-- 4. Pending bookings older than 15 minutes lose their seats.
create or replace function public.release_expired_holds()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  for r in
    select booking_id from public.bookings
    where booking_status = 'pending' and booked_at < now() - interval '15 minutes'
    for update skip locked
  loop
    perform public.release_booking(r.booking_id, 'expired');
  end loop;
end;
$$;

-- 5. One booking as JSON: the booking, its event, tickets and payments.
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
         'payments', coalesce((select jsonb_agg(to_jsonb(p) order by p.payment_id) from public.payments p where p.booking_id = b.booking_id), '[]'::jsonb),
         'expires_at', case when b.booking_status = 'pending' then b.booked_at + interval '15 minutes' end
       )
  from public.bookings b
  join public.events e on e.event_id = b.event_id
  where b.booking_id = p_booking_id;
$$;

-- 6. The single place where eligibility and price are decided (used by quote AND create).
create or replace function public.booking_price(p_user uuid, p_allocation_id uuid, p_quantity int, p_lock boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  c_tax_rate constant numeric := 0.10;
  c_fee_rate constant numeric := 0.02;
  c_max_per_booking constant int := 10;
  v_alloc public.ticket_allocations%rowtype;
  v_event public.events%rowtype;
  v_member boolean;
  v_pct numeric := 0;
  v_unit numeric(10,2);
  v_subtotal numeric(10,2);
  v_discount numeric(10,2);
  v_net numeric(10,2);
  v_tax numeric(10,2);
  v_fee numeric(10,2);
  v_available int;
begin
  if p_quantity is null or p_quantity < 1 or p_quantity > c_max_per_booking then
    raise exception 'invalid_quantity';
  end if;

  if p_lock then
    select * into v_alloc from public.ticket_allocations where allocation_id = p_allocation_id for update;
  else
    select * into v_alloc from public.ticket_allocations where allocation_id = p_allocation_id;
  end if;
  if not found then
    raise exception 'allocation_not_found';
  end if;

  select * into v_event from public.events where event_id = v_alloc.event_id;
  if v_event.status <> 'scheduled' or v_event.start_at <= now() then
    raise exception 'event_not_bookable';
  end if;

  v_member := p_user is not null and public.is_active_member(p_user);
  if v_alloc.membership_required and not v_member then
    raise exception 'members_only';
  end if;

  v_available := v_alloc.quantity - v_alloc.reserved_quantity;
  if p_quantity > v_available then
    raise exception 'not_enough_tickets' using detail = greatest(v_available, 0)::text;
  end if;

  if v_member then
    select coalesce(max(
             case when b.benefit_value ~ '^[0-9]+(\.[0-9]+)?$' then least(b.benefit_value::numeric, 100) end
           ), 0)
    into v_pct
    from public.memberships m
    join public.membership_benefits b on b.plan_id = m.plan_id
    where m.user_id = p_user
      and m.status = 'active'
      and (m.ends_at is null or m.ends_at > now())
      and b.benefit_type = 'discount_percent';
  end if;

  v_unit := v_event.ticket_price;
  v_subtotal := round(v_unit * p_quantity, 2);
  v_discount := round(v_subtotal * v_pct / 100, 2);
  v_net := v_subtotal - v_discount;
  v_tax := round(v_net * c_tax_rate, 2);
  v_fee := round(v_net * c_fee_rate, 2);

  return jsonb_build_object(
    'allocation_id', v_alloc.allocation_id,
    'allocation_name', v_alloc.allocation_name,
    'event_id', v_event.event_id,
    'event_name', v_event.name,
    'event_start_at', v_event.start_at,
    'unit_price', v_unit,
    'quantity', p_quantity,
    'subtotal', v_subtotal,
    'discount_percent', v_pct,
    'discount_amount', v_discount,
    'tax_amount', v_tax,
    'service_fee', v_fee,
    'total_amount', v_net + v_tax + v_fee,
    'is_member', v_member,
    'available', v_available,
    'hold_minutes', 15
  );
end;
$$;

-- 7. Quote: the price breakdown, nothing is reserved.
create or replace function public.quote_booking(p_allocation_id uuid, p_quantity int)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;
  if exists (select 1 from public.profiles where id = v_user and account_status <> 'active') then
    raise exception 'account_not_active';
  end if;
  perform public.release_expired_holds();
  return public.booking_price(v_user, p_allocation_id, p_quantity, false);
end;
$$;

-- 8. Create a booking: reserves the seats atomically.
create or replace function public.create_booking(p_allocation_id uuid, p_quantity int)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_q jsonb;
  v_free boolean;
  v_booking public.bookings%rowtype;
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;
  if exists (select 1 from public.profiles where id = v_user and account_status <> 'active') then
    raise exception 'account_not_active';
  end if;

  perform public.release_expired_holds();

  v_q := public.booking_price(v_user, p_allocation_id, p_quantity, true);  -- locks the allocation row
  v_free := (v_q->>'total_amount')::numeric = 0;

  insert into public.bookings
    (user_id, event_id, booking_status, quantity, subtotal, discount_amount, tax_amount, service_fee, total_amount)
  values
    (v_user, (v_q->>'event_id')::uuid, case when v_free then 'confirmed' else 'pending' end, p_quantity,
     (v_q->>'subtotal')::numeric, (v_q->>'discount_amount')::numeric, (v_q->>'tax_amount')::numeric,
     (v_q->>'service_fee')::numeric, (v_q->>'total_amount')::numeric)
  returning * into v_booking;

  update public.ticket_allocations
  set reserved_quantity = reserved_quantity + p_quantity
  where allocation_id = p_allocation_id;

  insert into public.tickets (booking_id, allocation_id, ticket_status, price, ticket_code)
  select v_booking.booking_id, p_allocation_id,
         case when v_free then 'valid' else 'held' end,
         (v_q->>'unit_price')::numeric,
         case when v_free then public.new_ticket_code() end
  from generate_series(1, p_quantity);

  if v_free then
    insert into public.payments (booking_id, provider, payment_status, amount, transaction_reference, paid_at)
    values (v_booking.booking_id, 'simulated', 'completed', 0,
            'FREE-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)), now());
  end if;

  return public.booking_json(v_booking.booking_id);
end;
$$;

-- 9. Simulated payment. Returns {result: paid | failed | expired, booking, payment}.
create or replace function public.pay_booking(p_booking_id uuid, p_fail boolean default false)
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

  -- The hold ran out: release the seats and report it (returned, not raised, so the release is kept).
  if v_b.booked_at < now() - interval '15 minutes' then
    perform public.release_booking(p_booking_id, 'expired');
    return jsonb_build_object('result', 'expired', 'booking', public.booking_json(p_booking_id));
  end if;

  if p_fail then
    insert into public.payments (booking_id, provider, payment_status, amount, transaction_reference)
    values (p_booking_id, 'simulated', 'failed', v_b.total_amount,
            'SIM-FAILED-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)))
    returning * into v_pay;
    return jsonb_build_object('result', 'failed', 'booking', public.booking_json(p_booking_id), 'payment', to_jsonb(v_pay));
  end if;

  insert into public.payments (booking_id, provider, payment_status, amount, transaction_reference, paid_at)
  values (p_booking_id, 'simulated', 'completed', v_b.total_amount,
          'SIM-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)), now())
  returning * into v_pay;

  update public.bookings set booking_status = 'confirmed' where booking_id = p_booking_id;

  update public.tickets
  set ticket_status = 'valid', ticket_code = public.new_ticket_code()
  where booking_id = p_booking_id and ticket_status = 'held';

  return jsonb_build_object('result', 'paid', 'booking', public.booking_json(p_booking_id), 'payment', to_jsonb(v_pay));
end;
$$;

-- 10. Cancel: the owner (or staff). Seats come back; a paid booking is refunded (simulated).
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
  update public.payments set payment_status = 'refunded'
  where booking_id = p_booking_id and payment_status = 'completed';

  return public.booking_json(p_booking_id);
end;
$$;

-- 11. When staff cancel an event, all its bookings are cancelled and refunded (simulated).
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
    update public.payments set payment_status = 'refunded'
    where booking_id = r.booking_id and payment_status = 'completed';
  end loop;
  return new;
end;
$$;

create trigger events_cancel_bookings
  after update of status on public.events
  for each row
  when (new.status = 'cancelled' and old.status is distinct from 'cancelled')
  execute function public.cancel_bookings_of_cancelled_event();

-- 12. Who may call what. Internal helpers cannot be called from outside at all.
revoke all on function public.new_ticket_code() from public, anon, authenticated;
revoke all on function public.release_booking(uuid, text) from public, anon, authenticated;
revoke all on function public.booking_json(uuid) from public, anon, authenticated;
revoke all on function public.booking_price(uuid, uuid, int, boolean) from public, anon, authenticated;
revoke all on function public.cancel_bookings_of_cancelled_event() from public, anon, authenticated;

revoke all on function public.release_expired_holds() from public, anon;
revoke all on function public.quote_booking(uuid, int) from public, anon;
revoke all on function public.create_booking(uuid, int) from public, anon;
revoke all on function public.pay_booking(uuid, boolean) from public, anon;
revoke all on function public.cancel_booking(uuid) from public, anon;
grant execute on function public.release_expired_holds() to authenticated;
grant execute on function public.quote_booking(uuid, int) to authenticated;
grant execute on function public.create_booking(uuid, int) to authenticated;
grant execute on function public.pay_booking(uuid, boolean) to authenticated;
grant execute on function public.cancel_booking(uuid) to authenticated;