export type SiteSection = {
  id: string;
  title: string;
  body: string;
  metadata?: Record<string, string>;
};

export type Offer = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  sort_order: number;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at?: string;
};

export type MediaItem = {
  id: string;
  type: "image" | "video";
  title: string;
  url: string;
  created_at?: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
};

export const defaultSections: SiteSection[] = [
  {
    id: "home_hero",
    title: "AutoFlowSolutions",
    body: "Nous créons des sites professionnels connectés à des automatisations intelligentes pour transformer vos demandes clients en opportunités traitées rapidement.",
    metadata: {
      cta: "Demander un devis",
      badge: "Sites web, WhatsApp, IA et automatisation"
    }
  },
  {
    id: "services_intro",
    title: "Des systèmes digitaux qui travaillent avec vous",
    body: "AutoFlowSolutions conçoit des sites modernes, des formulaires connectés, des tunnels de devis et des automatisations WhatsApp ou IA pour réduire les tâches répétitives."
  },
  {
    id: "automation_intro",
    title: "Automatiser sans perdre la relation humaine",
    body: "Un client envoie une demande, le système collecte les informations, répond automatiquement, prépare un devis et alerte votre équipe au bon moment."
  },
  {
    id: "contact_intro",
    title: "Parlez-nous de votre projet",
    body: "Décrivez votre besoin et nous vous répondrons avec une recommandation claire, adaptée à votre activité."
  }
];

export const defaultOffers: Offer[] = [
  {
    id: "starter",
    name: "Pack Starter",
    price: "690 EUR",
    description: "L’essentiel pour lancer une présence professionnelle et convertir les premiers prospects.",
    features: ["Site vitrine responsive", "Formulaire de contact", "Pages services et offres", "Préparation SEO locale"],
    sort_order: 1
  },
  {
    id: "business",
    name: "Pack Business",
    price: "1 490 EUR",
    description: "Un site complet avec gestion de contenu et automatisations pour gagner du temps.",
    features: ["Dashboard admin", "Articles, galerie et vidéos", "Devis automatique", "Connexion WhatsApp ou email"],
    sort_order: 2
  },
  {
    id: "premium",
    name: "Pack Premium",
    price: "Sur devis",
    description: "Une plateforme sur mesure avec agent IA, workflows avancés et intégrations métier.",
    features: ["Agent IA client", "Workflows n8n", "CRM et API externes", "Accompagnement stratégique"],
    sort_order: 3
  }
];

export const defaultArticles: Article[] = [
  {
    id: "demo-article",
    title: "Pourquoi automatiser les demandes clients ?",
    slug: "pourquoi-automatiser-demandes-clients",
    excerpt: "Une réponse rapide augmente la confiance, réduit les pertes de prospects et libère du temps pour les tâches à forte valeur.",
    content: "Les entreprises perdent souvent des opportunités parce que les demandes ne sont pas traitées assez vite. Avec un site connecté, chaque message peut être enregistré, qualifié et transmis automatiquement. L’équipe garde le contrôle, mais le système absorbe les tâches répétitives : confirmation de réception, collecte d’informations, préparation de devis et relance.",
    image_url: null,
    published: true
  }
];

export const defaultMedia: MediaItem[] = [
  {
    id: "video-demo",
    type: "video",
    title: "Présentation automatisation",
    url: "/Design sans titre (1).mp4"
  }
];
