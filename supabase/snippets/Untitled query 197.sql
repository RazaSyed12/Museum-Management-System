select conname
from pg_constraint
where connamespace = 'public'::regnamespace and contype = 'c'
order by conname;