-- Pablo Cockpit v2 auth and privacy vault.
-- Apply this in a Supabase project, then insert one enabled owner row in cockpit_profiles.

create extension if not exists pgcrypto;

create table if not exists public.cockpit_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  role text not null default 'owner' check (role in ('owner', 'agent', 'viewer')),
  is_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cockpit_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('capture', 'today_task', 'proof_item', 'night_close', 'project', 'memory', 'body_summary', 'money_summary')),
  external_id text not null,
  title text,
  payload jsonb not null default '{}'::jsonb,
  privacy_class text not null default 'private_summary' check (privacy_class in ('public', 'private_summary', 'sensitive', 'blocked_public')),
  public_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists cockpit_items_owner_type_external_idx
on public.cockpit_items(owner_id, item_type, external_id);

create table if not exists public.connector_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  connector_name text not null check (connector_name in ('supabase_vault', 'notion', 'google_calendar', 'google_drive', 'make', 'gmail')),
  status text not null default 'planned' check (status in ('planned', 'connected', 'paused', 'error', 'revoked')),
  scopes text[] not null default '{}',
  token_reference text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, connector_name)
);

create table if not exists public.sync_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  connector_name text not null,
  action text not null,
  privacy_class text not null check (privacy_class in ('public', 'private_summary', 'sensitive', 'blocked_public')),
  status text not null check (status in ('queued', 'success', 'error', 'skipped')),
  summary text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  summary text not null,
  proof_url text,
  public_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cockpit_profiles enable row level security;
alter table public.cockpit_items enable row level security;
alter table public.connector_accounts enable row level security;
alter table public.sync_events enable row level security;
alter table public.portfolio_records enable row level security;

create or replace function public.is_enabled_cockpit_owner(target_user uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.cockpit_profiles
    where user_id = target_user
      and is_enabled = true
  );
$$;

drop policy if exists cockpit_profiles_select_self on public.cockpit_profiles;
create policy cockpit_profiles_select_self
on public.cockpit_profiles
for select
to authenticated
using (user_id = auth.uid() and is_enabled = true);

drop policy if exists cockpit_items_owner_all on public.cockpit_items;
create policy cockpit_items_owner_all
on public.cockpit_items
for all
to authenticated
using (owner_id = auth.uid() and public.is_enabled_cockpit_owner(auth.uid()))
with check (owner_id = auth.uid() and public.is_enabled_cockpit_owner(auth.uid()));

drop policy if exists cockpit_items_public_read on public.cockpit_items;
create policy cockpit_items_public_read
on public.cockpit_items
for select
to anon, authenticated
using (privacy_class = 'public' and public_approved = true);

drop policy if exists connector_accounts_owner_all on public.connector_accounts;
create policy connector_accounts_owner_all
on public.connector_accounts
for all
to authenticated
using (owner_id = auth.uid() and public.is_enabled_cockpit_owner(auth.uid()))
with check (owner_id = auth.uid() and public.is_enabled_cockpit_owner(auth.uid()));

drop policy if exists sync_events_owner_select_insert on public.sync_events;
create policy sync_events_owner_select_insert
on public.sync_events
for all
to authenticated
using (owner_id = auth.uid() and public.is_enabled_cockpit_owner(auth.uid()))
with check (owner_id = auth.uid() and public.is_enabled_cockpit_owner(auth.uid()));

drop policy if exists portfolio_records_owner_all on public.portfolio_records;
create policy portfolio_records_owner_all
on public.portfolio_records
for all
to authenticated
using (owner_id = auth.uid() and public.is_enabled_cockpit_owner(auth.uid()))
with check (owner_id = auth.uid() and public.is_enabled_cockpit_owner(auth.uid()));

drop policy if exists portfolio_records_public_read on public.portfolio_records;
create policy portfolio_records_public_read
on public.portfolio_records
for select
to anon, authenticated
using (public_approved = true);

create index if not exists cockpit_items_owner_type_idx on public.cockpit_items(owner_id, item_type);
create index if not exists cockpit_items_public_idx on public.cockpit_items(public_approved, privacy_class);
create index if not exists connector_accounts_owner_idx on public.connector_accounts(owner_id);
create index if not exists sync_events_owner_created_idx on public.sync_events(owner_id, created_at desc);

-- After your first magic-link sign in creates auth.users, run:
-- insert into public.cockpit_profiles (user_id, email, display_name, is_enabled)
-- values ('<auth user uuid>', '<your email>', 'Sharavan', true);
