-- ============================================================
-- Cover photos for the collections and events seeded in
-- 20261030000001_demo_seed_data.sql.
-- ============================================================

-- Media — all CC-licensed/public-domain Wikimedia Commons files,
-- linked via their stable Special:FilePath redirect so no thumbnail
-- hash needs guessing.
insert into media (media_id, url, alt_text) values
  ('77777777-7777-7777-7777-777777777701', 'https://commons.wikimedia.org/wiki/Special:FilePath/Ammonite_fossil_3.jpg', 'An ammonite fossil'),
  ('77777777-7777-7777-7777-777777777702', 'https://commons.wikimedia.org/wiki/Special:FilePath/Two_prospectors_standing_in_front_of_building_with_donkey_loaded_with_gold_mining_pan,_shovel_and_other_supplies,_vicinity_of_(HESTER_117).jpeg', 'Prospectors with mining tools and a pack donkey'),
  ('77777777-7777-7777-7777-777777777703', 'https://commons.wikimedia.org/wiki/Special:FilePath/Colonial_kitchen_inside_settler''s_cottage.jpg', 'A colonial-era kitchen interior'),
  ('77777777-7777-7777-7777-777777777704', 'https://commons.wikimedia.org/wiki/Special:FilePath/Ammonite_fossil_2.jpg', 'A fossil specimen'),
  ('77777777-7777-7777-7777-777777777705', 'https://commons.wikimedia.org/wiki/Special:FilePath/Five_prospectors_panning_for_gold_in_a_creek,_Alaska,_1897_(LAROCHE_193).jpeg', 'Prospectors panning for gold in a creek'),
  ('77777777-7777-7777-7777-777777777706', 'https://commons.wikimedia.org/wiki/Special:FilePath/Women_tin_miners_in_Perak,_late_19th_century.jpg', 'Women miners, late 19th century'),
  ('77777777-7777-7777-7777-777777777707', 'https://commons.wikimedia.org/wiki/Special:FilePath/British_officer_writing_home_-_WWI_-_Western_Front.jpg', 'A soldier writing a letter home during WWI'),
  ('77777777-7777-7777-7777-777777777708', 'https://commons.wikimedia.org/wiki/Special:FilePath/Kaurna_Cultural_Centre.jpg', 'The Kaurna Cultural Centre'),
  ('77777777-7777-7777-7777-777777777709', 'https://commons.wikimedia.org/wiki/Special:FilePath/Paddle_Steamer_Hero_-_towing_wood_near_Barmah_Forest_-_Murray_River.jpg', 'A paddle steamer on the Murray River')
on conflict (media_id) do nothing;

insert into collection_media (collection_id, media_id, sort_order) values
  ('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777701', 0), -- Ancient Fossils
  ('33333333-3333-3333-3333-333333333301', '77777777-7777-7777-7777-777777777702', 0), -- Goldfields Tools
  ('33333333-3333-3333-3333-333333333302', '77777777-7777-7777-7777-777777777703', 0)  -- Colonial Kitchen
on conflict (collection_id, media_id) do nothing;

insert into event_media (event_id, media_id, sort_order) values
  ('66666666-6666-6666-6666-666666666601', '77777777-7777-7777-7777-777777777704', 0), -- Fossil Hunters Family Day
  ('66666666-6666-6666-6666-666666666602', '77777777-7777-7777-7777-777777777705', 0), -- Gold Rush Weekend
  ('66666666-6666-6666-6666-666666666603', '77777777-7777-7777-7777-777777777706', 0), -- Talk: Women of the Mines
  ('66666666-6666-6666-6666-666666666604', '77777777-7777-7777-7777-777777777707', 0), -- Wartime Letters Reading
  ('66666666-6666-6666-6666-666666666605', '77777777-7777-7777-7777-777777777708', 0), -- Kaurna Language Workshop
  ('66666666-6666-6666-6666-666666666606', '77777777-7777-7777-7777-777777777709', 0)  -- Murray River Stories Night
on conflict (event_id, media_id) do nothing;
