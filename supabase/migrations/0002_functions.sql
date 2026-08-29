-- Mirrors every new Supabase Auth user into public.users so the app has a
-- place to store pseudo/avatar without touching the auth schema directly.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, pseudo)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'pseudo', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- True when the current user belongs to the given group. Used by RLS
-- policies below; security definer so it can read group_members even
-- though group_members itself is locked down by RLS.
create function public.is_group_member(check_group_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.group_members
    where group_id = check_group_id and user_id = auth.uid()
  );
$$;

-- Generates a short, human-shareable invite code (e.g. "7K2N9P").
create function public.generate_invite_code()
returns text
language sql
volatile
as $$
  select upper(substr(md5(gen_random_uuid()::text), 1, 6));
$$;

-- Creates a group and adds the caller as its first member (owner). Runs as
-- the caller (not security definer) — RLS on groups/group_members still
-- applies, this just wraps two inserts in one round trip.
create function public.create_group(group_name text)
returns public.groups
language plpgsql
security invoker
as $$
declare
  new_group public.groups;
  code text;
  attempt int := 0;
begin
  loop
    code := public.generate_invite_code();
    begin
      insert into public.groups (name, owner_id, invite_code)
      values (group_name, auth.uid(), code)
      returning * into new_group;
      exit;
    exception when unique_violation then
      attempt := attempt + 1;
      if attempt > 5 then
        raise exception 'Could not generate a unique invite code, try again';
      end if;
    end;
  end loop;

  insert into public.group_members (group_id, user_id)
  values (new_group.id, auth.uid());

  return new_group;
end;
$$;

-- Joins the caller to a group identified by its invite code. Security
-- definer so the caller can resolve a group by code without a standing
-- SELECT policy that would expose every group's invite code.
create function public.join_group_by_code(code text)
returns public.groups
language plpgsql
security definer set search_path = public
as $$
declare
  target public.groups;
begin
  select * into target from public.groups where invite_code = upper(code);

  if target.id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.group_members (group_id, user_id)
  values (target.id, auth.uid())
  on conflict (group_id, user_id) do nothing;

  return target;
end;
$$;
