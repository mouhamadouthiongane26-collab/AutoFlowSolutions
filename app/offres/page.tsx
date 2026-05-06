import { OfferCard } from "@/components/offer-card";
import { PublicShell } from "@/components/public-shell";
import { getOffers } from "@/lib/data";

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <PublicShell>
      <section className="mesh-bg section">
        <div className="max-w-3xl">
          <p className="eyebrow">OFFRES</p>
          <h1 className="gradient-text mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Des solutions pensées pour automatiser et développer votre activité
          </h1>
          <p className="mt-5 text-lg leading-8 text-slatecopy">
            Des systèmes modernes combinant automatisation, intelligence artificielle, création de site et intégrations intelligentes pour simplifier votre organisation et accélérer votre croissance.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {offers.map((offer, index) => <OfferCard key={offer.id} offer={offer} highlighted={index === 1} />)}
        </div>
      </section>
    </PublicShell>
  );
}
