-- QuoteFlow MVP schema

create extension if not exists "pgcrypto";

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  agency_name text,
  timezone text not null default 'UTC'
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

-- leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,

  first_name text,
  last_name text,
  email text,
  phone text,

  status text not null default 'New',
  next_follow_up_date date,
  notes text
);

create index if not exists leads_owner_id_idx on public.leads(owner_id);
create index if not exists leads_followup_idx on public.leads(owner_id, next_follow_up_date);

alter table public.leads enable row level security;

create policy "leads_select_own" on public.leads
for select using (auth.uid() = owner_id);

create policy "leads_insert_own" on public.leads
for insert with check (auth.uid() = owner_id);

create policy "leads_update_own" on public.leads
for update using (auth.uid() = owner_id);

create policy "leads_delete_own" on public.leads
for delete using (auth.uid() = owner_id);

-- templates
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,

  channel text not null check (channel in ('sms','email')),
  title text not null,
  body text not null
);

create index if not exists templates_owner_id_idx on public.templates(owner_id);

alter table public.templates enable row level security;

create policy "templates_select_own" on public.templates
for select using (auth.uid() = owner_id);

create policy "templates_insert_own" on public.templates
for insert with check (auth.uid() = owner_id);

create policy "templates_update_own" on public.templates
for update using (auth.uid() = owner_id);

create policy "templates_delete_own" on public.templates
for delete using (auth.uid() = owner_id);

-- Stripe linkage
create table if not exists public.billing_customers (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

alter table public.billing_customers enable row level security;
create policy "billing_customers_select_own" on public.billing_customers
for select using (auth.uid() = owner_id);
create policy "billing_customers_insert_own" on public.billing_customers
for insert with check (auth.uid() = owner_id);
create policy "billing_customers_update_own" on public.billing_customers
for update using (auth.uid() = owner_id);

create table if not exists public.subscriptions (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  stripe_subscription_id text unique,
  status text,
  price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
create policy "subscriptions_select_own" on public.subscriptions
for select using (auth.uid() = owner_id);

-- service role updates subscriptions, but allow user to upsert placeholder rows for themselves
create policy "subscriptions_insert_own" on public.subscriptions
for insert with check (auth.uid() = owner_id);

create policy "subscriptions_update_own" on public.subscriptions
for update using (auth.uid() = owner_id);
