-- 1. Allocation names are unique within an event (case-insensitive).
create unique index ticket_allocations_name_per_event_key
  on public.ticket_allocations (event_id, lower(allocation_name));

-- 2. The allocations of an event can never add up to more than its capacity.
--    The event row is locked first, so two staff members cannot both squeeze in at once.
create or replace function public.enforce_allocation_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity int;
  v_total int;
begin
  select capacity into v_capacity from public.events where event_id = new.event_id for update;

  select coalesce(sum(quantity), 0) into v_total
  from public.ticket_allocations
  where event_id = new.event_id and allocation_id is distinct from new.allocation_id;

  if v_total + new.quantity > v_capacity then
    raise exception 'capacity_exceeded' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger ticket_allocations_capacity
  before insert or update of quantity, event_id on public.ticket_allocations
  for each row execute function public.enforce_allocation_capacity();

-- 3. An event's capacity cannot be lowered below what is already allocated.
create or replace function public.enforce_event_capacity_floor()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total int;
begin
  select coalesce(sum(quantity), 0) into v_total
  from public.ticket_allocations where event_id = new.event_id;

  if new.capacity < v_total then
    raise exception 'capacity_below_allocations' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger events_capacity_floor
  before update of capacity on public.events
  for each row when (new.capacity < old.capacity)
  execute function public.enforce_event_capacity_floor();