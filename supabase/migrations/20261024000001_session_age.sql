-- When did the caller's current login (session) start?
-- The backend uses this to end sessions that are older than 30 days.
create or replace function public.session_started_at()
returns timestamptz
language sql
stable
security definer
set search_path = ''
as $$
  select s.created_at
  from auth.sessions s
  where s.id = nullif(auth.jwt() ->> 'session_id', '')::uuid
$$;

revoke all on function public.session_started_at() from public;
grant execute on function public.session_started_at() to authenticated;