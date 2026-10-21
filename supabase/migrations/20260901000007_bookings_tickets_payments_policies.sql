-- ============================================================
-- RLS Policies — Bookings, Tickets & Payments
-- ============================================================
-- The most security-sensitive group so far — real (if simulated)
-- money moves through here.
--
-- bookings: a user CAN create their own booking, but only as
-- status = 'pending' (enforced in the insert's WITH CHECK).
-- They get no UPDATE policy at all, so once created, only staff
-- or the backend's service_role key (after simulated payment
-- succeeds) can move it to 'confirmed'. A user can never
-- self-confirm their own booking.
--
-- tickets and payments have no user_id column — they hang off
-- bookings, so "is this mine" means checking the parent
-- booking's user_id via EXISTS. Users get READ-ONLY access to
-- both. No insert/update policy exists for regular users on
-- either table — if a client could write payment_status
-- directly, anyone could mark their own payment 'completed'
-- and get a free ticket. Ticket and payment rows are only ever
-- created by staff or the backend's trusted service_role path.
-- ============================================================


-- --------------------------------------------------------------
-- bookings
-- --------------------------------------------------------------

create policy "bookings_select_own"
on bookings for select
using (auth.uid() = user_id);

create policy "bookings_insert_own_pending"
on bookings for insert
with check (auth.uid() = user_id and booking_status = 'pending');

create policy "bookings_staff_all"
on bookings for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- tickets (read-only for users, via parent booking)
-- --------------------------------------------------------------

create policy "tickets_select_own"
on tickets for select
using (
  exists (
    select 1 from bookings b
    where b.booking_id = tickets.booking_id
    and b.user_id = auth.uid()
  )
);

create policy "tickets_staff_all"
on tickets for all
using (public.is_staff())
with check (public.is_staff());


-- --------------------------------------------------------------
-- payments (read-only for users, via parent booking)
-- --------------------------------------------------------------

create policy "payments_select_own"
on payments for select
using (
  exists (
    select 1 from bookings b
    where b.booking_id = payments.booking_id
    and b.user_id = auth.uid()
  )
);

create policy "payments_staff_all"
on payments for all
using (public.is_staff())
with check (public.is_staff());
