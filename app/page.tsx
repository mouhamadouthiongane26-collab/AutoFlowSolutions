import Link from "next/link"
import { Network, CircuitBoard, MessageSquare } from "lucide-react"
import { OfferCard } from "@/components/offer-card"
import { PublicShell } from "@/components/public-shell"
import { StatBand } from "@/components/stat-band"
import { articlePath, getArticles, getMedia, getOffers, getTextMap, jsonTextValue, textValue } from "@/lib/data"

export default async function HomePage() {
  const [texts, offers, articles, media] = await Promise.all([
    getTextMap(),
    getOffers(),
    getArticles(),
    getMedia()
  ])
  const featuredMedia = media.slice(0, 4)
  const automationPoints = jsonTextValue<string[]>(texts, "home.automation.points", [])

  return (
    <PublicShell>
      {/* HERO */}
      <section className="section">
        <h1 className="text-4xl font-bold">{textValue(texts, "home.hero.titre")}</h1>
        <p className="mt-4 text-lg">{textValue(texts, "home.hero.texte")}</p>
      </section>

      <StatBand />

      {/* SERVICES */}
      <section className="section">
        <p className="eyebrow">Services</p>
        <h2 className="text-3xl font-bold">{textValue(texts, "services.intro.titre")}</h2>
        <p className="mt-4">{textValue(texts, "services.intro.texte")}</p>
      </section>

      {/* AUTOMATISATION + ARTICLES */}
      <section className="section grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* PARTIE GAUCHE */}
        <div>
          <p className="eyebrow">Automatisation</p>

          <h2 className="gradient-text mt-4 text-3xl font-bold">
            {textValue(texts, "automation.intro.titre")}
          </h2>

          <p className="mt-4 leading-7 text-slatecopy">
            {textValue(texts, "automation.intro.texte")}
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slatecopy">
            {automationPoints.map((point, index) => {
              const Icon = [Network, CircuitBoard, MessageSquare][index % 3]
              return (
              <div key={index} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-pulse/25 bg-pulse/10">
                  <Icon size={18} />
                </span>
                <span>{point}</span>
              </div>
            )})}
          </div>
        </div>

        {/* PARTIE DROITE : ARTICLES */}
        <div className="grid gap-4 md:grid-cols-2">
          {articles.slice(0, 2).map((article) => (
            <Link
              key={article.id}
              href={articlePath(article)}
              className="glass-card p-5 transition duration-300"
            >
              {article.image_url ? <img src={article.image_url} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" /> : null}
              <h3 className="font-bold">{article.titre}</h3>
              <p className="mt-3 text-sm leading-6 text-slatecopy">
                {article.contenu.slice(0, 150)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {featuredMedia.length ? (
        <section className="section">
          <p className="eyebrow">Médias</p>
          <h2 className="mt-4 text-3xl font-bold">{textValue(texts, "home.medias.titre")}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredMedia.map((item) => (
              <article key={item.id} className="glass-card overflow-hidden">
                <MediaPreview type={item.type} url={item.url} />
                <p className="p-4 font-semibold">{item.type}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* OFFRES */}
      <section className="section">
        <p className="eyebrow">Offres</p>

        <h2 className="text-3xl font-bold">
          {textValue(texts, "home.offres.titre")}
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

function MediaPreview({ type, url }: { type: "image" | "video"; url: string }) {
  const isVideoFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  if (type === "image") {
    return <img src={url} alt="" className="aspect-video w-full object-cover" />;
  }

  return isVideoFile ? (
    <video src={url} className="aspect-video w-full bg-black object-cover" controls playsInline preload="metadata" />
  ) : (
    <iframe src={url} title="Video" className="aspect-video w-full" allowFullScreen />
  );
}
