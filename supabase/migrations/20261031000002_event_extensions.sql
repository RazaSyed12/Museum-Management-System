-- ============================================================
-- BE-04: Event contract extensions
-- ============================================================
-- Four additions, all on events:
--  - event_type: free-text category (exhibition/workshop/lecture/tour/
--    performance/other), validated at the app layer only — same
--    convention as `status` already uses (no DB enum/CHECK on the set
--    of values, so new types don't need a migration).
--  - price_member / price_child: optional prices alongside the existing
--    ticket_price (which is the general-admission price). Null means
--    "not offered" for that tier, not "free" and not "same as general".
--  - cancellation_reason: free text, set when an event is cancelled.
--
-- "Completed" is deliberately NOT a column here — it's a derived,
-- time-based label (scheduled + already ended) computed by the API at
-- read time, per the handoff doc's own guidance against inventing a
-- fourth persisted status.
--
-- Capacity-floor protection (can't shrink capacity below committed
-- allocations) and cancellation cascading to bookings with simulated
-- refunds already exist as DB triggers from earlier migrations
-- (events_capacity_floor, events_cancel_bookings) — nothing to add here.
-- ============================================================

alter table events
  add column event_type varchar,
  add column price_member decimal(10,2),
  add column price_child decimal(10,2),
  add column cancellation_reason text;

alter table events add constraint events_price_member_non_negative
  check (price_member is null or price_member >= 0);
alter table events add constraint events_price_child_non_negative
  check (price_child is null or price_child >= 0);

comment on column events.event_type is
  'Free-text event category (e.g. exhibition, workshop, lecture, tour, performance, other). Validated at the app layer, same convention as status.';
comment on column events.price_member is
  'Optional member ticket price. Null = this tier is not offered for this event (not "same as general", not "free").';
comment on column events.price_child is
  'Optional child ticket price. Null = this tier is not offered for this event.';
comment on column events.cancellation_reason is
  'Free-text reason, set when the event is cancelled. Preserved on repeat cancel calls unless a new reason is explicitly sent.';
