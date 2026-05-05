import { OfferCard } from "@/components/offer-card";
import { PublicShell } from "@/components/public-shell";
import { getOffers } from "@/lib/data";

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <PublicShell>
      <section className="mesh-bg section">
        <div className="max-w-3xl">
          <p className="eyebrow">Offres</p>
          <h1 className="gradient-text mt-4 text-4xl font-bold">Choisissez le niveau d’accompagnement adapté</h1>
          <p className="mt-5 text-lg leading-8 text-slatecopy">
            Chaque pack peut évoluer avec vos besoins : site administrable, contenus dynamiques, automatisation, WhatsApp, IA et génération de devis.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {offers.map((offer, index) => <OfferCard key={offer.id} offer={offer} highlighted={index === 1} />)}
        </div>
      </section>
    </PublicShell>
  );
}
