-- Public image bucket. Anyone can view; only staff can upload, change or delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

create policy "media_objects_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media_objects_staff_insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_staff());

create policy "media_objects_staff_update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

create policy "media_objects_staff_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_staff());

-- event_media: add access rules only if the table has none yet.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'event_media'
  ) then
    create policy "event_media_select_public"
      on public.event_media for select
      using (exists (
        select 1 from public.events e
        where e.event_id = event_media.event_id and e.status <> 'draft'
      ));

    create policy "event_media_staff_all"
      on public.event_media for all
      using (public.is_staff())
      with check (public.is_staff());
  end if;
end $$;