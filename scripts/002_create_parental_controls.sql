-- Create parental controls table
create table if not exists public.parental_controls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pin_code text not null,
  block_videos boolean default false,
  block_explicit boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Enable RLS
alter table public.parental_controls enable row level security;

-- RLS Policies
create policy "parental_controls_select_own"
  on public.parental_controls for select
  using (auth.uid() = user_id);

create policy "parental_controls_insert_own"
  on public.parental_controls for insert
  with check (auth.uid() = user_id);

create policy "parental_controls_update_own"
  on public.parental_controls for update
  using (auth.uid() = user_id);

create policy "parental_controls_delete_own"
  on public.parental_controls for delete
  using (auth.uid() = user_id);
