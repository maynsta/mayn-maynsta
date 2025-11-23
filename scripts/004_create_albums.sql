-- Create albums table
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artist_accounts(id) on delete cascade,
  title text not null,
  cover_image_url text,
  release_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.albums enable row level security;

-- RLS Policies - everyone can view, only artist can manage their albums
create policy "albums_select_all"
  on public.albums for select
  using (true);

create policy "albums_insert_own"
  on public.albums for insert
  with check (
    exists (
      select 1 from public.artist_accounts
      where id = albums.artist_id and user_id = auth.uid()
    )
  );

create policy "albums_update_own"
  on public.albums for update
  using (
    exists (
      select 1 from public.artist_accounts
      where id = albums.artist_id and user_id = auth.uid()
    )
  );

create policy "albums_delete_own"
  on public.albums for delete
  using (
    exists (
      select 1 from public.artist_accounts
      where id = albums.artist_id and user_id = auth.uid()
    )
  );
