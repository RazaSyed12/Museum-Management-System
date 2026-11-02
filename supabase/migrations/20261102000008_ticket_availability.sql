-- Explicit price categories and public stock calculated without disclosing bookings.
alter table public.ticket_allocations add column ticket_kind text not null default 'general'
  check (ticket_kind in ('general', 'member', 'child'));
update public.ticket_allocations set ticket_kind = 'member' where membership_required;

create or replace function public.event_allocations(p_event_ids uuid[])
returns table (allocation_id uuid, event_id uuid, allocation_name varchar,
  ticket_kind text, membership_required boolean, quantity int, reserved_quantity int, available int)
language sql stable security definer set search_path = public
as $$
  select a.allocation_id, a.event_id, a.allocation_name, a.ticket_kind,
         a.membership_required or a.ticket_kind = 'member', a.quantity,
         greatest(a.reserved_quantity - coalesce(expired.n, 0), 0)::int,
         greatest(a.quantity - a.reserved_quantity + coalesce(expired.n, 0), 0)::int
    from public.ticket_allocations a
    join public.events e on e.event_id = a.event_id
    left join lateral (
      select count(*)::int as n from public.tickets t
      join public.bookings b on b.booking_id = t.booking_id
      where t.allocation_id = a.allocation_id and t.ticket_status = 'held'
        and b.booking_status = 'pending' and b.booked_at <= now() - interval '15 minutes'
    ) expired on true
   where a.event_id = any(p_event_ids) and (e.status <> 'draft' or public.is_staff())
   order by a.membership_required, a.allocation_name;
$$;
revoke all on function public.event_allocations(uuid[]) from public;
grant execute on function public.event_allocations(uuid[]) to anon, authenticated;

-- Capacity creates one usable default pool; staff can split it into other types.
create or replace function public.create_default_allocation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.capacity > 0 then
    insert into public.ticket_allocations(event_id, allocation_name, quantity, membership_required)
    values (new.event_id, 'General admission', new.capacity, false);
  end if;
  return new;
end;
$$;
create trigger events_default_allocation after insert on public.events
  for each row execute function public.create_default_allocation();
revoke all on function public.create_default_allocation() from public, anon, authenticated;

-- Repair future scheduled events with capacity but no ticket setup. Preserve all
-- existing pools (including deliberately paused zero-quantity pools).
insert into public.ticket_allocations(event_id, allocation_name, quantity, membership_required)
select e.event_id, 'General admission', e.capacity, false from public.events e
where e.status = 'scheduled' and e.start_at > now() and e.capacity > 0
  and not exists (select 1 from public.ticket_allocations a where a.event_id = e.event_id);
