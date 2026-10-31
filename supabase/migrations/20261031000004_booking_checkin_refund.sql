-- ============================================================
-- BE-06: Bookings and ticket operations — check-in and staff refund
-- ============================================================
-- Deliberately NOT included: staff creating a booking on behalf of a
-- walk-in visitor. The handoff doc's own priority note says BE-06 comes
-- "after identity, visitors..." (BE-07) — there is still no visitor
-- entity to attach such a booking to (every booking requires a real
-- profiles row). That piece belongs with BE-07, not bolted on here.
--
-- Everything below works for existing (self-service) bookings:
--  - checked_in_at: one timestamp per booking (not per ticket — the
--    staff screen this is for shows one check-in time per booking, and
--    "Current staff bookings have one ticket type each" per the doc).
--  - check_in_booking(): idempotent (repeat calls don't duplicate
--    attendance), only works on a confirmed booking.
--  - cancel_booking() gains one more guard: a checked-in booking can no
--    longer be cancelled by anyone, staff included — the visit already
--    happened.
--  - staff_refund_booking(): admin/manager tier only, and deliberately
--    separate from cancel_booking — the doc is explicit that cancelling
--    a paid booking and refunding it are separate actions. Refunding
--    does not cancel the booking; staff can still cancel separately.
-- ============================================================

alter table bookings add column checked_in_at timestamptz;

comment on column bookings.checked_in_at is
  'When staff checked this booking in at the door. Null = not checked in yet. Once set, the booking can no longer be cancelled.';

-- Re-defined (not just extended) to add the checked-in guard at the top,
-- ahead of the existing staff-bypass logic — so staff cannot cancel a
-- checked-in booking either, unlike the existing rule that only stops a
-- non-staff caller from cancelling after the event has started.
create or replace function public.cancel_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_staff boolean;
  v_b public.bookings%rowtype;
  v_start timestamptz;
begin
  if v_user is null then
    raise exception 'not_signed_in';
  end if;
  v_staff := public.is_staff();

  select * into v_b from public.bookings
  where booking_id = p_booking_id and (user_id = v_user or v_staff) for update;
  if not found then
    raise exception 'booking_not_found';
  end if;

  if v_b.booking_status in ('cancelled', 'expired') then
    return public.booking_json(p_booking_id);
  end if;

  if v_b.checked_in_at is not null then
    raise exception 'already_checked_in';
  end if;

  if v_b.booking_status = 'confirmed' and not v_staff then
    select start_at into v_start from public.events where event_id = v_b.event_id;
    if v_start <= now() then
      raise exception 'cannot_cancel';
    end if;
  end if;

  perform public.release_booking(p_booking_id, 'cancelled');
  perform public.refund_booking_payments(p_booking_id);

  return public.booking_json(p_booking_id);
end;
$$;

-- POST /bookings/:id/check-in — any staff tier (matches the permission
-- matrix: "Create/cancel bookings and record visits" is Yes for all three
-- tiers). Only a confirmed booking can be checked in; repeating the call
-- on an already-checked-in booking is a harmless no-op, not an error.
create or replace function public.check_in_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_b public.bookings%rowtype;
begin
  if not public.is_staff() then
    raise exception 'forbidden';
  end if;

  select * into v_b from public.bookings where booking_id = p_booking_id for update;
  if not found then
    raise exception 'booking_not_found';
  end if;

  if v_b.checked_in_at is not null then
    return public.booking_json(p_booking_id); -- already checked in: report it, change nothing
  end if;

  if v_b.booking_status <> 'confirmed' then
    raise exception 'not_confirmed';
  end if;

  update public.bookings set checked_in_at = now() where booking_id = p_booking_id;
  return public.booking_json(p_booking_id);
end;
$$;

-- POST /bookings/:id/refund — admin/manager tier only. Deliberately
-- separate from cancel_booking: refunds whatever completed payment(s)
-- the booking has, WITHOUT changing booking_status or releasing its
-- seats. Reuses refund_booking_payments (from the payment layer), the
-- same function cancel_booking already calls for its own auto-refund.
create or replace function public.staff_refund_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_has_completed boolean;
begin
  if not public.is_admin_or_manager() then
    raise exception 'forbidden';
  end if;

  if not exists (select 1 from public.bookings where booking_id = p_booking_id) then
    raise exception 'booking_not_found';
  end if;

  select exists (
    select 1 from public.payments
    where booking_id = p_booking_id and payment_status = 'completed'
  ) into v_has_completed;
  if not v_has_completed then
    raise exception 'nothing_to_refund';
  end if;

  perform public.refund_booking_payments(p_booking_id);
  return public.booking_json(p_booking_id);
end;
$$;

revoke all on function public.check_in_booking(uuid) from public, anon;
revoke all on function public.staff_refund_booking(uuid) from public, anon;
grant execute on function public.check_in_booking(uuid) to authenticated;
grant execute on function public.staff_refund_booking(uuid) to authenticated;
