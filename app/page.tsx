import Link from "next/link"
import { Network, CircuitBoard, MessageSquare } from "lucide-react"
import { OfferCard } from "@/components/offer-card"
import { PublicShell } from "@/components/public-shell"
import { StatBand } from "@/components/stat-band"
import { getArticles, getMedia, getOffers, getSection } from "@/lib/data"

export default async function HomePage() {
  const [hero, services, automation, offers, articles, media] = await Promise.all([
    getSection("home_hero"),
    getSection("services_intro"),
    getSection("automation_intro"),
    getOffers(),
    getArticles(),
    getMedia()
  ])
  const featuredMedia = media.slice(0, 4)

  return (
    <PublicShell>
      {/* HERO */}
      <section className="section">
        <h1 className="text-4xl font-bold">{hero?.title}</h1>
        <p className="mt-4 text-lg">{hero?.body}</p>
      </section>

      <StatBand />

      {/* SERVICES */}
      <section className="section">
        <p className="eyebrow">Services</p>
        <h2 className="text-3xl font-bold">{services?.title}</h2>
        <p className="mt-4">{services?.body}</p>
      </section>

      {/* AUTOMATISATION + ARTICLES */}
      <section className="section grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* PARTIE GAUCHE */}
        <div>
          <p className="eyebrow">Automatisation</p>

          <h2 className="gradient-text mt-4 text-3xl font-bold">
            {automation?.title}
          </h2>

          <p className="mt-4 leading-7 text-slatecopy">
            {automation?.body}
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slatecopy">
            {[Network, CircuitBoard, MessageSquare].map((Icon, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-pulse/25 bg-pulse/10">
                  <Icon size={18} />
                </span>
                <span>
                  Orchestration, données et réponses reliées en temps réel
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PARTIE DROITE : ARTICLES */}
        <div className="grid gap-4 md:grid-cols-2">
          {articles.slice(0, 2).map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="glass-card p-5 transition duration-300"
            >
              {article.image_url ? (
                <img src={article.image_url} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" />
              ) : null}
              <h3 className="font-bold">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slatecopy">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {featuredMedia.length ? (
        <section className="section">
          <p className="eyebrow">Médias</p>
          <h2 className="mt-4 text-3xl font-bold">Photos et vidéos ajoutées depuis l’admin</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredMedia.map((item) => (
              <article key={item.id} className="glass-card overflow-hidden">
                <MediaPreview title={item.title} type={item.type} url={item.url} />
                <p className="p-4 font-semibold">{item.title}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* OFFRES */}
      <section className="section">
        <p className="eyebrow">Offres</p>

        <h2 className="text-3xl font-bold">
          Des packs clairs, évolutifs
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {offers.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} highlighted={index === 1} />
          ))}
        </div>
      </section>
    </PublicShell>
  )
}

function MediaPreview({ title, type, url }: { title: string; type: "image" | "video"; url: string }) {
  const isVideoFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  if (type === "image") {
    return <img src={url} alt={title} className="aspect-video w-full object-cover" />;
  }

  return isVideoFile ? (
    <video src={url} title={title} className="aspect-video w-full bg-black object-cover" controls playsInline preload="metadata" />
  ) : (
    <iframe src={url} title={title} className="aspect-video w-full" allowFullScreen />
  );
}
