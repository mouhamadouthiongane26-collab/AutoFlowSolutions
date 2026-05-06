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
  "services.items": "[{\"titre\":\"Création de site\",\"texte\":\"Site vitrine ou plateforme complète, responsive, rapide et modifiable depuis un dashboard.\"},{\"titre\":\"Automatisation\",\"texte\":\"Solutions intelligentes pour automatiser vos tâches, connecter vos outils et améliorer la gestion de votre activité.\"},{\"titre\":\"Prise de rendez-vous automatisée\",\"texte\":\"Systèmes intelligents permettant aux clients de réserver automatiquement un rendez-vous, recevoir des confirmations et centraliser les demandes sans intervention manuelle.\"},{\"titre\":\"Génération automatique de devis & documents\",\"texte\":\"Création automatique de devis, PDF, formulaires et documents professionnels à partir des informations clients.\"}]",
  "automation.intro.titre": "Automatiser sans perdre la relation humaine",
  "automation.intro.texte": "Un client envoie une demande, le système collecte les informations, répond automatiquement, prépare un devis et alerte votre équipe au bon moment.",
  "home.automation.points": "[\"Orchestration, données et réponses reliées en temps réel\",\"Formulaires, CRM et notifications connectés\",\"Réponses client rapides avec contrôle humain\"]",
  "automation.steps": "[{\"titre\":\"Demande reçue\",\"texte\":\"Le formulaire ou WhatsApp capte le besoin client.\"},{\"titre\":\"Analyse automatique\",\"texte\":\"Les informations sont structurées pour identifier le bon service.\"},{\"titre\":\"Devis préparé\",\"texte\":\"Le système génère une base de devis ou une fiche de qualification.\"},{\"titre\":\"Équipe alertée\",\"texte\":\"Vous recevez une notification claire et exploitable.\"}]",
  "contact.intro.titre": "Parlez-nous de votre projet",
  "contact.intro.texte": "Décrivez votre besoin et nous vous répondrons avec une recommandation claire, adaptée à votre activité.",
  "contact.note.titre": "Ce formulaire est connecté à Tally.",
  "contact.note.texte": "Les demandes sont envoyées via votre formulaire de qualification.",
  "contact.form.url": "https://tally.so/embed/zxWgaM?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
  "offres.page.titre": "Des solutions pensées pour automatiser et développer votre activité",
  "offres.page.texte": "Des systèmes modernes combinant automatisation, intelligence artificielle, création de site et intégrations intelligentes pour simplifier votre organisation et accélérer votre croissance.",
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
    prix: "À partir de 490 €",
    description: "L’essentiel pour lancer une présence professionnelle moderne avec des premiers outils automatisés."
  },
  {
    id: "business",
    titre: "Pack Business Automation",
    prix: "À partir de 990 €",
    description: "Une solution complète pour automatiser vos échanges, centraliser vos demandes et gagner un temps considérable."
  },
  {
    id: "premium",
    titre: "Pack Premium IA",
    prix: "Sur devis personnalisé",
    description: "Une infrastructure digitale intelligente conçue pour automatiser votre activité et accélérer votre croissance."
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
