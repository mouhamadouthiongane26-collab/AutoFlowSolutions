import type { CSSProperties } from "react";
import { BarChart3, Bot, CheckCircle2, Sparkles, Workflow, Zap } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getMedia } from "@/lib/data";

const automationCards = [
  {
    title: "Automatisation WhatsApp",
    description:
      "Réponses automatiques, qualification des prospects, collecte d’informations, suivi client et automatisation des échanges.",
    points: [
      "Réponses instantanées",
      "Qualification automatique",
      "Relances clients",
      "Collecte des données",
      "Support automatisé"
    ],
    icon: Zap
  },
  {
    title: "Agents IA",
    description:
      "Création d’agents intelligents capables d’assister vos clients, traiter des données et automatiser certaines décisions.",
    points: [
      "Assistance IA",
      "Génération de contenu",
      "Analyse intelligente",
      "Traitement automatique",
      "Réponses contextualisées"
    ],
    icon: Bot
  },
  {
    title: "Workflows & intégrations",
    description:
      "Connexion de vos outils et automatisation des tâches répétitives grâce à des workflows personnalisés.",
    points: [
      "n8n",
      "APIs",
      "Synchronisation",
      "Automatisation métier",
      "Notifications automatiques"
    ],
    icon: Workflow
  },
  {
    title: "Centralisation & suivi",
    description:
      "Centralisation des informations clients et suivi des performances depuis un dashboard unique.",
    points: [
      "Dashboard personnalisé",
      "Historique client",
      "Gestion des demandes",
      "Reporting",
      "Suivi automatisé"
    ],
    icon: BarChart3
  }
];

type AutomationCard = {
  title: string;
  description: string;
  points: string[];
  icon: typeof Zap;
};

export default async function AutomationPage() {
  const videos = await getMedia("video");
  const [presentationVideo, ...otherVideos] = videos;

  return (
    <PublicShell>
      <section className="automation-section mesh-bg section">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="automation-reveal max-w-3xl">
            <p className="eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              Automatisation
            </p>
            <h1 className="gradient-text mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Automatisation intelligente pour votre activité
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slatecopy">
              Je mets en place des systèmes automatisés capables de gérer vos échanges, connecter vos outils, centraliser vos données et réduire les tâches répétitives afin de vous faire gagner du temps et améliorer votre organisation.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-white sm:grid-cols-3">
              {["Échanges gérés", "Outils connectés", "Données centralisées"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 text-center shadow-soft backdrop-blur-xl">
                  {item}
                </div>
              ))}
            </div>
          </div>
          {presentationVideo ? (
            <div className="automation-reveal glass-card overflow-hidden rounded-2xl border-pulse/20">
              <VideoFrame url={presentationVideo.url} />
              <p className="border-t border-white/10 p-4 text-sm font-semibold text-slatecopy">{presentationVideo.type}</p>
            </div>
          ) : null}
          {!presentationVideo ? <AutomationVisual /> : null}
        </div>

        <div className="automation-reveal mt-16 max-w-3xl">
          <p className="eyebrow">Solutions</p>
          <h2 className="mt-4 text-3xl font-bold text-white">Des automatisations pensées pour votre organisation</h2>
          <p className="mt-4 leading-7 text-slatecopy">
            Chaque système est conçu pour relier vos canaux, vos données et vos actions quotidiennes dans une expérience claire, rapide et évolutive.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {automationCards.map((card, index) => (
            <AutomationCard key={card.title} card={card} index={index} />
          ))}
        </div>

        {otherVideos.length ? (
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {otherVideos.map((video) => (
              <div key={video.id} className="automation-reveal glass-card overflow-hidden rounded-2xl">
                <VideoFrame url={video.url} />
                <p className="border-t border-white/10 p-4 text-sm font-semibold text-slatecopy">{video.type}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </PublicShell>
  );
}

function AutomationVisual() {
  return (
    <div className="automation-visual automation-reveal" aria-hidden="true">
      <div className="automation-visual-grid">
        {["WhatsApp", "IA", "n8n", "CRM", "Data", "Suivi"].map((item, index) => (
          <span key={item} className="automation-visual-node" style={{ "--delay": `${index * 120}ms` } as CSSProperties}>
            {item}
          </span>
        ))}
      </div>
      <div className="automation-visual-core">
        <Sparkles size={30} />
      </div>
    </div>
  );
}

function AutomationCard({ card, index }: { card: AutomationCard; index: number }) {
  const Icon = card.icon;

  return (
    <article className="automation-card automation-reveal" style={{ "--delay": `${index * 90}ms` } as CSSProperties}>
      <div className="automation-icon">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h2 className="mt-6 text-xl font-bold leading-tight text-white">{card.title}</h2>
      <p className="mt-4 min-h-28 text-sm leading-6 text-slatecopy">{card.description}</p>
      <ul className="mt-6 grid gap-3">
        {card.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm leading-6 text-slatecopy">
            <CheckCircle2 className="mt-0.5 shrink-0 text-pulse" size={17} aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function VideoFrame({ url }: { url: string }) {
  const isFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

  return (
    <div className="aspect-video bg-black">
      {isFile ? (
        <video src={url} className="h-full w-full object-cover" controls playsInline preload="metadata" />
      ) : (
        <iframe src={url} title="Video" className="h-full w-full" allowFullScreen />
      )}
    </div>
  );
}
