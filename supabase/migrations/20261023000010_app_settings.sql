-- A settings table for switches that an admin changes in the database. Replaces the
-- "alter database ... set app.simulated_payments" approach, which Supabase does not allow.
create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz not null default now()
);

-- Row security on with no policies, and no table rights for API users: the API cannot read or write it.
alter table public.app_settings enable row level security;
revoke all on public.app_settings from anon, authenticated;

insert into public.app_settings (key, value, description)
values ('simulated_payments', 'on', 'Set to off in production to switch off simulated payments.')
on conflict (key) do nothing;

-- Same function name as before, now reading the table. No row means "on".
create or replace function public.simulated_payments_enabled()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select value from public.app_settings where key = 'simulated_payments'), 'on') <> 'off';
$$;
revoke all on function public.simulated_payments_enabled() from public, anon, authenticated;