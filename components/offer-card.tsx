import { Check } from "lucide-react";
import type { Offer } from "@/lib/defaults";

export function OfferCard({ offer, highlighted = false }: { offer: Offer; highlighted?: boolean }) {
  return (
    <article className={`group relative overflow-hidden rounded-lg border p-6 transition duration-300 hover:-translate-y-1 ${highlighted ? "border-pulse/40 bg-gradient-to-br from-brand/25 via-white/[0.075] to-violet/25 text-white shadow-glow" : "border-white/10 bg-white/[0.055] text-white shadow-soft backdrop-blur-xl hover:border-pulse/35"}`}>
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-pulse/70 to-transparent" />
      <div className="flex items-start gap-4">
        <h3 className="text-xl font-bold">{offer.name}</h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-slatecopy">{offer.description}</p>
      <ul className="mt-6 grid gap-3 text-sm">
        {offer.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check className={highlighted ? "text-pulse" : "text-pulse"} size={18} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
