-- ============================================================
-- BE-12: Search, notifications and lookup strategy
-- ============================================================
-- Two independent things:
--
--  1. staff_search(): a SEPARATE function from the existing public
--     search_catalogue() (used by GET /search), not an extension of it —
--     this one reaches sensitive, staff-only domains (visitors, bookings,
--     memberships, staff accounts) that must never be reachable through
--     the public endpoint. Same scored UNION ALL convention as
--     search_catalogue for consistency. The staff-accounts branch only
--     ever returns rows for an admin caller (is_admin() in its own WHERE
--     clause) — "Enforce permissions before returning results" per the
--     doc, enforced per-domain, not just at the endpoint's front door.
--
--  2. A real notifications table. Deliberately RECIPIENT-SCOPED, not
--     shared/broadcast with shared read-state: every notification row
--     belongs to exactly one staff profile, so "mark as read" never has
--     to decide whose read state it's changing. A system-wide event (an
--     event going cancelled, say) produces one row per relevant staff
--     member at the moment it happens, via notify_admins_and_managers().
--     This trades a little storage duplication for a read-state model
--     with no shared-state ambiguity — the doc explicitly flags
--     per-user-vs-shared as an open decision, and this is the one made.
--
--     Two of the doc's four listed triggers are wired up here, because
--     they're write-time events a database trigger can observe directly:
--       - event_cancelled: extends the cancellation moment already used
--         by events_cancel_bookings (BE-04/BE-06).
--       - event_near_capacity: fires once, the moment an allocation's
--         reserved/quantity ratio crosses 90% — not on every booking
--         after that, which would spam the same notification repeatedly.
--     The other two are NOT wired up, and why:
--       - upcoming membership expiry is inherently time-based ("3 days
--         before X"), not triggered by any write — it needs a scheduled
--         job polling for approaching expiries, which this project has
--         no infrastructure for (same category of gap as BE-08's
--         abandoned-upload cleanup).
--       - "booking changes" is left unspecified by the doc (which
--         changes, notifying whom) — building it would mean guessing a
--         product decision rather than implementing an agreed one.
--     Operational EMAIL delivery of any of this is explicitly out of
--     scope — these are in-portal notifications only, per the doc.
-- ============================================================

create or replace function public.staff_search(p_q text, p_limit int default 5)
returns table (kind text, id uuid, label text, destination text, score int)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  -- Gated once, up front, same convention as every other staff-only
  -- function — not scattered per-branch, which would work (a non-staff
  -- caller would just get empty results from every branch) but reads as
  -- inconsistent next to everything else in this codebase.
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  return query
  with q as (select lower(btrim(p_q)) as t)
  (select * from (
     select 'visitor'::text, v.visitor_id,
            (v.full_name || coalesce(' (' || v.email || ')', ''))::text as label,
            ('/visitors/' || v.visitor_id)::text as destination,
            case when lower(v.full_name) = q.t then 3
                 when strpos(lower(v.full_name), q.t) = 1 then 2
                 when strpos(lower(v.full_name), q.t) > 0 or strpos(lower(coalesce(v.email, '')), q.t) > 0 then 1
                 else 0 end as score
       from public.visitors v cross join q
      where length(q.t) >= 2
        and (strpos(lower(v.full_name), q.t) > 0 or strpos(lower(coalesce(v.email, '')), q.t) > 0)
   ) s order by s.score desc, s.label limit p_limit)
  union all
  (select * from (
     select 'event'::text, e.event_id, e.name::text as label,
            ('/events/' || e.event_id)::text as destination,
            case when lower(e.name) = q.t then 3
                 when strpos(lower(e.name), q.t) = 1 then 2
                 when strpos(lower(e.name), q.t) > 0 then 1 else 0 end as score
       from public.events e cross join q
      where length(q.t) >= 2 and strpos(lower(e.name), q.t) > 0
   ) s order by s.score desc, s.label limit p_limit)
  union all
  (select * from (
     select 'booking'::text, b.booking_id,
            ('Booking for ' || e.name)::text as label,
            ('/bookings/' || b.booking_id)::text as destination,
            1 as score
       from public.bookings b
       join public.events e on e.event_id = b.event_id
       cross join q
      where length(q.t) >= 2
        and (strpos(lower(e.name), q.t) > 0
             or exists (select 1 from public.tickets t where t.booking_id = b.booking_id and strpos(lower(coalesce(t.ticket_code, '')), q.t) > 0))
   ) s order by s.label limit p_limit)
  union all
  (select * from (
     select 'membership'::text, m.membership_id,
            (coalesce(v.full_name, p.full_name, 'Unknown') || ' — ' || mp.name)::text as label,
            ('/staff/memberships/' || m.membership_id)::text as destination,
            1 as score
       from public.memberships m
       join public.membership_plans mp on mp.plan_id = m.plan_id
       left join public.visitors v on v.visitor_id = m.visitor_id
       left join public.profiles p on p.id = m.user_id
       cross join q
      where length(q.t) >= 2
        and (strpos(lower(coalesce(v.full_name, '')), q.t) > 0 or strpos(lower(coalesce(p.full_name, '')), q.t) > 0)
   ) s order by s.label limit p_limit)
  union all
  (select * from (
     select 'collection'::text, c.collection_id, c.name::text as label,
            ('/collections/' || c.collection_id)::text as destination,
            case when lower(c.name) = q.t then 3
                 when strpos(lower(c.name), q.t) = 1 then 2
                 when strpos(lower(c.name), q.t) > 0 then 1 else 0 end as score
       from public.collections c cross join q
      where length(q.t) >= 2 and strpos(lower(c.name), q.t) > 0
   ) s order by s.score desc, s.label limit p_limit)
  union all
  (select * from (
     select 'item'::text, ci.item_id, ci.name::text as label,
            ('/items/' || ci.item_id)::text as destination,
            case when lower(ci.name) = q.t then 3
                 when strpos(lower(ci.name), q.t) = 1 then 2
                 when strpos(lower(ci.name), q.t) > 0 then 1 else 0 end as score
       from public.collection_items ci cross join q
      where length(q.t) >= 2 and strpos(lower(ci.name), q.t) > 0
   ) s order by s.score desc, s.label limit p_limit)
  union all
  (select * from (
     select 'staff_user'::text, p.id,
            (p.full_name || ' (' || u.email || ')')::text as label,
            ('/admin/users/' || p.id)::text as destination,
            case when lower(p.full_name) = q.t then 3
                 when strpos(lower(p.full_name), q.t) = 1 then 2
                 when strpos(lower(p.full_name), q.t) > 0 or strpos(lower(u.email), q.t) > 0 then 1
                 else 0 end as score
       from public.profiles p
       join auth.users u on u.id = p.id
       cross join q
      -- The one branch with its own, stricter gate on top of the function-
      -- wide is_staff() check above: only an admin caller ever sees these
      -- rows at all, matching "staff users for Admin only" in the doc.
      where public.is_admin() and p.role = 'staff' and length(q.t) >= 2
        and (strpos(lower(p.full_name), q.t) > 0 or strpos(lower(u.email), q.t) > 0)
   ) s order by s.score desc, s.label limit p_limit);
end;
$$;

revoke all on function public.staff_search(text, int) from public, anon;
grant execute on function public.staff_search(text, int) to authenticated;


-- --------------------------------------------------------------
-- notifications
-- --------------------------------------------------------------

create table notifications (
  notification_id   uuid primary key default gen_random_uuid(),
  recipient_id      uuid references profiles(id) not null,
  type              varchar not null,
  message           text not null,
  resource_kind     varchar,
  resource_id       uuid,
  read_at           timestamptz,
  created_at        timestamptz not null default now()
);

create index notifications_recipient_unread_idx
  on notifications (recipient_id, created_at desc)
  where read_at is null;

comment on column notifications.type is
  'event_cancelled or event_near_capacity so far (see this migration''s header for what is and is not wired up).';
comment on column notifications.resource_kind is
  'What resource_id refers to, e.g. event. Lets the frontend link straight to it.';

alter table notifications enable row level security;

-- Every notification belongs to exactly one recipient — no shared/broadcast
-- rows, so there is no shared read-state to reason about.
create policy "notifications_select_own"
on notifications for select
using (auth.uid() = recipient_id);

create policy "notifications_update_own"
on notifications for update
using (auth.uid() = recipient_id)
with check (auth.uid() = recipient_id);

-- Deliberately no insert policy for regular clients: notifications are
-- only ever created by the trigger functions below (as the table owner,
-- bypassing RLS) or the service role.

-- Marks one notification read. Idempotent: reading twice is harmless.
create or replace function public.mark_notification_read(p_notification_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.notifications%rowtype;
begin
  select * into v_row from public.notifications
   where notification_id = p_notification_id and recipient_id = auth.uid()
   for update;
  if not found then
    raise exception 'notification_not_found';
  end if;

  if v_row.read_at is null then
    update public.notifications set read_at = now() where notification_id = p_notification_id
      returning * into v_row;
  end if;

  return to_jsonb(v_row);
end;
$$;

revoke all on function public.mark_notification_read(uuid) from public, anon;
grant execute on function public.mark_notification_read(uuid) to authenticated;


-- --------------------------------------------------------------
-- Generator + the two triggers that use it
-- --------------------------------------------------------------

create or replace function public.notify_admins_and_managers(
  p_type text, p_message text, p_resource_kind text, p_resource_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, type, message, resource_kind, resource_id)
  select id, p_type, p_message, p_resource_kind, p_resource_id
    from public.profiles
   where role = 'staff' and account_status = 'active' and tier in ('admin', 'manager');
end;
$$;

revoke all on function public.notify_admins_and_managers(text, text, text, uuid) from public, anon, authenticated;

create or replace function public.notify_event_cancelled()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_admins_and_managers(
    'event_cancelled', 'Event "' || new.name || '" was cancelled.', 'event', new.event_id
  );
  return new;
end;
$$;

create trigger events_notify_cancelled
  after update of status on public.events
  for each row
  when (new.status = 'cancelled' and old.status is distinct from 'cancelled')
  execute function public.notify_event_cancelled();

-- Fires once per crossing, not once per booking after the fact: compares
-- the ratio BEFORE this update to the ratio AFTER it, so only the booking
-- that actually tips an allocation over 90% generates a notification.
create or replace function public.notify_allocation_near_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_name text;
  v_old_ratio numeric;
  v_new_ratio numeric;
begin
  if new.quantity <= 0 then
    return new;
  end if;
  v_old_ratio := coalesce(old.reserved_quantity, 0)::numeric / new.quantity;
  v_new_ratio := new.reserved_quantity::numeric / new.quantity;

  if v_new_ratio >= 0.9 and v_old_ratio < 0.9 then
    select name into v_event_name from public.events where event_id = new.event_id;
    perform public.notify_admins_and_managers(
      'event_near_capacity',
      '"' || new.allocation_name || '" for ' || coalesce(v_event_name, 'an event')
        || ' is ' || round(v_new_ratio * 100) || '% booked.',
      'event', new.event_id
    );
  end if;
  return new;
end;
$$;

create trigger ticket_allocations_notify_near_capacity
  after update of reserved_quantity on public.ticket_allocations
  for each row
  execute function public.notify_allocation_near_capacity();
