-- handle_new_user() currently inserts raw_user_meta_data ->> 'full_name'
-- as-is, with no fallback. That's NULL for any account created without
-- metadata -- notably, the Supabase Dashboard's "Add user" dialog has
-- no field for it -- which fails the profiles.full_name NOT NULL
-- constraint and rolls back the entire auth.users insert ("Database
-- error creating new user").
--
-- Falls back the same way the one-off backfill in
-- 20261004000001_profiles_signup_constraints.sql already does: the
-- local part of the email, or 'Member' if even that's missing.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1),
      'Member'
    )
  );
  return new;
end;
$$;
