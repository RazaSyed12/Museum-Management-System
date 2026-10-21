-- ============================================================
-- Museum Visitor Experience Platform — Drop collections.price
-- ============================================================
-- Collections are browsed, not bought: bookings, tickets and
-- payments all hang off events, so nothing could ever charge a
-- collection's price. Keeping the column invited staff to fill
-- in a number the system would silently ignore. Anything that
-- costs money is modelled as an event (events.ticket_price).
--
-- Dropping the column also drops its CHECK constraint
-- (collections_price_non_negative, migration 0009).
-- ============================================================

alter table public.collections
  drop column price;
