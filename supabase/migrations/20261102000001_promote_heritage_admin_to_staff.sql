-- Promote the heritage museum admin account to staff.
--
-- This mirrors the role-promotion statement in
-- 20261031000011_demo_seed_data.sql, which ran before this account
-- existed in auth.users and so silently updated zero rows. Re-running
-- it here, now that the account has been created via the dashboard,
-- actually takes effect.
--
-- Safe to re-run: no-ops if the account doesn't exist yet, or is
-- already staff.
update profiles
set role = 'staff'
where id = (select id from auth.users where email = 'admin@heritage.museum.com');
