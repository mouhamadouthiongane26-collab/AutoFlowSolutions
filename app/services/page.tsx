import { Bot, FileText, Globe, Workflow } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getTextMap, jsonTextValue, textValue } from "@/lib/data";
import { CreationSiteCard } from "./creation-site-card";

type ServiceItem = {
  titre: string;
  texte: string;
};

export default async function ServicesPage() {
  const texts = await getTextMap();
  const services = jsonTextValue<ServiceItem[]>(texts, "services.items", []);
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
            const isCreationSite = service.titre
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes("creation de site");

            if (isCreationSite) {
              return <CreationSiteCard key={service.titre} titre={service.titre} texte={service.texte} />;
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
