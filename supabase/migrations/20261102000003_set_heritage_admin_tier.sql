-- The heritage admin account was promoted to role = 'staff' in
-- 20261102000001_promote_heritage_admin_to_staff.sql, but per BE-01
-- (20261030000001_staff_tiers.sql), role alone grants no portal access
-- -- a tier must also be set, and only an existing admin can set one
-- via admin_set_user(). Since this is the very first staff account,
-- there's no admin yet to call that through, so it's bootstrapped
-- directly here, the same way the role promotion was.
--
-- Safe to re-run: no-ops if the account doesn't exist, or already has
-- a tier (so it won't clobber a deliberate later change via the admin
-- panel).
update profiles
set tier = 'admin'
where id = (select id from auth.users where email = 'admin@heritage.museum.com')
  and tier is null;
