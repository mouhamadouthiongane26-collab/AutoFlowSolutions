export type UserRole = "admin" | "client";

export type TextItem = {
  id: string;
  titre: string;
  contenu: string;
  created_at?: string;
};

export type Offer = {
  id: string;
  titre: string;
  prix: string;
  description: string;
  created_at?: string;
  updated_at?: string;
};

export type Article = {
  id: string;
  titre: string;
  contenu: string;
  image_url: string | null;
  created_at?: string;
};

export type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  created_at?: string;
};

export type ContactMessage = {
  id: string;
  nom: string;
  email: string;
  message: string;
  created_at: string;
};

export const defaultTextValues: Record<string, string> = {
  "site.meta.titre": "AutoFlowSolutions | Sites web et automatisation",
  "site.meta.description": "Création de sites professionnels, automatisation WhatsApp, IA, devis automatique et dashboard administrable.",
  "home.hero.titre": "AutoFlowSolutions",
  "home.hero.texte": "Nous créons des sites professionnels connectés à des automatisations intelligentes pour transformer vos demandes clients en opportunités traitées rapidement.",
  "services.intro.titre": "Des systèmes digitaux qui travaillent avec vous",
  "services.intro.texte": "AutoFlowSolutions conçoit des sites modernes, des formulaires connectés, des tunnels de devis et des automatisations WhatsApp ou IA pour réduire les tâches répétitives.",
  "services.items": "[{\"titre\":\"Création de site\",\"texte\":\"Site vitrine ou plateforme complète, responsive, rapide et modifiable depuis un dashboard.\"},{\"titre\":\"Automatisation WhatsApp\",\"texte\":\"Réponses automatiques, collecte d’informations, alertes et suivi des prospects.\"},{\"titre\":\"Devis automatique\",\"texte\":\"Qualification des besoins et génération de demandes structurées pour gagner du temps.\"},{\"titre\":\"Intégrations IA et n8n\",\"texte\":\"Workflows évolutifs pour connecter formulaires, CRM, emails, WhatsApp et agents IA.\"}]",
  "automation.intro.titre": "Automatiser sans perdre la relation humaine",
  "automation.intro.texte": "Un client envoie une demande, le système collecte les informations, répond automatiquement, prépare un devis et alerte votre équipe au bon moment.",
  "home.automation.points": "[\"Orchestration, données et réponses reliées en temps réel\",\"Formulaires, CRM et notifications connectés\",\"Réponses client rapides avec contrôle humain\"]",
  "automation.steps": "[{\"titre\":\"Demande reçue\",\"texte\":\"Le formulaire ou WhatsApp capte le besoin client.\"},{\"titre\":\"Analyse automatique\",\"texte\":\"Les informations sont structurées pour identifier le bon service.\"},{\"titre\":\"Devis préparé\",\"texte\":\"Le système génère une base de devis ou une fiche de qualification.\"},{\"titre\":\"Équipe alertée\",\"texte\":\"Vous recevez une notification claire et exploitable.\"}]",
  "contact.intro.titre": "Parlez-nous de votre projet",
  "contact.intro.texte": "Décrivez votre besoin et nous vous répondrons avec une recommandation claire, adaptée à votre activité.",
  "contact.note.titre": "Ce formulaire est connecté à Tally.",
  "contact.note.texte": "Les demandes sont envoyées via votre formulaire de qualification.",
  "contact.form.url": "https://tally.so/embed/zxWgaM?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
  "offres.page.titre": "Choisissez le niveau d’accompagnement adapté",
  "offres.page.texte": "Chaque pack peut évoluer avec vos besoins : site administrable, contenus dynamiques, automatisation, WhatsApp, IA et génération de devis.",
  "home.offres.titre": "Des packs clairs, évolutifs",
  "home.medias.titre": "Photos et vidéos ajoutées depuis l’admin",
  "stats.items": "[{\"valeur\":\"24/7\",\"label\":\"réponse automatique\"},{\"valeur\":\"-40%\",\"label\":\"temps administratif\"},{\"valeur\":\"100%\",\"label\":\"contenu administrable\"}]",
  "footer.texte": "Sites web administrables, automatisations WhatsApp, agents IA et systèmes de devis pour entreprises ambitieuses.",
  "footer.slogan": "Automatisez. Gérez. Développez."
};

export const defaultOffers: Offer[] = [
  {
    id: "starter",
    titre: "Pack Starter",
    prix: "690 EUR",
    description: "L’essentiel pour lancer une présence professionnelle et convertir les premiers prospects."
  },
  {
    id: "business",
    titre: "Pack Business",
    prix: "1 490 EUR",
    description: "Un site complet avec gestion de contenu et automatisations pour gagner du temps."
  },
  {
    id: "premium",
    titre: "Pack Premium",
    prix: "Sur devis",
    description: "Une plateforme sur mesure avec agent IA, workflows avancés et intégrations métier."
  }
];

export const defaultArticles: Article[] = [
  {
    id: "demo-article",
    titre: "Pourquoi automatiser les demandes clients ?",
    contenu: "Les entreprises perdent souvent des opportunités parce que les demandes ne sont pas traitées assez vite. Avec un site connecté, chaque message peut être enregistré, qualifié et transmis automatiquement.",
    image_url: null
  }
];
