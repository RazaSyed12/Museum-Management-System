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

-- 3. Categories — the choices on the onboarding page.
--    Top-level categories (no parent) are what onboarding shows;
--    the sub-categories below them demonstrate the hierarchy, and
--    a pick of a parent also matches its children when scoring
--    recommendations.
insert into categories (category_id, name, description, active) values
  ('22222222-2222-2222-2222-222222222222', 'Natural History',     'Fossils, minerals, and the plants and animals of the region.', true),
  ('22222222-2222-2222-2222-222222222201', 'Aboriginal Heritage', 'Culture, language and history of the First Nations peoples of South Australia.', true),
  ('22222222-2222-2222-2222-222222222202', 'Colonial History',    'European settlement, early towns and pioneer life.', true),
  ('22222222-2222-2222-2222-222222222203', 'Mining & Industry',   'Copper, gold and the industries that built regional towns.', true),
  ('22222222-2222-2222-2222-222222222204', 'Agriculture',         'Farming, wine and the working rural landscape.', true),
  ('22222222-2222-2222-2222-222222222205', 'Maritime & Rivers',   'The Murray River, ports, shipwrecks and life on the water.', true),
  ('22222222-2222-2222-2222-222222222206', 'Art & Photography',   'Paintings, crafts and historic photographs.', true),
  ('22222222-2222-2222-2222-222222222207', 'Military History',    'Regional stories from wartime and service.', true),
  ('22222222-2222-2222-2222-222222222208', 'Science & Technology','Inventions, transport and communications through the years.', true),
  ('22222222-2222-2222-2222-222222222209', 'Family & Kids',       'Hands-on exhibits and activities for younger visitors.', true)
on conflict (category_id) do nothing;

insert into categories (category_id, name, description, parent_category_id, active) values
  ('22222222-2222-2222-2222-222222222211', 'Fossils',          'Ancient life preserved in stone.',      '22222222-2222-2222-2222-222222222222', true),
  ('22222222-2222-2222-2222-222222222212', 'Gold Rush',        'The 1850s goldfields and their towns.', '22222222-2222-2222-2222-222222222203', true),
  ('22222222-2222-2222-2222-222222222213', 'Wine & Viticulture','Vineyards and winemaking heritage.',   '22222222-2222-2222-2222-222222222204', true)
on conflict (category_id) do nothing;

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

-- 5b. Tag the published collection, so recommendations have
--     something to match against.
insert into collection_categories (collection_id, category_id) values
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222211')
on conflict do nothing;

-- 6. A membership plan
insert into membership_plans (plan_id, name, price, duration_months, active)
values ('55555555-5555-5555-5555-555555555555', 'Standard Membership', 49.00, 12, true);
