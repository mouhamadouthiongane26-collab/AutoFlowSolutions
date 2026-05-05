import { OfferCard } from "@/components/offer-card";
import { PublicShell } from "@/components/public-shell";
import { getOffers, getTextMap, textValue } from "@/lib/data";

export default async function OffersPage() {
  const [texts, offers] = await Promise.all([getTextMap(), getOffers()]);

  return (
    <PublicShell>
      <section className="mesh-bg section">
        <div className="max-w-3xl">
          <p className="eyebrow">Offres</p>
          <h1 className="gradient-text mt-4 text-4xl font-bold">{textValue(texts, "offres.page.titre")}</h1>
          <p className="mt-5 text-lg leading-8 text-slatecopy">
            {textValue(texts, "offres.page.texte")}
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {offers.map((offer, index) => <OfferCard key={offer.id} offer={offer} highlighted={index === 1} />)}
        </div>
      </section>
    </PublicShell>
  );
}
