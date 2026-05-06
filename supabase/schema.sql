-- AutoFlow Solutions CMS schema
-- Run this file in the Supabase SQL Editor for the project used by NEXT_PUBLIC_SUPABASE_URL.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.app_role as enum ('admin', 'client');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'client',
  created_at timestamptz not null default now()
);

create table if not exists public.textes (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  contenu text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.offres (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text not null default '',
  prix text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  contenu text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  type text not null check (type in ('image', 'video')),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  telephone text,
  entreprise text,
  budget text,
  besoin text,
  source text not null default 'Site Web',
  statut text not null default 'Nouveau',
  message text not null,
  created_at timestamptz not null default now()
);

-- Migrations from previous project versions.
alter table public.textes add column if not exists titre text;
alter table public.textes add column if not exists contenu text;
alter table public.articles add column if not exists titre text;
alter table public.articles add column if not exists contenu text;
alter table public.articles add column if not exists image_url text;
alter table public.messages add column if not exists telephone text;
alter table public.messages add column if not exists entreprise text;
alter table public.messages add column if not exists budget text;
alter table public.messages add column if not exists besoin text;
alter table public.messages add column if not exists source text not null default 'Site Web';
alter table public.messages add column if not exists statut text not null default 'Nouveau';
create index if not exists messages_created_at_idx on public.messages (created_at desc);
create index if not exists messages_source_idx on public.messages (source);
create index if not exists messages_statut_idx on public.messages (statut);

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'textes' and column_name = 'cle'
  ) then
    execute 'update public.textes set titre = coalesce(titre, cle)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'textes' and column_name = 'valeur'
  ) then
    execute 'update public.textes set contenu = coalesce(contenu, valeur)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'articles' and column_name = 'title'
  ) then
    execute 'update public.articles set titre = coalesce(titre, title)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'articles' and column_name = 'content'
  ) then
    execute 'update public.articles set contenu = coalesce(contenu, content)';
  end if;

  if to_regclass('public.medias') is not null then
    insert into public.media (url, type, created_at)
    select url, type, created_at
    from public.medias
    where not exists (select 1 from public.media where public.media.url = public.medias.url);
  end if;

  if to_regclass('public.contact_messages') is not null then
    insert into public.messages (nom, email, message, created_at)
    select name, email, message, created_at
    from public.contact_messages
    where not exists (
      select 1
      from public.messages
      where public.messages.email = public.contact_messages.email
        and public.messages.message = public.contact_messages.message
    );
  end if;
end $$;

update public.textes set titre = coalesce(titre, '');
update public.textes set contenu = coalesce(contenu, '');
update public.articles set titre = coalesce(titre, '');
update public.articles set contenu = coalesce(contenu, '');

alter table public.textes alter column titre set not null;
alter table public.textes alter column contenu set not null;
alter table public.articles alter column titre set not null;
alter table public.articles alter column contenu set not null;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'client')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists create_profile_for_new_user on auth.users;
create trigger create_profile_for_new_user
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

insert into public.profiles (id, role)
select id, 'client'
from auth.users
on conflict (id) do nothing;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

alter table public.profiles enable row level security;
alter table public.textes enable row level security;
alter table public.offres enable row level security;
alter table public.articles enable row level security;
alter table public.media enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (id = auth.uid());
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read textes" on public.textes;
create policy "Public can read textes" on public.textes for select using (true);
drop policy if exists "Admins manage textes" on public.textes;
create policy "Admins manage textes" on public.textes for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read offres" on public.offres;
create policy "Public can read offres" on public.offres for select using (true);
drop policy if exists "Admins manage offres" on public.offres;
create policy "Admins manage offres" on public.offres for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read articles" on public.articles;
create policy "Public can read articles" on public.articles for select using (true);
drop policy if exists "Admins manage articles" on public.articles;
create policy "Admins manage articles" on public.articles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read media" on public.media;
create policy "Public can read media" on public.media for select using (true);
drop policy if exists "Admins manage media" on public.media;
create policy "Admins manage media" on public.media for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage messages" on public.messages;
create policy "Admins manage messages" on public.messages for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public can create messages" on public.messages;
create policy "Public can create messages" on public.messages for insert with check (true);

insert into public.textes (titre, contenu)
select *
from (
  values
    ('site.meta.titre', 'AutoFlowSolutions | Sites web et automatisation'),
    ('site.meta.description', 'Création de sites professionnels, automatisation WhatsApp, IA, devis automatique et dashboard administrable.'),
    ('home.hero.titre', 'AutoFlowSolutions'),
    ('home.hero.texte', 'Nous créons des sites professionnels connectés à des automatisations intelligentes pour transformer vos demandes clients en opportunités traitées rapidement.'),
    ('services.intro.titre', 'Des systèmes digitaux qui travaillent avec vous'),
    ('services.intro.texte', 'AutoFlowSolutions conçoit des sites modernes, des formulaires connectés, des tunnels de devis et des automatisations WhatsApp ou IA pour réduire les tâches répétitives.'),
    ('services.items', '[{"titre":"Création de site","texte":"Site vitrine ou plateforme complète, responsive, rapide et modifiable depuis un dashboard."},{"titre":"Automatisation","texte":"Solutions intelligentes pour automatiser vos tâches, connecter vos outils et améliorer la gestion de votre activité."},{"titre":"Prise de rendez-vous automatisée","texte":"Systèmes intelligents permettant aux clients de réserver automatiquement un rendez-vous, recevoir des confirmations et centraliser les demandes sans intervention manuelle."},{"titre":"Génération automatique de devis & documents","texte":"Création automatique de devis, PDF, formulaires et documents professionnels à partir des informations clients."}]'),
    ('automation.intro.titre', 'Automatiser sans perdre la relation humaine'),
    ('automation.intro.texte', 'Un client envoie une demande, le système collecte les informations, répond automatiquement, prépare un devis et alerte votre équipe au bon moment.'),
    ('home.automation.points', '["Orchestration, données et réponses reliées en temps réel","Formulaires, CRM et notifications connectés","Réponses client rapides avec contrôle humain"]'),
    ('automation.steps', '[{"titre":"Demande reçue","texte":"Le formulaire ou WhatsApp capte le besoin client."},{"titre":"Analyse automatique","texte":"Les informations sont structurées pour identifier le bon service."},{"titre":"Devis préparé","texte":"Le système génère une base de devis ou une fiche de qualification."},{"titre":"Équipe alertée","texte":"Vous recevez une notification claire et exploitable."}]'),
    ('contact.intro.titre', 'Parlez-nous de votre projet'),
    ('contact.intro.texte', 'Décrivez votre besoin et nous vous répondrons avec une recommandation claire, adaptée à votre activité.'),
    ('contact.note.titre', 'Ce formulaire est connecté à Tally.'),
    ('contact.note.texte', 'Les demandes sont envoyées via votre formulaire de qualification.'),
    ('contact.form.url', 'https://tally.so/embed/zxWgaM?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1'),
    ('offres.page.titre', 'Des solutions pensées pour automatiser et développer votre activité'),
    ('offres.page.texte', 'Des systèmes modernes combinant automatisation, intelligence artificielle, création de site et intégrations intelligentes pour simplifier votre organisation et accélérer votre croissance.'),
    ('home.offres.titre', 'Des packs clairs, évolutifs'),
    ('home.medias.titre', 'Photos et vidéos ajoutées depuis l’admin'),
    ('stats.items', '[{"valeur":"24/7","label":"réponse automatique"},{"valeur":"-40%","label":"temps administratif"},{"valeur":"100%","label":"contenu administrable"}]'),
    ('footer.texte', 'Sites web administrables, automatisations WhatsApp, agents IA et systèmes de devis pour entreprises ambitieuses.'),
    ('footer.slogan', 'Automatisez. Gérez. Développez.')
) as seed(titre, contenu)
where not exists (select 1 from public.textes where public.textes.titre = seed.titre);

insert into public.offres (titre, prix, description)
select *
from (
  values
    ('Pack Starter', 'À partir de 490 €', 'L’essentiel pour lancer une présence professionnelle moderne avec des premiers outils automatisés.'),
    ('Pack Business Automation', 'À partir de 990 €', 'Une solution complète pour automatiser vos échanges, centraliser vos demandes et gagner un temps considérable.'),
    ('Pack Premium IA', 'Sur devis personnalisé', 'Une infrastructure digitale intelligente conçue pour automatiser votre activité et accélérer votre croissance.')
) as seed(titre, prix, description)
where not exists (select 1 from public.offres);

insert into public.articles (titre, contenu, image_url)
select 'Pourquoi automatiser les demandes clients ?', 'Les entreprises perdent souvent des opportunités parce que les demandes ne sont pas traitées assez vite. Avec un site connecté, chaque message peut être enregistré, qualifié et transmis automatiquement.', null
where not exists (select 1 from public.articles);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read media bucket" on storage.objects;
create policy "Public can read media bucket" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "Admins upload media bucket" on storage.objects;
create policy "Admins upload media bucket" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "Admins update media bucket" on storage.objects;
create policy "Admins update media bucket" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "Admins delete media bucket" on storage.objects;
create policy "Admins delete media bucket" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- Promote your developer account after signup:
-- update public.profiles set role = 'admin' where id = '<auth-user-id>';

notify pgrst, 'reload schema';
