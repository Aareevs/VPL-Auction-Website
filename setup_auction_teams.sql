create table if not exists public.auction_teams (
  id text primary key,
  name text not null,
  short_name text not null,
  primary_color text not null default '#2563eb',
  secondary_color text not null default '#ffffff',
  logo_url text,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.auction_teams enable row level security;

drop policy if exists "Public read auction_teams" on public.auction_teams;
create policy "Public read auction_teams"
on public.auction_teams
for select
using (true);

drop policy if exists "Auth write auction_teams" on public.auction_teams;
create policy "Auth write auction_teams"
on public.auction_teams
for all
using (auth.role() = 'authenticated');

insert into public.auction_teams (id, name, short_name, primary_color, secondary_color, logo_url, display_order)
values
  ('1', coalesce((select name from public.team_overrides where team_id = '1'), 'The Dark Knight Riders'), coalesce((select short_name from public.team_overrides where team_id = '1'), 'TDKR'), coalesce((select primary_color from public.team_overrides where team_id = '1'), '#004BA0'), '#D1AB3E', coalesce((select logo_url from public.team_overrides where team_id = '1'), '/teams/tdkr_logo.png'), 0),
  ('2', coalesce((select name from public.team_overrides where team_id = '2'), 'B-1901'), coalesce((select short_name from public.team_overrides where team_id = '2'), 'B19'), coalesce((select primary_color from public.team_overrides where team_id = '2'), '#EC1C24'), '#2B2A29', coalesce((select logo_url from public.team_overrides where team_id = '2'), '/teams/b1901_logo.png'), 1),
  ('3', coalesce((select name from public.team_overrides where team_id = '3'), 'Kings XI Vedam'), coalesce((select short_name from public.team_overrides where team_id = '3'), 'KXV'), coalesce((select primary_color from public.team_overrides where team_id = '3'), '#2E0854'), '#B3A123', coalesce((select logo_url from public.team_overrides where team_id = '3'), '/teams/kxv_logo.png'), 2),
  ('4', coalesce((select name from public.team_overrides where team_id = '4'), 'Team 1404'), coalesce((select short_name from public.team_overrides where team_id = '4'), 'T14'), coalesce((select primary_color from public.team_overrides where team_id = '4'), '#F7A721'), '#000000', coalesce((select logo_url from public.team_overrides where team_id = '4'), '/teams/team1404_logo.png'), 3),
  ('5', coalesce((select name from public.team_overrides where team_id = '5'), 'Loser'), coalesce((select short_name from public.team_overrides where team_id = '5'), 'LSR'), coalesce((select primary_color from public.team_overrides where team_id = '5'), '#17479E'), '#DC333E', coalesce((select logo_url from public.team_overrides where team_id = '5'), '/teams/loser_logo.png'), 4),
  ('6', coalesce((select name from public.team_overrides where team_id = '6'), 'Justice League'), coalesce((select short_name from public.team_overrides where team_id = '6'), 'JL'), coalesce((select primary_color from public.team_overrides where team_id = '6'), '#EA1A85'), '#254AA5', coalesce((select logo_url from public.team_overrides where team_id = '6'), '/teams/justice_league_logo.png'), 5),
  ('7', coalesce((select name from public.team_overrides where team_id = '7'), 'Alpha Executors'), coalesce((select short_name from public.team_overrides where team_id = '7'), 'AE'), coalesce((select primary_color from public.team_overrides where team_id = '7'), '#DD1F2D'), '#A7A9AC', coalesce((select logo_url from public.team_overrides where team_id = '7'), '/teams/alpha_executors_logo.png'), 6),
  ('8', coalesce((select name from public.team_overrides where team_id = '8'), 'Kartik Aryan'), coalesce((select short_name from public.team_overrides where team_id = '8'), 'KA'), coalesce((select primary_color from public.team_overrides where team_id = '8'), '#0084CA'), '#A6A8AB', coalesce((select logo_url from public.team_overrides where team_id = '8'), '/teams/kartik_aryan_logo.png'), 7),
  ('9', coalesce((select name from public.team_overrides where team_id = '9'), 'Auction Bullies'), coalesce((select short_name from public.team_overrides where team_id = '9'), 'AB'), coalesce((select primary_color from public.team_overrides where team_id = '9'), '#1B2133'), '#BCA05E', coalesce((select logo_url from public.team_overrides where team_id = '9'), '/teams/auction_bullies_logo.png'), 8),
  ('10', coalesce((select name from public.team_overrides where team_id = '10'), 'MoneyBall Mafia'), coalesce((select short_name from public.team_overrides where team_id = '10'), 'MBM'), coalesce((select primary_color from public.team_overrides where team_id = '10'), '#c2410c'), '#fed7aa', coalesce((select logo_url from public.team_overrides where team_id = '10'), '/teams/moneyball_mafia_logo.png'), 9)
on conflict (id) do nothing;

alter publication supabase_realtime add table public.auction_teams;
