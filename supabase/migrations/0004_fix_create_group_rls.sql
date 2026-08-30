-- Fixes "new row violates row-level security policy for table groups" when
-- creating a group.
--
-- create_group() ran as SECURITY INVOKER, so its `insert ... returning`
-- into groups was subject to RLS. The only SELECT policy on groups grants
-- visibility via group membership — but the caller isn't a member yet at
-- that point (the group_members row is inserted right after), so the
-- RETURNING projection failed the RLS check and Postgres reported it as an
-- insert policy violation.
--
-- Switching to SECURITY DEFINER (matching join_group_by_code) makes the
-- function run with the privileges of its owner, which bypasses RLS for
-- its own internal inserts — the same reason join_group_by_code already
-- needed it.

create or replace function public.create_group(group_name text)
returns public.groups
language plpgsql
security definer set search_path = public
as $$
declare
  new_group public.groups;
  code text;
  attempt int := 0;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

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

-- Defense in depth: owners can always read their own group directly,
-- independent of their group_members row.
create policy "owner can read their own group" on public.groups
  for select using (auth.uid() = owner_id);
