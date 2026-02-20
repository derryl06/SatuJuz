-- 0) Extensions
create extension if not exists pgcrypto;

-- 1) Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  prayer_city text,
  prayer_country text,
  prayer_lat double precision,
  prayer_lon double precision,
  prayer_method text
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- 2) Daily completions
create table if not exists public.daily_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date_id date not null,
  created_at timestamptz not null default now()
);
create unique index if not exists daily_completions_unique_user_day
on public.daily_completions(user_id, date_id);
alter table public.daily_completions enable row level security;
create policy "daily_completions_select_own" on public.daily_completions for select using (user_id = auth.uid());
create policy "daily_completions_insert_own" on public.daily_completions for insert with check (user_id = auth.uid());
create policy "daily_completions_update_own" on public.daily_completions for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily_completions_delete_own" on public.daily_completions for delete using (user_id = auth.uid());

-- 3) Completion items
create table if not exists public.completion_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date_id date not null,
  juz_number int not null check (juz_number >= 1 and juz_number <= 30),
  item_type text not null check (item_type in ('target','extra')),
  completed_at timestamptz not null default now()
);
create index if not exists completion_items_user_day_idx
on public.completion_items(user_id, date_id);
alter table public.completion_items enable row level security;
create policy "completion_items_select_own" on public.completion_items for select using (user_id = auth.uid());
create policy "completion_items_insert_own" on public.completion_items for insert with check (user_id = auth.uid());
create policy "completion_items_update_own" on public.completion_items for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "completion_items_delete_own" on public.completion_items for delete using (user_id = auth.uid());

-- 4) Bookmarks
create table if not exists public.bookmarks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  juz_number int not null check (juz_number >= 1 and juz_number <= 30),
  surah_number int,
  ayah_number int,
  scroll_y int,
  updated_at timestamptz not null default now()
);
alter table public.bookmarks enable row level security;
create policy "bookmarks_select_own" on public.bookmarks for select using (user_id = auth.uid());
create policy "bookmarks_insert_own" on public.bookmarks for insert with check (user_id = auth.uid());
create policy "bookmarks_update_own" on public.bookmarks for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "bookmarks_delete_own" on public.bookmarks for delete using (user_id = auth.uid());

-- 5) Trigger: auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
