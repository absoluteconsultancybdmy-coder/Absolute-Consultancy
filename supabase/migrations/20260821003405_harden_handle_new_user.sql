create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, country, role, agent_id)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'country',
    -- User metadata is caller-controlled, so it must not assign privileged roles or agent ownership.
    'student',
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
