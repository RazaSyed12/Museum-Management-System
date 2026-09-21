

select set_config(
  'request.jwt.claims',
  json_build_object('sub', (select id::text from auth.users where email = 'visitor-test@museum.local'))::text,
  true
);
set local role authenticated;

-- Expect: this should FAIL — a visitor cannot promote themselves to staff
update profiles
set role = 'staff'
where id = auth.uid();

reset role;


