# AutoFlowSolutions

Site Next.js professionnel avec espace administrateur sécurisé, contenus dynamiques et Supabase pour l’authentification, la base de données et l’upload de médias.

## Fonctionnalités

- Pages publiques : accueil, services, offres, automatisation, contact et articles.
- Admin `/admin` : connexion, création de compte, protection des routes.
- Dashboard : textes du site, offres/prix, articles, médias et messages clients.
- Formulaire de contact connecté à Supabase.
- Structure prête pour n8n, WhatsApp API, agent IA et génération de devis.
- Séparation claire : le développeur garde le code, l’administrateur modifie seulement les contenus Supabase.

## Installation

```bash
npm install
npm run dev
```

Créez ensuite `.env.local` à partir de `.env.example` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Configuration Supabase

1. Créez un projet Supabase.
2. Exécutez `supabase/schema.sql` dans le SQL Editor du même projet que `NEXT_PUBLIC_SUPABASE_URL`.
3. Créez votre compte via `/admin/register`.
4. Dans Supabase SQL Editor, donnez le rôle développeur/admin à votre compte :

```sql
update public.profiles
set role = 'admin'
where id = '<auth-user-id>';
```

5. Vérifiez que le bucket Storage `media` existe et est public. Si l'upload affiche `Bucket not found`, relancez la partie `insert into storage.buckets` et les politiques `storage.objects` à la fin de `supabase/schema.sql`.

Si Supabase affiche `Could not find the table 'public.media' in the schema cache`, vérifiez que le SQL a été exécuté sur le bon projet, puis relancez :

```sql
notify pgrst, 'reload schema';
```

Pour corriger uniquement l’erreur `public.media`, vous pouvez aussi exécuter le fichier court :

```sql
-- Supabase SQL Editor
-- copier/coller le contenu de supabase/fix-media-schema-cache.sql
```

Version courte à copier-coller directement si l’erreur persiste :

```sql
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
```

## Modèle de contenu

Le site public lit le contenu depuis Supabase :

- `textes` : `id`, `titre`, `contenu`, `created_at`.
- `offres` : titre, prix, description.
- `articles` : titre, contenu, image_url.
- `media` : url, type.
- `messages` : nom, email, message.

Les politiques RLS autorisent la lecture publique des contenus et l’envoi public des messages. Toutes les modifications du CMS sont réservées au rôle `admin`.

## Déploiement Vercel

Ajoutez les variables d’environnement Supabase dans Vercel, puis déployez le projet. Le client utilisera uniquement `/admin` pour modifier les contenus, sans accès au code.
