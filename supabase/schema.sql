-- StrtDigital — Supabase schema (run once in the Supabase SQL editor).
--
-- Covers all four admin-editable areas:
--   1. profiles        — team members + KPI targets (mirrors the `User` type)
--   2. site_content    — editable marketing/website content (key → JSON)
--   3. leads           — CRM leads (activity + stage history kept as JSONB)
--   4. expenses        — expenses, with receipts stored in Supabase Storage
--
-- Security model: this is an invite-only internal tool, so every *authenticated*
-- user has full access to the CRM tables. The marketing site is public, so the
-- `site_content` table allows anonymous SELECT (read) but only authenticated
-- writes. Public signup is disabled in Auth settings.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. profiles  (one row per auth user; auto-created on signup)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  name         text not null default '',
  email        text not null default '',
  role         text not null default 'Member',
  avatar_color text not null default '#14B8C4',
  -- UserTargets: { leads, won, revenue, conversion }
  targets      jsonb not null default '{"leads":0,"won":0,"revenue":0,"conversion":0}'::jsonb,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Authenticated users can read all profiles (team list) and manage them.
create policy "profiles: authenticated read"
  on public.profiles for select to authenticated using (true);
create policy "profiles: authenticated insert"
  on public.profiles for insert to authenticated with check (true);
create policy "profiles: authenticated update"
  on public.profiles for update to authenticated using (true) with check (true);
create policy "profiles: authenticated delete"
  on public.profiles for delete to authenticated using (true);

-- Auto-create a profile row whenever a new auth user is added.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,''), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. site_content  (editable marketing content — one row per section)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.site_content (
  key        text primary key,          -- 'hero' | 'services' | 'faqs' | ...
  value      jsonb not null,            -- the section's content (shape matches content.ts)
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_content enable row level security;

-- Public marketing site can READ content; only authenticated admins can write.
create policy "site_content: public read"
  on public.site_content for select to anon, authenticated using (true);
create policy "site_content: authenticated write insert"
  on public.site_content for insert to authenticated with check (true);
create policy "site_content: authenticated write update"
  on public.site_content for update to authenticated using (true) with check (true);
create policy "site_content: authenticated delete"
  on public.site_content for delete to authenticated using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. leads
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default '',
  company       text not null default '',
  email         text not null default '',
  phone         text not null default '',
  source        text not null default 'Website',
  value         numeric not null default 0,
  stage         text not null default 'new',
  owner_id      uuid references public.profiles(id) on delete set null,
  notes         text not null default '',
  activity      jsonb not null default '[]'::jsonb,  -- ActivityEntry[]
  stage_history jsonb not null default '[]'::jsonb,  -- StageEvent[]
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "leads: authenticated all"
  on public.leads for all to authenticated using (true) with check (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. expenses  (receipts live in the private `receipts` storage bucket)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.expenses (
  id           uuid primary key default gen_random_uuid(),
  date         date not null default current_date,
  category     text not null default 'Other',
  vendor       text not null default '',
  amount       numeric not null default 0,
  description  text not null default '',
  receipt_path text,                 -- object path in the `receipts` bucket
  receipt_name text,
  receipt_size integer,
  lead_id      uuid references public.leads(id) on delete set null,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "expenses: authenticated all"
  on public.expenses for all to authenticated using (true) with check (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Storage buckets
-- ─────────────────────────────────────────────────────────────────────────────
-- Private receipts bucket (viewed via short-lived signed URLs in the app).
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- Public avatars bucket (profile images).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Receipts: only authenticated users can read/write objects.
create policy "receipts: authenticated read"
  on storage.objects for select to authenticated
  using (bucket_id = 'receipts');
create policy "receipts: authenticated write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'receipts');
create policy "receipts: authenticated update"
  on storage.objects for update to authenticated
  using (bucket_id = 'receipts');
create policy "receipts: authenticated delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'receipts');

-- Avatars: public read, authenticated write.
create policy "avatars: public read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'avatars');
create policy "avatars: authenticated write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars');
create policy "avatars: authenticated update"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars');
create policy "avatars: authenticated delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars');
