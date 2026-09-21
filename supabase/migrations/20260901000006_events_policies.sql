-- ============================================================
-- RLS Policies — Events
-- (events, event_collections, event_media, ticket_allocations)
-- ============================================================
-- events likely has more status values than collections'
-- simple draft/published (e.g. scheduled, cancelled, completed),
-- since visitors should still see a cancelled event's page
-- (so people who had it saved/booked see the cancellation) —
-- only 'draft' events (still being set up by staff) are hidden
-- from the public. Staff always see everything regardless of status.
--
-- event_collections and event_media inherit visibility from
-- their parent event, same join-table pattern as Collections.
--
-- ticket_allocations: went with the simpler default — public
-- can read allocation rows (including quantity/reserved_quantity)
-- for any event they can already see, rather than hiding the
-- internal capacity split. Revisit this if the team decides
-- visitors should only see "available / sold out" rather than
-- exact numbers.
-- ============================================================


-- --------------------------------------------------------------
-- events
-- --------------------------------------------------------------

create policy "events_select_public"
on events for select
using (status <> 'draft');

create policy "events_staff_all"
on events for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- event_collections (join table — inherits from parent event)
-- --------------------------------------------------------------

create policy "event_collections_select_public"
on event_collections for select
using (
  exists (
    select 1 from events e
    where e.event_id = event_collections.event_id
    and e.status <> 'draft'
  )
);

create policy "event_collections_staff_all"
on event_collections for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- event_media (join table — inherits from parent event)
-- --------------------------------------------------------------

create policy "event_media_select_public"
on event_media for select
using (
  exists (
    select 1 from events e
    where e.event_id = event_media.event_id
    and e.status <> 'draft'
  )
);

create policy "event_media_staff_all"
on event_media for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- ticket_allocations (inherits visibility from parent event)
-- --------------------------------------------------------------

create policy "ticket_allocations_select_public"
on ticket_allocations for select
using (
  exists (
    select 1 from events e
    where e.event_id = ticket_allocations.event_id
    and e.status <> 'draft'
  )
);

create policy "ticket_allocations_staff_all"
on ticket_allocations for all
using (public.is_staff())
with check (public.is_staff());
