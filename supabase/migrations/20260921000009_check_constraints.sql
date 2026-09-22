-- ============================================================
-- Museum Visitor Experience Platform — CHECK Constraints
-- ============================================================
-- Adds invariants the database itself enforces, regardless of
-- who is writing a row — the API, a teammate's ad hoc script in
-- the SQL editor, or a seed file. None of these depend on RLS or
-- on application code behaving correctly; they hold even for the
-- service_role key, which bypasses RLS entirely.
--
-- Four groups, in order:
--   1. Non-negative money and quantities
--   2. Time ordering (an end can't precede its start)
--   3. Allocation integrity (can't reserve more than exists)
--   4. Booking arithmetic (the total must actually add up)
--
-- Nothing here touches enums, indexes, RLS policies, or triggers
-- — those are separate, later migrations.
-- ============================================================


-- ============================================================
-- 1. NON-NEGATIVE MONEY & QUANTITIES
-- ============================================================
-- Every one of these is a case where a negative number is not
-- just unlikely, it is meaningless: there is no such thing as a
-- membership plan costing -$10, or an event with -5 seats. Left
-- unconstrained, a stray minus sign from a form field or a typo
-- in a script would be stored without complaint, and the first
-- sign of it would be a wrong total on an invoice or a booking
-- flow that "sells" negative tickets.

alter table membership_plans add constraint membership_plans_price_non_negative
  check (price >= 0);

alter table membership_plans add constraint membership_plans_duration_positive
  check (duration_months > 0);

alter table collections add constraint collections_price_non_negative
  check (price is null or price >= 0);

alter table events add constraint events_ticket_price_non_negative
  check (ticket_price >= 0);

alter table events add constraint events_capacity_non_negative
  check (capacity >= 0);

alter table locations add constraint locations_capacity_non_negative
  check (capacity is null or capacity >= 0);

alter table tickets add constraint tickets_price_non_negative
  check (price >= 0);

alter table payments add constraint payments_amount_non_negative
  check (amount >= 0);

alter table ticket_allocations add constraint ticket_allocations_quantity_non_negative
  check (quantity >= 0);

alter table ticket_allocations add constraint ticket_allocations_reserved_non_negative
  check (reserved_quantity >= 0);

alter table user_preferences add constraint user_preferences_weight_non_negative
  check (preference_weight >= 0);

alter table recommendations add constraint recommendations_score_non_negative
  check (score is null or score >= 0);

-- A booking for zero or fewer tickets isn't a booking.
alter table bookings add constraint bookings_quantity_positive
  check (quantity > 0);


-- ============================================================
-- 2. TIME ORDERING
-- ============================================================
-- An event that ends before it starts, or a membership that
-- expires before it began, is not a data-entry edge case worth
-- shrugging off — it's a value that cannot be interpreted at
-- all, and anything downstream that assumes end > start (a
-- calendar view, a "days remaining" calculation) breaks quietly.

alter table events add constraint events_end_after_start
  check (end_at > start_at);

alter table memberships add constraint memberships_end_after_start
  check (ends_at is null or ends_at > starts_at);


-- ============================================================
-- 3. ALLOCATION INTEGRITY
-- ============================================================
-- This is the constraint that makes overselling a members'
-- ticket block structurally impossible, independent of whatever
-- race conditions or bugs might exist in the booking code that
-- writes to this table. If two concurrent requests both try to
-- push reserved_quantity past quantity, the database itself
-- refuses the second one — the guarantee doesn't depend on the
-- application getting its locking right.

alter table ticket_allocations add constraint ticket_allocations_reserved_within_quantity
  check (reserved_quantity <= quantity);


-- ============================================================
-- 4. BOOKING ARITHMETIC
-- ============================================================
-- The proposal commits to members receiving discounts, but the
-- original schema (migration 0001) gave bookings nowhere to
-- record one — only subtotal, tax_amount, service_fee and
-- total_amount. Without a dedicated column, a discount would
-- have to be faked by shrinking subtotal directly, which
-- destroys the audit trail: a $40 item discounted by $10 and a
-- $30 item with no discount would be stored identically, and
-- there would be no way to answer "how much did we discount this
-- booking by" after the fact.
--
-- discount_amount is added here, as part of this constraint
-- group, because it only exists to make the arithmetic check
-- below meaningful.

alter table bookings add column discount_amount decimal(10,2) not null default 0;

-- Nothing in a booking's dollar figures is allowed to be
-- negative — not even a discount, which conceptually only ever
-- subtracts.
alter table bookings add constraint bookings_amounts_non_negative
  check (
    subtotal >= 0
    and discount_amount >= 0
    and tax_amount >= 0
    and service_fee >= 0
    and total_amount >= 0
  );

-- You cannot discount a booking by more than its own subtotal —
-- that would mean paying a customer to take a ticket.
alter table bookings add constraint bookings_discount_within_subtotal
  check (discount_amount <= subtotal);

-- The equation itself. This is the one that actually catches a
-- bug: if the booking code ever computes total_amount wrong —
-- forgets to add the service fee, applies the discount twice,
-- whatever — this rejects the insert outright instead of quietly
-- storing a total that doesn't reconcile with its own parts.
alter table bookings add constraint bookings_total_is_consistent
  check (total_amount = subtotal - discount_amount + tax_amount + service_fee);