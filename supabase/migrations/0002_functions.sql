-- helper: when user signs up, optionally create profile row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;

  return new;
end;
$$;

-- trigger on auth.users
-- NOTE: on Supabase, auth schema exists; this trigger must be created by a privileged role.

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
