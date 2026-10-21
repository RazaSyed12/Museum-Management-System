-- ============================================================
-- Museum Visitor Experience Platform — Sign-up Identity Field
-- ============================================================
-- Supersedes the earlier draft of this migration (which added a
-- unique constraint on display_name). Revised decision: no
-- separate @username field, and no uniqueness requirement on
-- anyone's name at all — a real person's name is a bad uniqueness
-- key (common names collide constantly), and account uniqueness
-- is already guaranteed by auth.users.email, which Supabase Auth
-- itself refuses to let two accounts share. People sign in with
-- their email; this column exists purely to greet/display them.
--
-- display_name is renamed to full_name to match what it actually
-- holds — the "Full name" field on the Create Account screen —
-- now that it's no longer doubling as a username.
-- ============================================================

alter table public.profiles
  rename column display_name to full_name;


-- ------------------------------------------------------------
-- Backfill existing rows before the not-null step below. Some
-- profiles (created before this column was required — through
-- Studio, testing, etc.) have no name set at all. Falls back to
-- the local part of the person's email as a placeholder; 'Member'
-- only if even that's somehow missing.
-- ------------------------------------------------------------
update public.profiles p
set full_name = coalesce(
  (select split_part(u.email, '@', 1) from auth.users u where u.id = p.id),
  'Member'
)
where p.full_name is null;

alter table public.profiles
  alter column full_name set not null;


-- ------------------------------------------------------------
-- The sign-up trigger (migration 0002) inserts into this column
-- by name, so it has to be updated to match — otherwise every
-- sign-up would fail the moment auth.users gets a new row, since
-- the trigger would be inserting into a column that no longer
-- exists.
--
-- Note the metadata key below is 'full_name' too — whatever calls
-- supabase.auth.signUp() needs to pass options.data.full_name
-- (not display_name) for this to be picked up correctly.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;