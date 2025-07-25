
-- Create profiles table to store public user data
-- This is useful for storing things like usernames, avatars, etc.
-- This table is linked to the auth.users table via a foreign key.
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Function to automatically create a profile for a new user
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Policies for profiles table
-- 1. Allow users to read all profiles.
-- 2. Allow users to update their own profile.
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on profiles for update using (auth.uid() = id);


-- Create lists table
create table lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  is_deletable boolean not null default true,
  created_at timestamp with time zone not null default now(),
  unique(user_id, name)
);

-- Policies for lists table
-- 1. Enable RLS
-- 2. Allow users to manage their own lists
alter table lists enable row level security;
create policy "Users can view their own lists." on lists for select using (auth.uid() = user_id);
create policy "Users can insert their own lists." on lists for insert with check (auth.uid() = user_id);
create policy "Users can update their own lists." on lists for update using (auth.uid() = user_id);
create policy "Users can delete their own lists." on lists for delete using (auth.uid() = user_id);


-- Create list_items table
create table list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists on delete cascade not null,
  user_id uuid references auth.users not null,
  media_id integer not null,
  media_type text not null,
  title text not null,
  poster_path text,
  release_date text,
  created_at timestamp with time zone not null default now(),
  unique(list_id, media_id, media_type)
);

-- Policies for list_items table
-- 1. Enable RLS
-- 2. Allow users to manage items in their own lists
alter table list_items enable row level security;
create policy "Users can view items in their own lists." on list_items for select using (auth.uid() = user_id);
create policy "Users can insert items into their own lists." on list_items for insert with check (auth.uid() = user_id);
create policy "Users can update items in their own lists." on list_items for update using (auth.uid() = user_id);
create policy "Users can delete items from their own lists." on list_items for delete using (auth.uid() = user_id);


-- Create torrent_sites table
create table torrent_sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  url_template text not null,
  created_at timestamp with time zone not null default now()
);

-- Policies for torrent_sites table
alter table torrent_sites enable row level security;
create policy "Users can manage their own torrent sites." on torrent_sites for all using (auth.uid() = user_id);


-- Create torrent_keywords table
create table torrent_keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  value text not null,
  created_at timestamp with time zone not null default now(),
  unique(user_id, value)
);

-- Policies for torrent_keywords table
alter table torrent_keywords enable row level security;
create policy "Users can manage their own torrent keywords." on torrent_keywords for all using (auth.uid() = user_id);
