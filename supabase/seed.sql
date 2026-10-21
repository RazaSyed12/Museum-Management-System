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


-- 7. Sample events, one of each kind the site has to handle. Dates
--    are relative to today, so after any reset there are always
--    upcoming events (and one past one) to show and recommend.
--    Every event has at least one category — the events API requires
--    it, because recommendations match onboarding picks to categories.
insert into events (event_id, name, description, start_at, end_at, status, location_id, ticket_price, capacity, created_by) values
  ('66666666-6666-6666-6666-666666666601', 'Fossil Hunters Family Day',
   'Dig, sieve and identify real fossils with our curators. Free for all ages.',
   date_trunc('day', now()) + interval '7 days 10 hours', date_trunc('day', now()) + interval '7 days 15 hours',
   'scheduled', '11111111-1111-1111-1111-111111111111', 0, 120,
   (select id from auth.users where email = 'staff-test@museum.local')),
  ('66666666-6666-6666-6666-666666666602', 'Gold Rush Weekend',
   'Panning demonstrations, period costume and stories from the 1850s goldfields.',
   date_trunc('day', now()) + interval '14 days 10 hours', date_trunc('day', now()) + interval '15 days 16 hours',
   'scheduled', '11111111-1111-1111-1111-111111111111', 14, 200,
   (select id from auth.users where email = 'staff-test@museum.local')),
  ('66666666-6666-6666-6666-666666666603', 'Talk: Women of the Mines',
   'An evening talk on the women who ran households, stores and claims on the mining fields.',
   date_trunc('day', now()) + interval '21 days 18 hours 30 minutes', date_trunc('day', now()) + interval '21 days 20 hours',
   'scheduled', '11111111-1111-1111-1111-111111111111', 8, 40,
   (select id from auth.users where email = 'staff-test@museum.local')),
  ('66666666-6666-6666-6666-666666666604', 'Wartime Letters Reading',
   'Readings from letters sent home by local servicemen and women.',
   date_trunc('day', now()) + interval '10 days 14 hours', date_trunc('day', now()) + interval '10 days 15 hours 30 minutes',
   'cancelled', '11111111-1111-1111-1111-111111111111', 5, 60,
   (select id from auth.users where email = 'staff-test@museum.local')),
  ('66666666-6666-6666-6666-666666666605', 'Kaurna Language Workshop',
   'Still being planned with community partners (draft: hidden from visitors).',
   date_trunc('day', now()) + interval '30 days 10 hours', date_trunc('day', now()) + interval '30 days 12 hours',
   'draft', '11111111-1111-1111-1111-111111111111', 0, 25,
   (select id from auth.users where email = 'staff-test@museum.local')),
  ('66666666-6666-6666-6666-666666666606', 'Murray River Stories Night',
   'Paddle-steamer tales and river photographs (already happened).',
   date_trunc('day', now()) - interval '10 days' + interval '18 hours', date_trunc('day', now()) - interval '10 days' + interval '20 hours',
   'scheduled', '11111111-1111-1111-1111-111111111111', 12, 80,
   (select id from auth.users where email = 'staff-test@museum.local'))
on conflict (event_id) do nothing;

insert into event_categories (event_id, category_id) values
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222222'), -- Natural History
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222209'), -- Family & Kids
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222212'), -- Gold Rush (child of Mining & Industry)
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222202'), -- Colonial History
  ('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222203'), -- Mining & Industry
  ('66666666-6666-6666-6666-666666666604', '22222222-2222-2222-2222-222222222207'), -- Military History
  ('66666666-6666-6666-6666-666666666605', '22222222-2222-2222-2222-222222222201'), -- Aboriginal Heritage
  ('66666666-6666-6666-6666-666666666606', '22222222-2222-2222-2222-222222222205')  -- Maritime & Rivers
on conflict do nothing;

-- The family day showcases the published fossils collection.
insert into event_collections (event_id, collection_id) values
  ('66666666-6666-6666-6666-666666666601', '33333333-3333-3333-3333-333333333333')
on conflict do nothing;


-- 7b. Two more published collections, so collection recommendations
--     have something to rank (the fossils one is featured; these aren't).
insert into collections (collection_id, name, description, status, location_id, featured, created_by) values
  ('33333333-3333-3333-3333-333333333301', 'Goldfields Tools',
   'Pans, cradles and picks used on the South Australian goldfields.',
   'published', '11111111-1111-1111-1111-111111111111', false,
   (select id from auth.users where email = 'staff-test@museum.local')),
  ('33333333-3333-3333-3333-333333333302', 'Colonial Kitchen',
   'Cookware, recipes and household objects from early settler homes.',
   'published', '11111111-1111-1111-1111-111111111111', false,
   (select id from auth.users where email = 'staff-test@museum.local'))
on conflict (collection_id) do nothing;

insert into collection_categories (collection_id, category_id) values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222212'), -- Gold Rush
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202')  -- Colonial History
on conflict do nothing;
