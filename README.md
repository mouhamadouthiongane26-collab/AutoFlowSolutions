# AutoFlowSolutions

Site Next.js professionnel avec espace administrateur sécurisé, contenus dynamiques et Supabase pour l’authentification, la base de données et l’upload d’images.

## Fonctionnalités

- Pages publiques : accueil, services, offres, automatisation, contact et articles.
- Admin `/admin` : connexion, création de compte, protection des routes.
- Dashboard : textes du site, offres/prix, articles, images, vidéos et messages clients.
- Formulaire de contact connecté à Supabase.
- Structure prête pour n8n, WhatsApp API, agent IA et génération de devis.

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
2. Exécutez `supabase/schema.sql` dans le SQL Editor.
3. Vérifiez que le bucket Storage `media` existe et est public.
4. Créez le premier administrateur via `/admin/register`.

Les politiques RLS autorisent la lecture publique des contenus publiés, l’envoi public des messages de contact et la gestion complète seulement pour les utilisateurs authentifiés.

## Déploiement Vercel

Ajoutez les variables d’environnement Supabase dans Vercel, puis déployez le projet. Le client utilisera uniquement `/admin` pour modifier les contenus, sans accès au code.
