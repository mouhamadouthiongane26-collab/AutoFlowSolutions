-- AutoFlow Solutions - Supabase schema
-- Execute this file in the Supabase SQL editor before deploying.

create extension if not exists "pgcrypto";

create table if not exists public.site_sections (
  id text primary key,
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  price text not null,
  description text not null,
  features text[] not null default '{}',
  sort_order integer not null default 99,
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id text primary key default gen_random_uuid()::text,
  type text not null check (type in ('image', 'video')),
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_sections_updated_at on public.site_sections;
create trigger set_site_sections_updated_at
before update on public.site_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_offers_updated_at on public.offers;
create trigger set_offers_updated_at
before update on public.offers
for each row execute function public.set_updated_at();

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.site_sections enable row level security;
alter table public.offers enable row level security;
alter table public.articles enable row level security;
alter table public.media enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read site sections" on public.site_sections;
create policy "Public can read site sections" on public.site_sections for select using (true);
drop policy if exists "Admins manage site sections" on public.site_sections;
create policy "Admins manage site sections" on public.site_sections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public can read offers" on public.offers;
create policy "Public can read offers" on public.offers for select using (true);
drop policy if exists "Admins manage offers" on public.offers;
create policy "Admins manage offers" on public.offers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles" on public.articles for select using (published = true or auth.role() = 'authenticated');
drop policy if exists "Admins manage articles" on public.articles;
create policy "Admins manage articles" on public.articles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public can read media" on public.media;
create policy "Public can read media" on public.media for select using (true);
drop policy if exists "Admins manage media" on public.media;
create policy "Admins manage media" on public.media for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Anyone can send contact message" on public.contact_messages;
create policy "Anyone can send contact message" on public.contact_messages for insert with check (true);
drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages" on public.contact_messages for select using (auth.role() = 'authenticated');

insert into public.site_sections (id, title, body, metadata) values
('home_hero', 'AutoFlow Solutions', 'Nous créons des sites professionnels connectés à des automatisations intelligentes pour transformer vos demandes clients en opportunités traitées rapidement.', '{"cta":"Demander un devis","badge":"Sites web, WhatsApp, IA et automatisation"}'),
('services_intro', 'Des systèmes digitaux qui travaillent avec vous', 'AutoFlow Solutions conçoit des sites modernes, des formulaires connectés, des tunnels de devis et des automatisations WhatsApp ou IA pour réduire les tâches répétitives.', '{}'),
('automation_intro', 'Automatiser sans perdre la relation humaine', 'Un client envoie une demande, le système collecte les informations, répond automatiquement, prépare un devis et alerte votre équipe au bon moment.', '{}'),
('contact_intro', 'Parlez-nous de votre projet', 'Décrivez votre besoin et nous vous répondrons avec une recommandation claire, adaptée à votre activité.', '{}')
on conflict (id) do nothing;

insert into public.offers (id, name, price, description, features, sort_order) values
('starter', 'Pack Starter', '690 EUR', 'L’essentiel pour lancer une présence professionnelle et convertir les premiers prospects.', array['Site vitrine responsive','Formulaire de contact','Pages services et offres','Préparation SEO locale'], 1),
('business', 'Pack Business', '1 490 EUR', 'Un site complet avec gestion de contenu et automatisations pour gagner du temps.', array['Dashboard admin','Articles, galerie et vidéos','Devis automatique','Connexion WhatsApp ou email'], 2),
('premium', 'Pack Premium', 'Sur devis', 'Une plateforme sur mesure avec agent IA, workflows avancés et intégrations métier.', array['Agent IA client','Workflows n8n','CRM et API externes','Accompagnement stratégique'], 3)
on conflict (id) do nothing;

insert into public.articles (id, title, slug, excerpt, content, published) values
('demo-article', 'Pourquoi automatiser les demandes clients ?', 'pourquoi-automatiser-demandes-clients', 'Une réponse rapide augmente la confiance, réduit les pertes de prospects et libère du temps pour les tâches à forte valeur.', 'Les entreprises perdent souvent des opportunités parce que les demandes ne sont pas traitées assez vite. Avec un site connecté, chaque message peut être enregistré, qualifié et transmis automatiquement.', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do nothing;

drop policy if exists "Public can read media bucket" on storage.objects;
create policy "Public can read media bucket" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "Admins upload media bucket" on storage.objects;
create policy "Admins upload media bucket" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists "Admins update media bucket" on storage.objects;
create policy "Admins update media bucket" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists "Admins delete media bucket" on storage.objects;
create policy "Admins delete media bucket" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
