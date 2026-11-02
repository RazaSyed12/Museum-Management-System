-- Match report totals to live reservation and membership eligibility.
-- Replacing functions preserves their existing staff-only grants.

create or replace function public.report_tickets(p_date_from date, p_date_to date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_start timestamptz;
  v_end timestamptz;
  v_rows jsonb;
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;
  if p_date_from is null or p_date_to is null or p_date_to < p_date_from then
    raise exception 'invalid_date_range';
  end if;

  v_start := p_date_from::timestamp at time zone 'Australia/Adelaide';
  v_end := (p_date_to + 1)::timestamp at time zone 'Australia/Adelaide';

  -- Bookings and payments are aggregated in SEPARATE CTEs, each grouped
  -- before joining. Joining bookings to payments directly first (one row
  -- per payment) and THEN summing booking quantity would double-count a
  -- booking's quantity once per payment attempt it has.
  with booking_agg as (
    select b.event_id,
           sum(b.quantity) filter (where (b.booking_status = 'confirmed' or (b.booking_status = 'pending' and b.booked_at > now() - interval '15 minutes')))::bigint as booked_quantity,
           sum(b.quantity) filter (where b.booking_status = 'cancelled')::bigint as cancelled_quantity
      from public.bookings b
     where b.booked_at >= v_start and b.booked_at < v_end
     group by b.event_id
  ),
  payment_agg as (
    select b.event_id,
           sum(p.amount) filter (where p.payment_status = 'completed') as revenue,
           sum(p.amount) filter (where p.payment_status = 'refunded') as refunded
      from public.bookings b
      join public.payments p on p.booking_id = b.booking_id
     where b.booked_at >= v_start and b.booked_at < v_end
     group by b.event_id
  )
  select coalesce(jsonb_agg(to_jsonb(t) order by t.event_name), '[]'::jsonb)
    into v_rows
  from (
    select e.event_id, e.name as event_name,
           coalesce(ba.booked_quantity, 0) as booked_quantity,
           coalesce(ba.cancelled_quantity, 0) as cancelled_quantity,
           coalesce(pa.revenue, 0) as revenue,
           coalesce(pa.refunded, 0) as refunded
      from public.events e
      join booking_agg ba on ba.event_id = e.event_id
      left join payment_agg pa on pa.event_id = e.event_id
  ) t;

  return jsonb_build_object(
    'kind', 'tickets', 'date_from', p_date_from, 'date_to', p_date_to,
    'date_basis', 'bookings.booked_at',
    'rows', v_rows,
    'totals', (
      select jsonb_build_object(
               'booked_quantity', coalesce(sum((r->>'booked_quantity')::bigint), 0),
               'cancelled_quantity', coalesce(sum((r->>'cancelled_quantity')::bigint), 0),
               'revenue', coalesce(sum((r->>'revenue')::numeric), 0),
               'refunded', coalesce(sum((r->>'refunded')::numeric), 0)
             )
        from jsonb_array_elements(v_rows) r
    )
  );
end;
$$;

create or replace function public.report_memberships(p_date_from date, p_date_to date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_start timestamptz;
  v_end timestamptz;
  v_rows jsonb;
  v_status_counts jsonb;
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;
  if p_date_from is null or p_date_to is null or p_date_to < p_date_from then
    raise exception 'invalid_date_range';
  end if;

  v_start := p_date_from::timestamp at time zone 'Australia/Adelaide';
  v_end := (p_date_to + 1)::timestamp at time zone 'Australia/Adelaide';

  with period_agg as (
    select m.plan_id, count(*)::bigint as joins_count, coalesce(sum(m.purchase_price), 0) as purchase_revenue
      from public.memberships m
     where m.starts_at >= v_start and m.starts_at < v_end
     group by m.plan_id
  )
  select coalesce(jsonb_agg(to_jsonb(t) order by t.plan_name), '[]'::jsonb)
    into v_rows
  from (
    select mp.plan_id, mp.name as plan_name,
           coalesce(pa.joins_count, 0) as joins_count,
           coalesce(pa.purchase_revenue, 0) as purchase_revenue
      from public.membership_plans mp
      left join period_agg pa on pa.plan_id = mp.plan_id
  ) t;

  -- Current status counts are a snapshot (as of now), deliberately NOT
  -- bound to the report's date range — "clearly defined current
  -- active/expired/pending counts" per the doc, distinct from "joins in
  -- the selected period" above.
  select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) into v_status_counts
  from (select case when status = 'active' and ends_at <= now() then 'expired' when status = 'active' and starts_at > now() then 'pending' else status end as status, count(*)::bigint as n from public.memberships group by 1) s;

  return jsonb_build_object(
    'kind', 'memberships', 'date_from', p_date_from, 'date_to', p_date_to,
    'date_basis', 'memberships.starts_at',
    'rows', v_rows,
    'current_status_counts', v_status_counts
  );
end;
$$;

create or replace function public.admin_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_cur_start timestamptz;
  v_cur_end timestamptz;
  v_prev_start timestamptz;
  v_prev_end timestamptz;
  v_visits_current bigint;
  v_visits_previous bigint;
  v_booked_tickets bigint;
  v_active_memberships bigint;
  v_upcoming_events jsonb;
  v_recent_bookings jsonb;
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  v_cur_start := (date_trunc('month', v_now at time zone 'Australia/Adelaide'))::timestamp at time zone 'Australia/Adelaide';
  v_cur_end := (date_trunc('month', v_now at time zone 'Australia/Adelaide') + interval '1 month') at time zone 'Australia/Adelaide';
  v_prev_start := (date_trunc('month', v_now at time zone 'Australia/Adelaide') - interval '1 month') at time zone 'Australia/Adelaide';
  v_prev_end := v_cur_start;

  select coalesce(sum(quantity), 0) into v_visits_current
    from public.attendance where visited_at >= v_cur_start and visited_at < v_cur_end;
  select coalesce(sum(quantity), 0) into v_visits_previous
    from public.attendance where visited_at >= v_prev_start and visited_at < v_prev_end;

  select coalesce(sum(quantity), 0) into v_booked_tickets
    from public.bookings
   where (booking_status = 'confirmed' or (booking_status = 'pending' and booked_at > v_now - interval '15 minutes'))
     and booked_at >= v_cur_start and booked_at < v_cur_end;

  select count(*) into v_active_memberships
    from public.memberships
   where status = 'active' and starts_at <= v_now and (ends_at is null or ends_at > v_now);

  -- Upcoming/ongoing published events, soonest first, each with its own
  -- capacity vs. confirmed-booked count — this is the "event capacity
  -- information" the doc asks the dashboard to carry.
  select coalesce(jsonb_agg(to_jsonb(t) order by t.start_at), '[]'::jsonb) into v_upcoming_events
  from (
    select e.event_id, e.name, e.start_at, e.end_at, e.capacity,
           coalesce((select sum(b.quantity) from public.bookings b
                      where b.event_id = e.event_id and b.booking_status = 'confirmed'), 0) as booked_quantity
      from public.events e
     where e.status = 'scheduled' and e.end_at >= v_now
     order by e.start_at
     limit 10
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.booked_at desc), '[]'::jsonb) into v_recent_bookings
  from (
    select b.booking_id, b.event_id, e.name as event_name, b.booking_status, b.quantity, b.total_amount, b.booked_at
      from public.bookings b
      join public.events e on e.event_id = b.event_id
     order by b.booked_at desc
     limit 10
  ) t;

  return jsonb_build_object(
    'period', jsonb_build_object(
      'current_start', v_cur_start, 'current_end', v_cur_end,
      'previous_start', v_prev_start, 'previous_end', v_prev_end
    ),
    'visits_current_period', v_visits_current,
    'visits_previous_period', v_visits_previous,
    'booked_tickets_current_period', v_booked_tickets,
    'active_memberships', v_active_memberships,
    'upcoming_events', v_upcoming_events,
    'recent_bookings', v_recent_bookings
  );
end;
$$;
