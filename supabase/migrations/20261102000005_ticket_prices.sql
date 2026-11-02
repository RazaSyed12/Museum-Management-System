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
  if (v_alloc.membership_required or v_alloc.ticket_kind = 'member') and not v_member then
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

  v_unit := case when v_alloc.ticket_kind = 'child' then coalesce(v_event.price_child, v_event.ticket_price) when v_alloc.ticket_kind = 'member' or v_alloc.membership_required then coalesce(v_event.price_member, v_event.ticket_price) else v_event.ticket_price end;
  -- An explicit member price replaces the plan percentage discount.
  if v_alloc.ticket_kind = 'child' or ((v_alloc.ticket_kind = 'member' or v_alloc.membership_required) and v_event.price_member is not null) then v_pct := 0; end if;
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

