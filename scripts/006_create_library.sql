-- Create user library (saved songs)
create table if not exists public.library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  added_at timestamp with time zone default now(),
  unique(user_id, song_id)
);

-- Enable RLS
alter table public.library enable row level security;

-- RLS Policies
create policy "library_select_own"
  on public.library for select
  using (auth.uid() = user_id);

create policy "library_insert_own"
  on public.library for insert
  with check (auth.uid() = user_id);

create policy "library_delete_own"
  on public.library for delete
  using (auth.uid() = user_id);

-- Create recently played table
create table if not exists public.recently_played (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  played_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.recently_played enable row level security;

-- RLS Policies
create policy "recently_played_select_own"
  on public.recently_played for select
  using (auth.uid() = user_id);

create policy "recently_played_insert_own"
  on public.recently_played for insert
  with check (auth.uid() = user_id);

create policy "recently_played_delete_own"
  on public.recently_played for delete
  using (auth.uid() = user_id);
