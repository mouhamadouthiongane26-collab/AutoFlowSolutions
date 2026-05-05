import { ArrowDown, Bot, ClipboardCheck, MailCheck, MessageSquare } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getMedia, getTextMap, jsonTextValue, textValue } from "@/lib/data";

type AutomationStep = {
  titre: string;
  texte: string;
};

export default async function AutomationPage() {
  const [texts, videos] = await Promise.all([getTextMap(), getMedia("video")]);
  const [presentationVideo, ...otherVideos] = videos;
  const steps = jsonTextValue<AutomationStep[]>(texts, "automation.steps", []);
  const icons = [MessageSquare, Bot, ClipboardCheck, MailCheck];

  return (
    <PublicShell>
      <section className="mesh-bg section">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="eyebrow">Automatisation</p>
            <h1 className="gradient-text mt-4 text-4xl font-bold">{textValue(texts, "automation.intro.titre")}</h1>
            <p className="mt-5 text-lg leading-8 text-slatecopy">{textValue(texts, "automation.intro.texte")}</p>
          </div>
          {presentationVideo ? (
            <div className="glass-card overflow-hidden">
              <VideoFrame url={presentationVideo.url} />
              <p className="p-4 font-semibold">{presentationVideo.type}</p>
            </div>
          ) : null}
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = icons[index % icons.length];
            return (
            <article key={step.titre} className="glass-card relative p-6 transition duration-300 hover:-translate-y-1 hover:border-pulse/40">
              <Icon className="text-pulse" size={28} />
              <h2 className="mt-5 font-bold">{step.titre}</h2>
              <p className="mt-3 text-sm leading-6 text-slatecopy">{step.texte}</p>
              {index < steps.length - 1 ? <ArrowDown className="absolute -bottom-7 left-8 hidden text-pulse lg:block lg:-right-7 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-rotate-90" /> : null}
            </article>
          )})}
        </div>
        {otherVideos.length ? (
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {otherVideos.map((video) => (
              <div key={video.id} className="glass-card overflow-hidden">
                <VideoFrame url={video.url} />
                <p className="p-4 font-semibold">{video.type}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </PublicShell>
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
