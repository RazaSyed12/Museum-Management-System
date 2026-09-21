-- ============================================================
-- Seed data — run AFTER creating the two test users in the
-- dashboard (Authentication -> Users -> Add user).
-- ============================================================

-- 1. Promote staff-test@museum.local to staff
--    (running here in the SQL Editor bypasses RLS entirely,
--    since it runs as the Postgres owner role, not through the
--    app's normal authenticated/anon path — that's expected and fine
--    for seeding/admin work, same reason this whole script works.)
update profiles
set role = 'staff'
where id = (select id from auth.users where email = 'staff-test@museum.local');

-- 2. A location
insert into locations (location_id, name, city, country, capacity)
values ('11111111-1111-1111-1111-111111111111', 'Main Gallery', 'Adelaide', 'Australia', 200);

-- 3. A category
insert into categories (category_id, name, active)
values ('22222222-2222-2222-2222-222222222222', 'Natural History', true);

-- 4. A published collection (created by the staff test user)
insert into collections (collection_id, name, description, status, location_id, featured, created_by)
values (
  '33333333-3333-3333-3333-333333333333',
  'Ancient Fossils',
  'A test collection for verifying RLS.',
  'published',
  '11111111-1111-1111-1111-111111111111',
  true,
  (select id from auth.users where email = 'staff-test@museum.local')
);

-- 5. A draft collection (should be invisible to the public)
insert into collections (collection_id, name, description, status, location_id, created_by)
values (
  '44444444-4444-4444-4444-444444444444',
  'Unpublished Draft Collection',
  'This should NOT be visible to a regular visitor.',
  'draft',
  '11111111-1111-1111-1111-111111111111',
  (select id from auth.users where email = 'staff-test@museum.local')
);

-- 6. A membership plan
insert into membership_plans (plan_id, name, price, duration_months, active)
values ('55555555-5555-5555-5555-555555555555', 'Standard Membership', 49.00, 12, true);
