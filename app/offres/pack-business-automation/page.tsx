import { BotMessageSquare, FileCheck2, SearchCheck, TableProperties, Workflow } from "lucide-react";
import { SolutionDetailPage } from "@/components/solution-detail-page";

const features = [
  {
    title: "Automatisation WhatsApp",
    points: ["Réponses automatiques", "Qualification des prospects", "Relances clients", "Collecte des informations"],
    icon: BotMessageSquare
  },
  {
    title: "Génération automatique de devis",
    points: ["PDF automatiques", "Calcul intelligent", "Envoi instantané", "Collecte structurée"],
    icon: FileCheck2
  },
  {
    title: "CRM & centralisation",
    points: ["Historique client", "Dashboard", "Notifications", "Suivi des demandes"],
    icon: TableProperties
  },
  {
    title: "Intégrations & workflows",
    points: ["n8n", "APIs", "Synchronisation", "Automatisation métier"],
    icon: Workflow
  },
  {
    title: "SEO & performance",
    points: ["Optimisation Google", "Responsive", "Rapidité", "Structure SEO"],
    icon: SearchCheck
  }
];

export default function BusinessAutomationPackPage() {
  return (
    <SolutionDetailPage
      eyebrow="Le plus choisi"
      title="Automatisation intelligente pour votre activité"
      description="Un système professionnel complet capable d’automatiser vos échanges, centraliser vos outils et améliorer votre organisation grâce à des workflows intelligents."
      visualLabels={["WhatsApp", "Devis", "CRM", "n8n", "SEO", "Dashboard"]}
      features={features}
      benefitsTitle="Pourquoi automatiser votre activité ?"
      benefits={["Gain de temps", "Réduction des tâches répétitives", "Meilleure organisation", "Réactivité améliorée", "Image professionnelle", "Centralisation des données"]}
      workflowSteps={["Client", "Formulaire", "IA", "CRM", "Notifications", "Dashboard"]}
      finalCta={{
        title: "Prêt à automatiser votre activité ?",
        description: "Planifiez un appel pour identifier les automatisations les plus rentables pour votre organisation.",
        label: "Planifier un appel",
        href: "/contact"
      }}
    />
  );
}
