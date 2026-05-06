"use client";

import { useState } from "react";
import { Globe, SearchCheck } from "lucide-react";

type Props = {
  titre: string;
  texte: string;
};

const details = [
  {
    title: "CRÉATION DE SITE INTERNET",
    text: "Site vitrine, corporate, e-commerce ou application web, conçu sur mesure pour être rapide, responsive et entièrement modifiable depuis un dashboard."
  },
  {
    title: "INTÉGRATION WEB",
    text: "Intégration HTML / CSS moderne respectant les standards du web, avec des performances optimisées et une compatibilité sur tous les supports."
  },
  {
    title: "CONCEPTION GRAPHIQUE & WEBDESIGN",
    text: "Design professionnel : logos, interfaces web, pages modernes et expériences utilisateur optimisées pour convertir vos visiteurs."
  },
  {
    title: "DYNAMISME DES PAGES",
    text: "Animations fluides et interactions modernes pour rendre votre site vivant et améliorer l’expérience utilisateur sans ralentir les performances."
  },
  {
    title: "RÉFÉRENCEMENT SEO",
    text: "Optimisation SEO avancée pour améliorer la visibilité de votre site sur Google : structure optimisée, rapidité de chargement, balises SEO, responsive mobile, référencement local et bonnes pratiques pour attirer davantage de visiteurs.",
    icon: SearchCheck
  }
];

export function CreationSiteCard({ titre, texte }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className="glass-card cursor-pointer p-6 transition duration-300 hover:-translate-y-1 hover:border-pulse/40"
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen((value) => !value);
        }
      }}
    >
      <Globe className="text-pulse" size={28} />
      <h2 className="mt-5 text-xl font-bold">{titre}</h2>
      <p className="mt-3 leading-7 text-slatecopy">{texte}</p>
      <div className={`creation-site-details ${open ? "open" : ""}`}>
        <div className="mt-5 grid gap-4 border-t border-white/10 pt-5">
          {details.map((item) => (
            <div
              key={item.title}
              className={item.icon ? "creation-site-seo-item relative rounded-lg border border-pulse/10 bg-pulse/[0.035] p-4 pr-14 transition duration-300" : undefined}
            >
              {item.icon ? <item.icon className="absolute right-4 top-4 text-pulse" size={20} aria-hidden="true" /> : null}
              <h3 className="text-sm font-bold text-pulse">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slatecopy">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
