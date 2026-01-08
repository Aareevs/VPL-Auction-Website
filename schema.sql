-- Create a table for public profiles using Supabase Auth
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text check (role in ('admin', 'team_member', 'spectator')),
  team_id text, -- Can be null for spectators or admins
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
-- 1. Public profiles are viewable by everyone
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- 2. Users can insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- 3. Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup automatically (Optional, but we are doing manual role selection so we might just insert manually in frontend or use a trigger for basic info)
-- For this app, we will insert the profile row from the frontend after signup/onboarding to allow role selection.

-- However, to secure the team limit (max 6 players per team), we need a database function and constraint/trigger.
-- OR we can use a Policy to prevent INSERT/UPDATE if count > 6.
-- A trigger is safer for concurrency.

create or replace function check_team_limit()
returns trigger as $$
begin
  -- Only check if team_id is not null
  if new.team_id is not null then
    if (select count(*) from profiles where team_id = new.team_id) >= 6 then
      raise exception 'Team limit reached. Max 6 members allowed.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger check_team_limit_trigger
before insert or update on profiles
for each row execute function check_team_limit();
