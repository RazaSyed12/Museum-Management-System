-- Run with psql -f supabase/reconcile_demo_migrations.sql against an existing
-- database whose 20261030000001 history entry is staff_tiers. Fresh databases
-- apply the migration files normally and do not need this script.
-- The history move, missing demo data and media backfill commit together.
\set ON_ERROR_STOP on

begin;

lock table supabase_migrations.schema_migrations in share row exclusive mode;

do $$
declare
  v_old_name text;
  v_new_name text;
begin
  select name into v_old_name from supabase_migrations.schema_migrations
   where version = '20261030000001';
  select name into v_new_name from supabase_migrations.schema_migrations
   where version = '20261030000003';

  if to_regtype('public.staff_tier') is null
     or to_regprocedure('public.is_admin()') is null
     or to_regprocedure('public.staff_me()') is null then
    raise exception 'Staff-tier schema is missing. Apply the normal migrations instead.';
  end if;

  if exists (select 1 from supabase_migrations.schema_migrations
              where version = '20261030000002'
                and name is distinct from 'demo_seed_media') then
    raise exception 'Migration 20261030000002 has unexpected metadata. Review its history before proceeding.';
  end if;

  if v_old_name = 'staff_tiers' and v_new_name is null then
    if exists (select 1 from supabase_migrations.schema_migrations
               where version = '20261030000003') then
      raise exception 'Migration 20261030000003 already exists with unexpected metadata.';
    end if;

    -- Move the existing entry and its SQL history; never rerun the tier
    -- migration, whose initial backfill would promote every staff tier.
    update supabase_migrations.schema_migrations
       set version = '20261030000003'
     where version = '20261030000001';
  elsif v_old_name = 'demo_seed_data' and v_new_name = 'staff_tiers' then
    null; -- Already reconciled; the data inserts below are safe to repeat.
  else
    raise exception 'Unexpected migration history. Review versions 20261030000001 and 20261030000003 before proceeding.';
  end if;
end;
$$;

-- Paths are relative to this script. Existing records and staff edits are
-- retained by the migrations' ON CONFLICT DO NOTHING clauses.
\ir migrations/20261030000001_demo_seed_data.sql
\ir migrations/20261030000002_demo_seed_media.sql

insert into supabase_migrations.schema_migrations (version, name)
values ('20261030000001', 'demo_seed_data')
on conflict (version) do nothing;

insert into supabase_migrations.schema_migrations (version, name)
values ('20261030000002', 'demo_seed_media')
on conflict (version) do nothing;

commit;
