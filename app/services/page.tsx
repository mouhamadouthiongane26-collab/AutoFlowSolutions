import { Bot, FileText, Globe, Workflow } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { getSection } from "@/lib/data";

export default async function ServicesPage() {
  const intro = await getSection("services_intro");
  const services = [
    ["Création de site", "Site vitrine ou plateforme complète, responsive, rapide et modifiable depuis un dashboard.", Globe],
    ["Automatisation WhatsApp", "Réponses automatiques, collecte d’informations, alertes et suivi des prospects.", Bot],
    ["Devis automatique", "Qualification des besoins et génération de demandes structurées pour gagner du temps.", FileText],
    ["Intégrations IA et n8n", "Workflows évolutifs pour connecter formulaires, CRM, emails, WhatsApp et agents IA.", Workflow]
  ];

  return (
    <PublicShell>
      <section className="mesh-bg section">
        <div className="max-w-3xl">
          <p className="eyebrow">Services</p>
          <h1 className="gradient-text mt-4 text-4xl font-bold">{intro.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slatecopy">{intro.body}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map(([title, text, Icon]) => (
            <article key={String(title)} className="glass-card p-6 transition duration-300 hover:-translate-y-1 hover:border-pulse/40">
              <Icon className="text-pulse" size={28} />
              <h2 className="mt-5 text-xl font-bold">{title as string}</h2>
              <p className="mt-3 leading-7 text-slatecopy">{text as string}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
