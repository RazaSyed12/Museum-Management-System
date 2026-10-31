-- ============================================================
-- BE-03: Collection contract extensions — catalogue fields
-- ============================================================
-- Two new fields on collections, per the handoff doc:
--  - historical_period: free-text period label for the portal (e.g. "1850s-1900s").
--  - catalogue_total: the collection's full physical object count, INCLUDING
--    objects that have never been individually digitised as collection_items.
--    This is deliberately independent of (and normally >=) the count of
--    collection_items rows — it must never be silently replaced by that count.
-- ============================================================

alter table collections
  add column historical_period varchar,
  add column catalogue_total int;

alter table collections
  add constraint catalogue_total_non_negative
  check (catalogue_total is null or catalogue_total >= 0);

comment on column collections.historical_period is
  'Free-text historical period label for the public/staff portal, e.g. "1850s-1900s". Independent of collection_items.historical_period, which is per-item.';
comment on column collections.catalogue_total is
  'Full physical object count for this collection, including objects never individually digitised. Not derived from collection_items — set explicitly by staff.';
