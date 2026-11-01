-- Category names must be unique among siblings (same parent), ignoring case.
-- Top-level categories (no parent) are treated as siblings of each other.
create unique index categories_name_per_parent_key
  on public.categories (
    lower(name),
    coalesce(parent_category_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );