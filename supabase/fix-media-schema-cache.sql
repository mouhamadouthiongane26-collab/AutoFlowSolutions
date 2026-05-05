-- Quick fix for:
-- Could not find the table 'public.media' in the schema cache
--
-- Run this in the Supabase SQL Editor for the same project used by
-- NEXT_PUBLIC_SUPABASE_URL.

create extension if not exists "pgcrypto";

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  type text not null check (type in ('image', 'video')),
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

drop policy if exists "Public can read media" on public.media;
create policy "Public can read media"
on public.media
for select
using (true);

drop policy if exists "Admins manage media" on public.media;
create policy "Admins manage media"
on public.media
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

notify pgrst, 'reload schema';
