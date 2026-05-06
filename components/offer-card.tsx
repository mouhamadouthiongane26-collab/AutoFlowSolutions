import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import type { Offer } from "@/lib/defaults";

const packDetails = [
  {
    match: "starter",
    title: "Pack Starter",
    price: "À partir de 490 €",
    description: "L’essentiel pour lancer une présence professionnelle moderne avec des premiers outils automatisés.",
    href: "/offres/pack-starter",
    cta: "Demander un devis",
    features: [
      "Site vitrine moderne",
      "Responsive mobile",
      "Formulaire de contact",
      "SEO de base",
      "Hébergement & domaine",
      "Automatisation simple",
      "Intégration WhatsApp",
      "Dashboard simple"
    ]
  },
  {
    match: "business",
    title: "Pack Business Automation",
    price: "À partir de 990 €",
    description: "Une solution complète pour automatiser vos échanges, centraliser vos demandes et gagner un temps considérable.",
    href: "/offres/pack-business-automation",
    cta: "Découvrir l’offre",
    badge: "Le plus choisi",
    features: [
      "Site professionnel complet",
      "Dashboard administrateur",
      "Automatisation WhatsApp",
      "Génération de devis",
      "Emails automatiques",
      "Intégrations API",
      "CRM léger",
      "SEO optimisé",
      "Connexion calendrier"
    ]
  },
  {
    match: "premium",
    title: "Pack Premium IA",
    price: "Sur devis personnalisé",
    description: "Une infrastructure digitale intelligente conçue pour automatiser votre activité et accélérer votre croissance.",
    href: "/offres/pack-premium-ia",
    cta: "Planifier un échange",
    features: [
      "Plateforme sur mesure",
      "Agents IA avancés",
      "Workflows complexes n8n",
      "CRM personnalisé",
      "Dashboards avancés",
      "Intégrations multiples",
      "Génération automatique de documents",
      "Automatisations métier",
      "Accompagnement stratégique"
    ]
  }
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function packFromOffer(offer: Offer, highlighted: boolean) {
  const normalizedTitle = normalizeText(offer.titre);
  const found = packDetails.find((pack) => normalizedTitle.includes(pack.match));

  return found ?? {
    match: offer.id,
    title: offer.titre,
    price: offer.prix,
    description: offer.description,
    href: "/contact",
    cta: "Demander un devis",
    badge: highlighted ? "Le plus choisi" : undefined,
    features: []
  };
}

export function OfferCard({ offer, highlighted = false }: { offer: Offer; highlighted?: boolean }) {
  const pack = packFromOffer(offer, highlighted);

  return (
    <Link href={pack.href} className={`offer-pack-card group ${highlighted ? "featured" : ""}`}>
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-pulse/70 to-transparent" />
      <div className="relative z-10 flex min-h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="offer-pack-icon">
            <Sparkles size={20} aria-hidden="true" />
          </div>
          {highlighted || pack.badge ? <span className="offer-pack-badge">{pack.badge ?? "Le plus choisi"}</span> : null}
        </div>
        <h3 className="mt-6 text-2xl font-bold leading-tight text-white">{pack.title}</h3>
        <p className="mt-4 text-3xl font-bold text-pulse">{pack.price}</p>
        <p className="mt-4 text-sm leading-6 text-slatecopy">{pack.description}</p>
        <ul className="mt-6 grid gap-3">
          {pack.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slatecopy">
              <CheckCircle2 className="mt-0.5 shrink-0 text-pulse" size={17} aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <span className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border border-pulse/30 bg-pulse/10 px-4 py-3 text-sm font-bold text-pulse transition duration-300 group-hover:border-pulse/60 group-hover:bg-pulse/15 group-hover:text-white">
          {pack.cta}
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
