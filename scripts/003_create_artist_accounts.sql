-- Create artist accounts table
create table if not exists public.artist_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  artist_name text not null,
  bio text,
  profile_image_url text,
  verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Enable RLS
alter table public.artist_accounts enable row level security;

-- RLS Policies - users can view all artists but only manage their own
create policy "artist_accounts_select_all"
  on public.artist_accounts for select
  using (true);

create policy "artist_accounts_insert_own"
  on public.artist_accounts for insert
  with check (auth.uid() = user_id);

create policy "artist_accounts_update_own"
  on public.artist_accounts for update
  using (auth.uid() = user_id);

create policy "artist_accounts_delete_own"
  on public.artist_accounts for delete
  using (auth.uid() = user_id);
