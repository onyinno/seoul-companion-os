-- Shopping items metadata sync table for shared-account private use.
-- Safe for client-side auth (authenticated role), no service_role required.

create table if not exists public.shopping_items (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category text,
  location text,
  address text,
  google_maps_url text,
  note text,
  estimated_price numeric,
  actual_price numeric,
  checked boolean not null default false,
  photo_storage_path text,
  photo_file_name text,
  photo_uploaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists shopping_items_user_id_idx on public.shopping_items (user_id);
create index if not exists shopping_items_deleted_at_idx on public.shopping_items (deleted_at);

create or replace function public.set_shopping_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_shopping_items_updated_at on public.shopping_items;
create trigger trg_shopping_items_updated_at
before update on public.shopping_items
for each row
execute function public.set_shopping_items_updated_at();

alter table public.shopping_items enable row level security;

drop policy if exists "shopping_items_select_own" on public.shopping_items;
create policy "shopping_items_select_own"
on public.shopping_items
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "shopping_items_insert_own" on public.shopping_items;
create policy "shopping_items_insert_own"
on public.shopping_items
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "shopping_items_update_own" on public.shopping_items;
create policy "shopping_items_update_own"
on public.shopping_items
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "shopping_items_delete_own" on public.shopping_items;
create policy "shopping_items_delete_own"
on public.shopping_items
for delete
to authenticated
using (user_id = auth.uid());
