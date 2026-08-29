-- Core schema for the F1 pronostics MVP (cahier des charges section 3).

create extension if not exists "pgcrypto";

create type race_status as enum ('upcoming', 'quali_done', 'finished');

-- users mirrors auth.users so we can attach a pseudo/avatar without
-- touching the auth schema. Populated by the handle_new_user trigger below.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  pseudo text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.users (id) on delete cascade,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team text not null,
  number int not null,
  active boolean not null default true
);

create table public.races (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  circuit text not null,
  country text not null,
  race_date timestamptz not null,
  quali_date timestamptz not null,
  status race_status not null default 'upcoming',
  external_id text
);

create table public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  race_id uuid not null references public.races (id) on delete cascade,
  podium_1 uuid not null references public.drivers (id),
  podium_2 uuid not null references public.drivers (id),
  podium_3 uuid not null references public.drivers (id),
  safety_car boolean not null,
  first_dnf uuid references public.drivers (id),
  fastest_lap uuid references public.drivers (id),
  submitted_at timestamptz not null default now(),
  locked boolean not null default false,
  unique (user_id, race_id)
);

create table public.race_results (
  id uuid primary key default gen_random_uuid(),
  race_id uuid not null references public.races (id) on delete cascade unique,
  podium_1 uuid not null references public.drivers (id),
  podium_2 uuid not null references public.drivers (id),
  podium_3 uuid not null references public.drivers (id),
  safety_car boolean not null,
  first_dnf uuid references public.drivers (id),
  fastest_lap uuid references public.drivers (id)
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  race_id uuid not null references public.races (id) on delete cascade,
  group_id uuid not null references public.groups (id) on delete cascade,
  points int not null default 0,
  calculated_at timestamptz not null default now(),
  unique (user_id, race_id, group_id)
);

create index on public.group_members (user_id);
create index on public.group_members (group_id);
create index on public.predictions (race_id);
create index on public.scores (group_id, race_id);
