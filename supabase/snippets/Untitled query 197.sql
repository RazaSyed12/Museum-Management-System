select conname, conrelid::regclass as table_name
from pg_constraint
where connamespace = 'public'::regnamespace and contype = 'c'
order by table_name, conname;