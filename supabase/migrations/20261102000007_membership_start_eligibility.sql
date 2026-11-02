-- Match the current-status reporting rule: future memberships are not active yet.
create or replace function public.is_active_member(p_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships where user_id = p_user_id and status = 'active'
      and starts_at <= now() and (ends_at is null or ends_at > now())
  );
$$;
revoke all on function public.is_active_member(uuid) from public, anon, authenticated;
