import { FileCheck2, FileText, FormInput, Workflow } from "lucide-react";
import { SolutionDetailPage } from "@/components/solution-detail-page";

const features = [
  {
    title: "Devis automatiques",
    points: ["Calcul intelligent des tarifs", "Génération instantanée", "PDF professionnels", "Envoi automatique"],
    icon: FileCheck2
  },
  {
    title: "Collecte des informations",
    points: ["Formulaires intelligents", "Qualification des besoins", "Centralisation des données", "Informations structurées"],
    icon: FormInput
  },
  {
    title: "Documents automatisés",
    points: ["Contrats", "Factures", "Rapports", "Comptes rendus"],
    icon: FileText
  },
  {
    title: "Automatisation complète",
    points: ["Workflows n8n", "Intégrations API", "Connexion CRM", "Notifications automatiques"],
    icon: Workflow
  }
];

export default function AutomatedDocumentsPage() {
  return (
    <SolutionDetailPage
      eyebrow="Documents"
      title="Automatisez la création de vos devis et documents"
      description="Transformez automatiquement les informations de vos clients en devis professionnels, PDF, formulaires ou documents structurés sans perdre de temps dans les tâches répétitives."
      visualLabels={["Formulaire", "Tarifs", "Devis", "PDF", "CRM", "Envoi"]}
      features={features}
      benefitsTitle="Les bénéfices pour votre activité"
      benefits={["Gain de temps", "Réduction des erreurs", "Documents professionnels", "Réactivité améliorée", "Processus plus rapide"]}
    />
  );
}
