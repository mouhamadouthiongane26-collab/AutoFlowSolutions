import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";

const links = [
  ["Accueil", "/"],
  ["Services", "/services"],
  ["Offres", "/offres"],
  ["Automatisation", "/automatisation"],
  ["Contact", "/contact"]
];

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/72 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold text-white">
          <span className="rounded-lg border border-white/10 bg-white px-2 py-1 shadow-glow">
            <img src="/logo-autoflow.svg" alt="AutoFlowSolutions" className="h-9 w-auto" />
          </span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-medium text-slatecopy md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 transition duration-300 hover:bg-white/[0.06] hover:text-white">
              {label}
            </Link>
          ))}
          <Link href="/admin" className="button-secondary ml-2 py-2">
            <Sparkles size={15} /> Admin
          </Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-white">
            <Menu size={20} />
          </summary>
          <div className="absolute right-0 mt-3 grid w-60 gap-2 rounded-lg border border-white/10 bg-ink/95 p-3 shadow-soft backdrop-blur-2xl">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-slatecopy hover:bg-white/[0.06] hover:text-white">
                {label}
              </Link>
            ))}
            <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-slatecopy hover:bg-white/[0.06] hover:text-white">
              Admin
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
