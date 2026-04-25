-- Supabase Storage policies for private trip photo uploads.
--
-- Scope:
--   bucket: trip-photos (must stay private)
--   table : storage.objects
--
-- Path convention (v2 photo feature, UI not enabled yet):
--   {userId}/shopping/{itemId}/{fileId}.jpg
--   {userId}/activities/{activityId}/{fileId}.jpg
--
-- IMPORTANT:
--   Run this SQL in Supabase SQL Editor before enabling any photo upload UI.
--   Do NOT use service_role in client code.

-- Clean up existing policies with the same names (safe to re-run).
drop policy if exists "trip_photos_insert_own_folder" on storage.objects;
drop policy if exists "trip_photos_select_own_folder" on storage.objects;
drop policy if exists "trip_photos_update_own_folder" on storage.objects;
drop policy if exists "trip_photos_delete_own_folder" on storage.objects;

-- INSERT: authenticated users can upload only into their own top-level folder.
create policy "trip_photos_insert_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'trip-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] in ('shopping', 'activities')
);

-- SELECT: authenticated users can read only their own files.
create policy "trip_photos_select_own_folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'trip-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] in ('shopping', 'activities')
);

-- UPDATE: authenticated users can modify only their own files.
create policy "trip_photos_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'trip-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] in ('shopping', 'activities')
)
with check (
  bucket_id = 'trip-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] in ('shopping', 'activities')
);

-- DELETE: authenticated users can delete only their own files.
create policy "trip_photos_delete_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'trip-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] in ('shopping', 'activities')
);
