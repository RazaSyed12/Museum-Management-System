-- ============================================================
-- BE-11: Dashboard reports and exports
-- ============================================================
-- One dashboard function (admin_dashboard) and five report functions
-- (report_visitors, report_tickets, report_memberships, report_events,
-- report_collections), all staff-readable (View reports: yes for every
-- tier). CSV export is handled in the Express layer by reusing these
-- same functions' rows, then gated to admin/manager only there (Export
-- reports: Admin/Manager yes, Staff no).
--
-- Adelaide date bounds: date_from/date_to are plain calendar dates,
-- inclusive, interpreted as Australia/Adelaide local days. Adelaide's
-- offset isn't fixed (ACST +9:30 / ACDT +10:30 with daylight saving),
-- so bounds are computed with `AT TIME ZONE 'Australia/Adelaide'`,
-- which uses the real tzdata rules for the dates involved, rather than
-- a hardcoded offset that would be wrong for roughly half the year.
--
-- Date basis per report (an explicit decision, since the handoff doc
-- flags this as something to agree rather than assume):
--  - visitors:   attendance.visited_at — when the visit happened.
--  - tickets:    bookings.booked_at — a sales report, dated by purchase.
--  - memberships: memberships.starts_at — when the membership began.
--  - events:     events.start_at — an operational/attendance report,
--    dated by the event itself, NOT by when its bookings were made
--    (the doc explicitly warns against reusing booking-creation time
--    here, since that's a different question from "how did this event
--    do").
--  - collections: no date bounds at all — a current snapshot, same as
--    the doc specifies ("independent of report date bounds").
-- ============================================================

create or replace function public.report_visitors(p_date_from date, p_date_to date, p_group text default 'day')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_start timestamptz;
  v_end timestamptz;
  v_rows jsonb;
  v_total bigint;
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;
  if p_date_from is null or p_date_to is null or p_date_to < p_date_from then
    raise exception 'invalid_date_range';
  end if;
  if p_group not in ('day', 'month', 'year') then
    raise exception 'invalid_group';
  end if;

  v_start := p_date_from::timestamp at time zone 'Australia/Adelaide';
  v_end := (p_date_to + 1)::timestamp at time zone 'Australia/Adelaide';

  select coalesce(jsonb_agg(to_jsonb(t) order by t.bucket), '[]'::jsonb), coalesce(sum(t.visitor_count), 0)
    into v_rows, v_total
  from (
    select (date_trunc(p_group, a.visited_at at time zone 'Australia/Adelaide'))::date as bucket,
           sum(a.quantity)::bigint as visitor_count
      from public.attendance a
     where a.visited_at >= v_start and a.visited_at < v_end
     group by 1
  ) t;

  return jsonb_build_object(
    'kind', 'visitors', 'date_from', p_date_from, 'date_to', p_date_to, 'group_by', p_group,
    'date_basis', 'attendance.visited_at',
    'rows', v_rows, 'total_visitors', v_total
  );
end;
$$;

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
           sum(b.quantity) filter (where b.booking_status in ('pending', 'confirmed'))::bigint as booked_quantity,
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
  from (select status, count(*)::bigint as n from public.memberships group by status) s;

  return jsonb_build_object(
    'kind', 'memberships', 'date_from', p_date_from, 'date_to', p_date_to,
    'date_basis', 'memberships.starts_at',
    'rows', v_rows,
    'current_status_counts', v_status_counts
  );
end;
$$;

create or replace function public.report_events(p_date_from date, p_date_to date)
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

  with event_set as (
    select e.event_id, e.name, e.start_at, e.capacity, e.status
      from public.events e
     where e.start_at >= v_start and e.start_at < v_end
  ),
  booking_agg as (
    select b.event_id,
           sum(b.quantity) filter (where b.booking_status = 'confirmed')::bigint as booked_quantity,
           count(*) filter (where b.booking_status = 'cancelled')::bigint as cancelled_count
      from public.bookings b
     where b.event_id in (select event_id from event_set)
     group by b.event_id
  ),
  attendance_agg as (
    select b.event_id, sum(a.quantity)::bigint as checked_in_quantity
      from public.attendance a
      join public.bookings b on b.booking_id = a.booking_id
     where b.event_id in (select event_id from event_set)
     group by b.event_id
  )
  select coalesce(jsonb_agg(to_jsonb(t) order by t.start_at), '[]'::jsonb)
    into v_rows
  from (
    select es.event_id, es.name as event_name, es.start_at, es.capacity, es.status,
           coalesce(ba.booked_quantity, 0) as booked_quantity,
           coalesce(ba.cancelled_count, 0) as cancelled_count,
           coalesce(aa.checked_in_quantity, 0) as checked_in_quantity
      from event_set es
      left join booking_agg ba on ba.event_id = es.event_id
      left join attendance_agg aa on aa.event_id = es.event_id
  ) t;

  return jsonb_build_object(
    'kind', 'events', 'date_from', p_date_from, 'date_to', p_date_to,
    'date_basis', 'events.start_at (not booking creation time)',
    'rows', v_rows
  );
end;
$$;

create or replace function public.report_collections(p_group text default 'category')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows jsonb;
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;
  if p_group not in ('category', 'period') then
    raise exception 'invalid_group';
  end if;

  if p_group = 'category' then
    select coalesce(jsonb_agg(to_jsonb(t) order by t.label), '[]'::jsonb) into v_rows
    from (
      select c.category_id, coalesce(c.name, 'Uncategorised') as label, count(*)::bigint as digitised_count
        from public.collection_items i
        left join public.categories c on c.category_id = i.category_id
       where i.status = 'active'
       group by c.category_id, c.name
    ) t;
  else
    select coalesce(jsonb_agg(to_jsonb(t) order by t.label), '[]'::jsonb) into v_rows
    from (
      select coalesce(i.historical_period, 'Unspecified') as label, count(*)::bigint as digitised_count
        from public.collection_items i
       where i.status = 'active'
       group by i.historical_period
    ) t;
  end if;

  -- Deliberately not date-bound (a current snapshot), and deliberately
  -- counting collection_items rows, NOT collections.catalogue_total —
  -- the doc is explicit these are two different numbers: this is how many
  -- objects have actually been individually digitised, not the physical
  -- collection size.
  return jsonb_build_object('kind', 'collections', 'group_by', p_group, 'rows', v_rows);
end;
$$;

-- GET /admin/dashboard. "Current/previous" = this Adelaide calendar month
-- vs the one before it — a specific choice, since the doc doesn't name a
-- period length.
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
  v_cur_end := v_cur_start + interval '1 month';
  v_prev_start := v_cur_start - interval '1 month';
  v_prev_end := v_cur_start;

  select coalesce(sum(quantity), 0) into v_visits_current
    from public.attendance where visited_at >= v_cur_start and visited_at < v_cur_end;
  select coalesce(sum(quantity), 0) into v_visits_previous
    from public.attendance where visited_at >= v_prev_start and visited_at < v_prev_end;

  select coalesce(sum(quantity), 0) into v_booked_tickets
    from public.bookings
   where booking_status in ('pending', 'confirmed')
     and booked_at >= v_cur_start and booked_at < v_cur_end;

  select count(*) into v_active_memberships
    from public.memberships
   where status = 'active' and (ends_at is null or ends_at > v_now);

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

revoke all on function public.report_visitors(date, date, text) from public, anon;
revoke all on function public.report_tickets(date, date) from public, anon;
revoke all on function public.report_memberships(date, date) from public, anon;
revoke all on function public.report_events(date, date) from public, anon;
revoke all on function public.report_collections(text) from public, anon;
revoke all on function public.admin_dashboard() from public, anon;
grant execute on function public.report_visitors(date, date, text) to authenticated;
grant execute on function public.report_tickets(date, date) to authenticated;
grant execute on function public.report_memberships(date, date) to authenticated;
grant execute on function public.report_events(date, date) to authenticated;
grant execute on function public.report_collections(text) to authenticated;
grant execute on function public.admin_dashboard() to authenticated;
