import { PublicShell } from "@/components/public-shell";
import { getSection } from "@/lib/data";

const tallyFormUrl = "https://tally.so/embed/zxWgaM?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

export default async function ContactPage() {
  const intro = await getSection("contact_intro");

  return (
    <PublicShell>
      <section className="mesh-bg section grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="gradient-text mt-4 text-4xl font-bold">{intro.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slatecopy">{intro.body}</p>
          <div className="glass-card mt-8 p-5">
            <p className="font-bold">Ce formulaire est connecté à Tally.</p>
            <p className="mt-2 text-sm leading-6 text-slatecopy">Les demandes sont envoyées via votre formulaire de qualification.</p>
          </div>
        </div>
        <div className="glass-card overflow-hidden p-2">
          <iframe
            src={tallyFormUrl}
            title="Formulaire de contact AutoFlowSolutions"
            className="h-[760px] w-full rounded-lg border-0 bg-white"
          />
        </div>
      </section>
    </PublicShell>
  );
}
