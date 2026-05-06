import type { CSSProperties } from "react";
import { BellRing, CheckCircle2, ContactRound, Globe, LayoutDashboard, SearchCheck, Send, Server, Sparkles, Smartphone, TableProperties } from "lucide-react";
import { PackLeadForm } from "@/components/pack-lead-form";
import { PublicShell } from "@/components/public-shell";

const packItems = [
  "Site vitrine moderne",
  "Responsive mobile",
  "Formulaire intelligent",
  "SEO de base",
  "Hébergement & domaine",
  "Notifications automatiques",
  "Centralisation des demandes",
  "Suivi simplifié des contacts"
];

const explanations = [
  {
    title: "Site vitrine moderne",
    description: "Création d’un site professionnel moderne permettant de présenter votre activité, vos services et vos informations de contact.",
    icon: Globe
  },
  {
    title: "Responsive mobile",
    description: "Votre site s’adapte automatiquement aux téléphones, tablettes et ordinateurs pour une expérience fluide sur tous les supports.",
    icon: Smartphone
  },
  {
    title: "Formulaire intelligent",
    description: "Mise en place d’un formulaire moderne permettant de récupérer automatiquement les demandes de vos clients.",
    icon: TableProperties
  },
  {
    title: "SEO de base",
    description: "Optimisation des éléments essentiels de votre site afin d’améliorer sa visibilité sur Google.",
    icon: SearchCheck
  },
  {
    title: "Hébergement & domaine",
    description: "Mise en ligne sécurisée du site avec connexion au nom de domaine et hébergement professionnel.",
    icon: Server
  },
  {
    title: "Notifications automatiques",
    description: "Réception automatique des nouvelles demandes par email ou notification afin de répondre rapidement à vos prospects.",
    icon: BellRing
  },
  {
    title: "Centralisation des demandes",
    description: "Les demandes clients sont automatiquement regroupées dans un espace organisé et facile à consulter afin d’améliorer le suivi et la réactivité.",
    icon: LayoutDashboard
  },
  {
    title: "Suivi simplifié des contacts",
    description: "Les informations essentielles des prospects et demandes sont enregistrées automatiquement pour faciliter l’organisation quotidienne.",
    icon: ContactRound
  }
];

const starterFields = [
  { name: "name", label: "Nom / prénom", required: true },
  { name: "company", label: "Entreprise" },
  { name: "activity", label: "Activité", required: true },
  { type: "tel" as const, name: "phone", label: "Téléphone" },
  { type: "email" as const, name: "email", label: "Email", required: true },
  { type: "select" as const, name: "need_type", label: "Type de projet", required: true, options: ["Création de site", "Refonte de site", "Site + formulaire", "Site + automatisation simple"] },
  { type: "select" as const, name: "budget", label: "Budget estimatif", required: true, options: ["Moins de 500 €", "500 € - 1 000 €", "1 000 € - 2 000 €", "À définir"] },
  { type: "textarea" as const, name: "project_description", label: "Description du besoin", placeholder: "Présentez votre activité, vos objectifs et les informations importantes pour préparer un devis clair.", required: true }
];

export default async function StarterPackPage({
  searchParams
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <PublicShell>
      <section className="starter-experience mesh-bg section">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="automation-reveal max-w-3xl">
            <p className="eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              Pack Starter
            </p>
            <h1 className="gradient-text mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Lancez votre présence professionnelle simplement
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slatecopy">
              Une solution idéale pour démarrer avec un site moderne, rapide et professionnel accompagné d’outils simples pour mieux gérer vos demandes.
            </p>
          </div>
          <StarterHeroVisual />
        </div>

        <section className="starter-pack-panel automation-reveal mt-14">
          <div className="max-w-2xl">
            <p className="eyebrow">Contenu du pack</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Tout le nécessaire pour démarrer proprement</h2>
          </div>
          <div className="starter-pack-grid">
            {packItems.map((item, index) => (
              <div key={item} className="starter-pack-item" style={{ "--delay": `${index * 70}ms` } as CSSProperties}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="automation-reveal max-w-3xl">
            <p className="eyebrow">Explications</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Ce que chaque élément apporte à votre activité</h2>
            <p className="mt-4 leading-7 text-slatecopy">
              Le Pack Starter concentre les bases importantes : visibilité, contact, organisation et premiers automatismes.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {explanations.map((item, index) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="automation-card automation-reveal" style={{ "--delay": `${index * 80}ms` } as CSSProperties}>
                  <div className="automation-icon">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold leading-tight text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slatecopy">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <PackLeadForm
          title="Prêt à lancer votre projet ?"
          description="Remplissez ce formulaire pour recevoir une recommandation claire. La structure est prête pour l’envoi automatique, le stockage des demandes et les notifications."
          pack="Pack Starter"
          redirectTo="/offres/pack-starter"
          sent={params.sent === "1"}
          error={params.error}
          fields={starterFields}
          submitLabel="Envoyer ma demande"
        />
      </section>
    </PublicShell>
  );
}

function StarterHeroVisual() {
  return (
    <div className="starter-hero-visual automation-reveal" aria-hidden="true">
      <div className="starter-orbit">
        {["Site", "Mobile", "SEO", "Formulaire", "Demandes", "Contacts"].map((item, index) => (
          <span key={item} className="starter-orbit-node" style={{ "--delay": `${index * 110}ms` } as CSSProperties}>
            {item}
          </span>
        ))}
      </div>
      <div className="starter-visual-core">
        <Send size={30} />
      </div>
    </div>
  );
}
