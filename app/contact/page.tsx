import { PublicShell } from "@/components/public-shell";
import { getTextMap, textValue } from "@/lib/data";

export default async function ContactPage() {
  const texts = await getTextMap();
  const tallyFormUrl = textValue(texts, "contact.form.url");
  const hasContactForm = tallyFormUrl.length > 0;

  return (
    <PublicShell>
      <section className="mesh-bg section grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="gradient-text mt-4 text-4xl font-bold">{textValue(texts, "contact.intro.titre")}</h1>
          <p className="mt-5 text-lg leading-8 text-slatecopy">{textValue(texts, "contact.intro.texte")}</p>
          <div className="glass-card mt-8 p-5">
            <p className="font-bold">{textValue(texts, "contact.note.titre")}</p>
            <p className="mt-2 text-sm leading-6 text-slatecopy">{textValue(texts, "contact.note.texte")}</p>
          </div>
        </div>
        <div className="glass-card overflow-hidden p-2">
          {hasContactForm ? (
            <iframe
              src={tallyFormUrl}
              title="Formulaire de contact AutoFlowSolutions"
              className="h-[760px] w-full rounded-lg border-0 bg-white"
            />
          ) : (
            <div className="grid min-h-80 place-items-center rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center text-sm font-semibold text-slatecopy">
              Configurez la cle contact.form.url dans l'admin pour afficher le formulaire.
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
