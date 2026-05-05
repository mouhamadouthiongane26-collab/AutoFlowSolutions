import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="section grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <img src="/logo-autoflow.svg" alt="AutoFlowSolutions" className="h-16 w-auto rounded-lg bg-white px-3 py-2 shadow-glow" />
          <p className="mt-3 max-w-md text-sm leading-6 text-slatecopy">
            Sites web administrables, automatisations WhatsApp, agents IA et systèmes de devis pour entreprises ambitieuses.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-pulse">Automatisez. Gérez. Développez.</p>
        </div>
        <div className="grid gap-2 text-sm text-slatecopy">
          <Link href="/services" className="hover:text-white">Services</Link>
          <Link href="/offres" className="hover:text-white">Offres</Link>
          <Link href="/automatisation" className="hover:text-white">Automatisation</Link>
        </div>
        <div className="grid content-start gap-2 text-sm text-slatecopy">
          <Link href="/contact" className="hover:text-white">Demander un devis</Link>
          <Link href="/admin/login" className="hover:text-white">Espace administrateur</Link>
        </div>
      </div>
    </footer>
  );
}
