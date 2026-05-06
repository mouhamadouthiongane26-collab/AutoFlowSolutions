import { BrainCircuit, ChartNoAxesCombined, LifeBuoy, Network, Workflow } from "lucide-react";
import { PackLeadForm } from "@/components/pack-lead-form";
import { SolutionDetailPage } from "@/components/solution-detail-page";

const features = [
  {
    title: "Agents IA avancés",
    points: ["IA conversationnelle", "Analyse intelligente", "Assistance automatisée", "Génération de contenu"],
    icon: BrainCircuit
  },
  {
    title: "Automatisations complexes",
    points: ["Workflows avancés", "Processus métier", "Intégrations multiples", "APIs avancées"],
    icon: Workflow
  },
  {
    title: "Dashboards & analytics",
    points: ["Reporting temps réel", "Visualisation des données", "KPIs", "Suivi des performances"],
    icon: ChartNoAxesCombined
  },
  {
    title: "Systèmes sur mesure",
    points: ["Développement personnalisé", "Automatisation complète", "Architecture évolutive", "Solutions adaptées"],
    icon: Network
  },
  {
    title: "Accompagnement",
    points: ["Support", "Maintenance", "Optimisations", "Évolution du système"],
    icon: LifeBuoy
  }
];

const premiumFields = [
  { name: "name", label: "Nom", required: true },
  { name: "company", label: "Entreprise", required: true },
  { name: "activity", label: "Activité", required: true },
  { type: "select" as const, name: "company_size", label: "Taille de l’entreprise", required: true, options: ["Solo / indépendant", "2 à 10 personnes", "11 à 50 personnes", "50+ personnes"] },
  { type: "textarea" as const, name: "main_needs", label: "Besoins principaux", placeholder: "Expliquez les enjeux principaux de votre organisation.", required: true },
  { type: "textarea" as const, name: "desired_automations", label: "Automatisations souhaitées", placeholder: "Décrivez les tâches, processus ou outils à automatiser." },
  { type: "select" as const, name: "ai_need", label: "IA ?", required: true, options: ["Oui", "À étudier", "Non prioritaire"] },
  { type: "select" as const, name: "crm_need", label: "CRM ?", required: true, options: ["Oui", "Déjà existant", "À définir"] },
  { type: "select" as const, name: "users_count", label: "Nombre d’utilisateurs", required: true, options: ["1 à 3", "4 à 10", "11 à 25", "25+"] },
  { type: "select" as const, name: "budget", label: "Budget estimatif", required: true, options: ["2 000 € - 5 000 €", "5 000 € - 10 000 €", "10 000 €+", "À définir"] },
  { type: "email" as const, name: "email", label: "Email", required: true },
  { type: "tel" as const, name: "phone", label: "Téléphone" },
  { type: "textarea" as const, name: "detailed_description", label: "Description détaillée", placeholder: "Ajoutez le contexte, les outils utilisés et vos objectifs prioritaires.", required: true }
];

export default async function PremiumIaPackPage({
  searchParams
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <SolutionDetailPage
      eyebrow="Pack Premium IA"
      title="Créons une infrastructure digitale intelligente"
      description="Des systèmes sur mesure combinant intelligence artificielle, automatisation avancée et intégrations intelligentes pour transformer votre organisation."
      visualLabels={["Agents IA", "Workflows", "KPIs", "CRM", "APIs", "Support"]}
      features={features}
      featuresTitle="Services premium"
      benefitsTitle="Une infrastructure digitale pour accélérer votre croissance"
      benefits={["Automatisation avancée", "Pilotage complet", "Système évolutif", "Décisions plus rapides", "Accompagnement stratégique"]}
      finalCta={{
        title: "Réservez un échange stratégique",
        description: "La page est prête pour une intégration Calendly, Google Calendar ou un système de réservation custom.",
        label: "Réserver un échange",
        href: "#lead-form"
      }}
    >
      <PackLeadForm
        title="Qualifier votre projet Premium IA"
        description="Ce formulaire prépare un appel utile : contexte, besoins, budget, outils à connecter et niveau d’automatisation attendu."
        pack="Pack Premium IA"
        redirectTo="/offres/pack-premium-ia"
        sent={params.sent === "1"}
        error={params.error}
        fields={premiumFields}
        submitLabel="Envoyer ma demande premium"
      />
    </SolutionDetailPage>
  );
}
