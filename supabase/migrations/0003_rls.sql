-- Row Level Security: every table is locked down by default, then opened
-- up narrowly. Admin writes (races, drivers, race_results) go through the
-- service role key from /admin/results, which bypasses RLS entirely, so
-- those tables intentionally have no INSERT/UPDATE/DELETE policy for
-- regular users.

alter table public.users enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.drivers enable row level security;
alter table public.races enable row level security;
alter table public.predictions enable row level security;
alter table public.race_results enable row level security;
alter table public.scores enable row level security;

-- users
create policy "users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "users can read fellow group members' profiles" on public.users
  for select using (
    exists (
      select 1 from public.group_members my
      join public.group_members theirs on theirs.group_id = my.group_id
      where my.user_id = auth.uid() and theirs.user_id = public.users.id
    )
  );

create policy "users can update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- groups
create policy "members can read their groups" on public.groups
  for select using (public.is_group_member(id));

create policy "authenticated users can create a group" on public.groups
  for insert with check (auth.uid() = owner_id);

create policy "owner can update their group" on public.groups
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- group_members
create policy "members can read their group's roster" on public.group_members
  for select using (public.is_group_member(group_id));

create policy "users can add themselves to a group" on public.group_members
  for insert with check (auth.uid() = user_id);

create policy "users can leave a group" on public.group_members
  for delete using (auth.uid() = user_id);

-- drivers (reference data, read-only for everyone signed in)
create policy "authenticated users can read drivers" on public.drivers
  for select to authenticated using (true);

-- races (reference data, read-only for everyone signed in)
create policy "authenticated users can read races" on public.races
  for select to authenticated using (true);

-- predictions
create policy "users can read own predictions" on public.predictions
  for select using (auth.uid() = user_id);

create policy "users can read others' locked predictions" on public.predictions
  for select using (locked = true);

create policy "users can submit a prediction before quali" on public.predictions
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.races r
      where r.id = race_id and r.quali_date > now()
    )
  );

create policy "users can edit their prediction before quali" on public.predictions
  for update using (
    auth.uid() = user_id
    and exists (
      select 1 from public.races r
      where r.id = race_id and r.quali_date > now()
    )
  ) with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.races r
      where r.id = race_id and r.quali_date > now()
    )
  );

-- race_results (reference data, read-only for everyone signed in)
create policy "authenticated users can read race results" on public.race_results
  for select to authenticated using (true);

-- scores
create policy "group members can read the group's scores" on public.scores
  for select using (public.is_group_member(group_id));
