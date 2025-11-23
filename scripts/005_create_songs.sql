-- Create songs table
create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.albums(id) on delete set null,
  artist_id uuid not null references public.artist_accounts(id) on delete cascade,
  title text not null,
  duration integer, -- in seconds
  audio_url text not null,
  cover_image_url text,
  explicit boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.songs enable row level security;

-- RLS Policies - everyone can view, only artist can manage their songs
create policy "songs_select_all"
  on public.songs for select
  using (true);

create policy "songs_insert_own"
  on public.songs for insert
  with check (
    exists (
      select 1 from public.artist_accounts
      where id = songs.artist_id and user_id = auth.uid()
    )
  );

create policy "songs_update_own"
  on public.songs for update
  using (
    exists (
      select 1 from public.artist_accounts
      where id = songs.artist_id and user_id = auth.uid()
    )
  );

create policy "songs_delete_own"
  on public.songs for delete
  using (
    exists (
      select 1 from public.artist_accounts
      where id = songs.artist_id and user_id = auth.uid()
    )
  );
