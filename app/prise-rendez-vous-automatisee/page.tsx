import { BellRing, CalendarCheck, Clock3, LayoutDashboard } from "lucide-react";
import { SolutionDetailPage } from "@/components/solution-detail-page";

const features = [
  {
    title: "Réservation automatique",
    points: ["Réservation en ligne 24h/24", "Formulaires intelligents", "Qualification des demandes", "Gestion des disponibilités"],
    icon: CalendarCheck
  },
  {
    title: "Confirmations & rappels",
    points: ["Emails automatiques", "Messages WhatsApp automatiques", "Rappels de rendez-vous", "Réduction des oublis"],
    icon: BellRing
  },
  {
    title: "Synchronisation calendrier",
    points: ["Google Calendar", "Outlook", "Synchronisation temps réel", "Gestion automatique des créneaux"],
    icon: Clock3
  },
  {
    title: "Centralisation des demandes",
    points: ["Historique client", "Suivi des rendez-vous", "Notifications automatiques", "Dashboard de gestion"],
    icon: LayoutDashboard
  }
];

export default function AppointmentAutomationPage() {
  return (
    <SolutionDetailPage
      eyebrow="Rendez-vous"
      title="Automatisez entièrement vos prises de rendez-vous"
      description="Mettez en place un système intelligent capable de gérer automatiquement vos réservations, confirmations et rappels afin de simplifier l’organisation de votre activité et améliorer l’expérience client."
      visualLabels={["Réservation", "Confirmation", "Rappel", "Agenda", "Client", "Dashboard"]}
      features={features}
      benefitsTitle="Pourquoi automatiser vos rendez-vous ?"
      benefits={[
        "Gain de temps considérable",
        "Réduction des rendez-vous oubliés",
        "Disponibilité 24h/24",
        "Meilleure organisation",
        "Expérience client plus professionnelle"
      ]}
    />
  );
}
