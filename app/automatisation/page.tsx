import { ArrowDown, Bot, ClipboardCheck, MailCheck, MessageSquare } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getMedia, getSection } from "@/lib/data";

export default async function AutomationPage() {
  const [intro, videos] = await Promise.all([getSection("automation_intro"), getMedia("video")]);
  const [presentationVideo, ...otherVideos] = videos;
  const steps = [
    ["Demande reçue", "Le formulaire ou WhatsApp capte le besoin client.", MessageSquare],
    ["Analyse automatique", "Les informations sont structurées pour identifier le bon service.", Bot],
    ["Devis préparé", "Le système génère une base de devis ou une fiche de qualification.", ClipboardCheck],
    ["Équipe alertée", "Vous recevez une notification claire et exploitable.", MailCheck]
  ];

  return (
    <PublicShell>
      <section className="mesh-bg section">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="eyebrow">Automatisation</p>
            <h1 className="gradient-text mt-4 text-4xl font-bold">{intro.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slatecopy">{intro.body}</p>
          </div>
          {presentationVideo ? (
            <div className="glass-card overflow-hidden">
              <VideoFrame title={presentationVideo.title} url={presentationVideo.url} />
              <p className="p-4 font-semibold">{presentationVideo.title}</p>
            </div>
          ) : null}
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {steps.map(([title, text, Icon], index) => (
            <article key={String(title)} className="glass-card relative p-6 transition duration-300 hover:-translate-y-1 hover:border-pulse/40">
              <Icon className="text-pulse" size={28} />
              <h2 className="mt-5 font-bold">{title as string}</h2>
              <p className="mt-3 text-sm leading-6 text-slatecopy">{text as string}</p>
              {index < steps.length - 1 ? <ArrowDown className="absolute -bottom-7 left-8 hidden text-pulse lg:block lg:-right-7 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-rotate-90" /> : null}
            </article>
          ))}
        </div>
        {otherVideos.length ? (
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {otherVideos.map((video) => (
              <div key={video.id} className="glass-card overflow-hidden">
                <VideoFrame title={video.title} url={video.url} />
                <p className="p-4 font-semibold">{video.title}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </PublicShell>
  );
}

function VideoFrame({ title, url }: { title: string; url: string }) {
  const isFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

  return (
    <div className="aspect-video bg-black">
      {isFile ? (
        <video src={url} title={title} className="h-full w-full object-cover" controls playsInline preload="metadata" />
      ) : (
        <iframe src={url} title={title} className="h-full w-full" allowFullScreen />
      )}
    </div>
  );
}
