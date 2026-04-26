-- Itinerary activities metadata sync table for shared-account private use.
-- Safe for client-side auth (authenticated role), no service_role required.

create table if not exists public.itinerary_activities (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  day_id text not null,
  title text not null,
  category text not null,
  time text not null,
  place text not null,
  address text,
  google_maps_url text,
  note text,
  cost numeric,
  display_order integer,
  photo_storage_path text,
  photo_file_name text,
  photo_uploaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists itinerary_activities_user_id_idx on public.itinerary_activities (user_id);
create index if not exists itinerary_activities_day_id_idx on public.itinerary_activities (day_id);
create index if not exists itinerary_activities_deleted_at_idx on public.itinerary_activities (deleted_at);
create index if not exists itinerary_activities_display_order_idx on public.itinerary_activities (display_order);

create or replace function public.set_itinerary_activities_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_itinerary_activities_updated_at on public.itinerary_activities;
create trigger trg_itinerary_activities_updated_at
before update on public.itinerary_activities
for each row
execute function public.set_itinerary_activities_updated_at();

-- Grants allow authenticated client users to access this table through Supabase Data API.
-- RLS policies below still ensure each user can only read/write rows where user_id = auth.uid().
-- No service_role key is required for these client-side operations.
grant usage on schema public to authenticated;

grant select, insert, update, delete
on table public.itinerary_activities
to authenticated;

alter table public.itinerary_activities enable row level security;

drop policy if exists "itinerary_activities_select_own" on public.itinerary_activities;
create policy "itinerary_activities_select_own"
on public.itinerary_activities
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "itinerary_activities_insert_own" on public.itinerary_activities;
create policy "itinerary_activities_insert_own"
on public.itinerary_activities
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "itinerary_activities_update_own" on public.itinerary_activities;
create policy "itinerary_activities_update_own"
on public.itinerary_activities
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "itinerary_activities_delete_own" on public.itinerary_activities;
create policy "itinerary_activities_delete_own"
on public.itinerary_activities
for delete
to authenticated
using (user_id = auth.uid());
