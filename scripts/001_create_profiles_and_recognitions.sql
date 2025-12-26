-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create recognitions table
create table if not exists public.recognitions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  giver_name text not null,
  giver_email text,
  feedback_text text not null,
  voice_url text,
  ai_highlight text,
  show_voice boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create share_tokens table for magic link generation
create table if not exists public.share_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.recognitions enable row level security;
alter table public.share_tokens enable row level security;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Recognitions policies
create policy "recognitions_select_own"
  on public.recognitions for select
  using (auth.uid() = user_id);

create policy "recognitions_insert_own"
  on public.recognitions for insert
  with check (auth.uid() = user_id);

create policy "recognitions_insert_anonymous"
  on public.recognitions for insert
  with check (true);

create policy "recognitions_update_own"
  on public.recognitions for update
  using (auth.uid() = user_id);

create policy "recognitions_delete_own"
  on public.recognitions for delete
  using (auth.uid() = user_id);

-- Share tokens policies
create policy "share_tokens_select_own"
  on public.share_tokens for select
  using (auth.uid() = user_id);

create policy "share_tokens_select_by_token"
  on public.share_tokens for select
  using (true);

create policy "share_tokens_insert_own"
  on public.share_tokens for insert
  with check (auth.uid() = user_id);

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'User'),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
