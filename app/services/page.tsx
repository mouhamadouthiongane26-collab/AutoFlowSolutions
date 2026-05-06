import Link from "next/link";
import { ArrowRight, Bot, CalendarClock, FileSignature, FileText, Globe, Workflow } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getTextMap, textValue } from "@/lib/data";
import { defaultTextValues } from "@/lib/defaults";
import { CreationSiteCard } from "./creation-site-card";

type ServiceItem = {
  titre: string;
  texte: string;
};

const automationCard = {
  titre: "Automatisation",
  texte: "Solutions intelligentes pour automatiser vos tâches, connecter vos outils et améliorer la gestion de votre activité.",
  href: "/automatisation",
  icon: Bot
};

const serviceSolutionCards = {
  appointment: {
    titre: "Prise de rendez-vous automatisée",
    texte:
      "Systèmes intelligents permettant aux clients de réserver automatiquement un rendez-vous, recevoir des confirmations et centraliser les demandes sans intervention manuelle.",
    href: "/prise-rendez-vous-automatisee",
    icon: CalendarClock
  },
  documents: {
    titre: "Génération automatique de devis & documents",
    texte:
      "Création automatique de devis, PDF, formulaires et documents professionnels à partir des informations clients.",
    href: "/devis-documents-automatises",
    icon: FileSignature
  }
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseServiceItems(raw?: string) {
  if (!raw) {
    return [];
  }

  try {
    const items = JSON.parse(raw);

    if (!Array.isArray(items)) {
      return [];
    }

    return items.flatMap((item): ServiceItem[] => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const titre = typeof item.titre === "string" ? item.titre.trim() : "";
      const texte = typeof item.texte === "string" ? item.texte.trim() : "";

      return titre && texte ? [{ titre, texte }] : [];
    });
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const texts = await getTextMap();
  const cmsServices = parseServiceItems(texts["services.items"]);
  const fallbackServices = parseServiceItems(defaultTextValues["services.items"]);
  const services = cmsServices.length > 0 ? cmsServices : fallbackServices;
  const icons = [Globe, Bot, FileText, Workflow];

  return (
    <PublicShell>
      <section className="mesh-bg section">
        <div className="max-w-3xl">
          <p className="eyebrow">Services</p>
          <h1 className="gradient-text mt-4 text-4xl font-bold">{textValue(texts, "services.intro.titre")}</h1>
          <p className="mt-5 text-lg leading-8 text-slatecopy">{textValue(texts, "services.intro.texte")}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            const normalizedTitle = normalizeText(service.titre);
            const isCreationSite = normalizedTitle.includes("creation de site");
            const isAutomation = normalizedTitle.includes("automatisation");
            const isAppointment = normalizedTitle.includes("prise de rendez-vous") || normalizedTitle.includes("devis automatique");
            const isDocumentGeneration =
              normalizedTitle.includes("generation automatique de devis") ||
              normalizedTitle.includes("documents") ||
              normalizedTitle.includes("integrations") ||
              normalizedTitle.includes("n8n");

            if (isCreationSite) {
              return <CreationSiteCard key={service.titre} titre={service.titre} texte={service.texte} />;
            }

            if (isAutomation) {
              return <ServiceSolutionCard key={service.titre} card={automationCard} cta="Découvrir les solutions" />;
            }

            if (isAppointment) {
              return <ServiceSolutionCard key={service.titre} card={serviceSolutionCards.appointment} cta="Découvrir la solution" />;
            }

            if (isDocumentGeneration) {
              return <ServiceSolutionCard key={service.titre} card={serviceSolutionCards.documents} cta="Découvrir la solution" />;
            }

            return (
            <article key={service.titre} className="glass-card p-6 transition duration-300 hover:-translate-y-1 hover:border-pulse/40">
              <Icon className="text-pulse" size={28} />
              <h2 className="mt-5 text-xl font-bold">{service.titre}</h2>
              <p className="mt-3 leading-7 text-slatecopy">{service.texte}</p>
            </article>
          )})}
        </div>
      </section>
    </PublicShell>
  );
}

function ServiceSolutionCard({
  card,
  cta
}: {
  card: {
    titre: string;
    texte: string;
    href: string;
    icon: typeof Bot;
  };
  cta: string;
}) {
  const Icon = card.icon;

  return (
    <Link href={card.href} className="service-solution-card group">
      <Icon className="service-solution-icon text-pulse" size={28} aria-hidden="true" />
      <h2 className="mt-5 text-xl font-bold text-white">{card.titre}</h2>
      <p className="mt-3 leading-7 text-slatecopy">{card.texte}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pulse transition duration-300 group-hover:gap-3">
        {cta}
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
