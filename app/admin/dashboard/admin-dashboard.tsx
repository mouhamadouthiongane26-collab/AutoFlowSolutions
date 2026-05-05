"use client";

import { useState } from "react";
import { FileText, Image, LayoutDashboard, LogOut, MessageSquare, PlaySquare, Tags, Type } from "lucide-react";
import {
  addVideo,
  deleteArticle,
  deleteMedia,
  deleteOffer,
  signOut,
  uploadImage,
  upsertArticle,
  upsertOffer,
  upsertSection
} from "@/app/actions";
import type { Article, ContactMessage, MediaItem, Offer, SiteSection } from "@/lib/defaults";

type Props = {
  sections: SiteSection[];
  offers: Offer[];
  articles: Article[];
  media: MediaItem[];
  messages: ContactMessage[];
  userEmail?: string;
};

const tabs = [
  ["overview", "Vue générale", LayoutDashboard],
  ["texts", "Textes", Type],
  ["offers", "Offres", Tags],
  ["articles", "Articles", FileText],
  ["media", "Médias", Image],
  ["messages", "Messages", MessageSquare]
];

export function AdminDashboard({ sections, offers, articles, media, messages, userEmail }: Props) {
  const [active, setActive] = useState("overview");

  return (
    <div className="mesh-bg min-h-screen">
      <header className="border-b border-white/10 bg-ink/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <img src="/logo-autoflow.svg" alt="AutoFlowSolutions" className="mb-2 h-14 w-auto rounded-lg bg-white px-3 py-2" />
            <h1 className="text-2xl font-bold">Dashboard administrateur</h1>
            <p className="text-sm text-slatecopy">{userEmail}</p>
          </div>
          <form action={signOut}>
            <button className="button-secondary" type="submit"><LogOut size={18} /> Déconnexion</button>
          </form>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="glass-card h-fit p-3">
          <nav className="grid gap-2">
            {tabs.map(([id, label, Icon]) => (
              <button
                key={String(id)}
                type="button"
                onClick={() => setActive(String(id))}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition duration-300 ${active === id ? "bg-gradient-to-r from-brand to-violet text-white shadow-glow" : "text-slatecopy hover:bg-white/[0.06] hover:text-white"}`}
              >
                <Icon size={18} />
                {label as string}
              </button>
            ))}
          </nav>
        </aside>
        <section className="grid gap-6">
          {active === "overview" ? <Overview sections={sections} offers={offers} articles={articles} media={media} messages={messages} /> : null}
          {active === "texts" ? <TextsPanel sections={sections} /> : null}
          {active === "offers" ? <OffersPanel offers={offers} /> : null}
          {active === "articles" ? <ArticlesPanel articles={articles} /> : null}
          {active === "media" ? <MediaPanel media={media} /> : null}
          {active === "messages" ? <MessagesPanel messages={messages} /> : null}
        </section>
      </div>
    </div>
  );
}

function Overview({ sections, offers, articles, media, messages }: Props) {
  const stats = [
    ["Textes", sections.length],
    ["Offres", offers.length],
    ["Articles", articles.length],
    ["Médias", media.length],
    ["Messages", messages.length]
  ];
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {stats.map(([label, value]) => (
        <div key={String(label)} className="admin-panel">
          <p className="text-sm font-semibold text-slatecopy">{label}</p>
          <p className="mt-2 text-3xl font-bold text-pulse">{value}</p>
        </div>
      ))}
      <div className="admin-panel md:col-span-5">
        <h2 className="text-xl font-bold">Structure prête pour les automatisations</h2>
        <p className="mt-3 leading-7 text-slatecopy">
          Les formulaires, messages, offres et contenus sont stockés dans Supabase. Vous pouvez ensuite connecter n8n, WhatsApp API,
          un agent IA ou un générateur de devis via les tables et webhooks documentés dans le schéma.
        </p>
      </div>
    </div>
  );
}

function TextsPanel({ sections }: { sections: SiteSection[] }) {
  return (
    <div className="grid gap-5">
      {sections.map((section) => (
        <form key={section.id} action={upsertSection} className="admin-panel grid gap-4">
          <input type="hidden" name="id" value={section.id} />
          <div className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">{section.id}</span>
            <label className="grid gap-2">
              <span className="label">Titre</span>
              <input className="field" name="title" defaultValue={section.title} />
            </label>
            <label className="grid gap-2">
              <span className="label">Texte</span>
              <textarea className="field min-h-28" name="body" defaultValue={section.body} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="label">Badge</span>
                <input className="field" name="badge" defaultValue={section.metadata?.badge ?? ""} />
              </label>
              <label className="grid gap-2">
                <span className="label">Bouton</span>
                <input className="field" name="cta" defaultValue={section.metadata?.cta ?? ""} />
              </label>
            </div>
          </div>
          <button className="button w-fit" type="submit">Enregistrer</button>
        </form>
      ))}
    </div>
  );
}

function OffersPanel({ offers }: { offers: Offer[] }) {
  return (
    <div className="grid gap-5">
      <OfferForm />
      {offers.map((offer) => <OfferForm key={offer.id} offer={offer} />)}
    </div>
  );
}

function OfferForm({ offer }: { offer?: Offer }) {
  return (
    <>
    <form action={upsertOffer} className="admin-panel grid gap-4">
      <input type="hidden" name="id" value={offer?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2">
          <span className="label">Nom</span>
          <input className="field" name="name" defaultValue={offer?.name ?? ""} required />
        </label>
        <label className="grid gap-2">
          <span className="label">Prix</span>
          <input className="field" name="price" defaultValue={offer?.price ?? ""} required />
        </label>
        <label className="grid gap-2">
          <span className="label">Ordre</span>
          <input className="field" name="sort_order" type="number" defaultValue={offer?.sort_order ?? 99} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="label">Description</span>
        <textarea className="field" name="description" defaultValue={offer?.description ?? ""} />
      </label>
      <label className="grid gap-2">
        <span className="label">Fonctionnalités, une par ligne</span>
        <textarea className="field min-h-28" name="features" defaultValue={offer?.features?.join("\n") ?? ""} />
      </label>
      <div className="flex flex-wrap gap-3">
        <button className="button" type="submit">{offer ? "Modifier" : "Ajouter"} l’offre</button>
      </div>
    </form>
    {offer ? (
      <form action={deleteOffer} className="admin-panel pt-0">
        <input type="hidden" name="id" value={offer.id} />
        <button className="button-secondary" type="submit">Supprimer</button>
      </form>
    ) : null}
    </>
  );
}

function ArticlesPanel({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-5">
      <ArticleForm />
      {articles.map((article) => <ArticleForm key={article.id} article={article} />)}
    </div>
  );
}

function ArticleForm({ article }: { article?: Article }) {
  return (
    <>
    <form action={upsertArticle} className="admin-panel grid gap-4">
      <input type="hidden" name="id" value={article?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="label">Titre</span>
          <input className="field" name="title" defaultValue={article?.title ?? ""} required />
        </label>
        <label className="grid gap-2">
          <span className="label">Slug URL</span>
          <input className="field" name="slug" defaultValue={article?.slug ?? ""} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="label">Résumé</span>
        <textarea className="field" name="excerpt" defaultValue={article?.excerpt ?? ""} />
      </label>
      <label className="grid gap-2">
        <span className="label">Contenu</span>
        <textarea className="field min-h-44" name="content" defaultValue={article?.content ?? ""} />
      </label>
      <label className="grid gap-2">
        <span className="label">URL image</span>
        <input className="field" name="image_url" defaultValue={article?.image_url ?? ""} />
      </label>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input name="published" type="checkbox" defaultChecked={article?.published ?? true} />
        Publié
      </label>
      <div className="flex flex-wrap gap-3">
        <button className="button" type="submit">{article ? "Modifier" : "Ajouter"} l’article</button>
      </div>
    </form>
    {article ? (
      <form action={deleteArticle} className="admin-panel pt-0">
        <input type="hidden" name="id" value={article.id} />
        <button className="button-secondary" type="submit">Supprimer</button>
      </form>
    ) : null}
    </>
  );
}

function MediaPanel({ media }: { media: MediaItem[] }) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <form action={uploadImage} className="admin-panel grid gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Image size={20} /> Ajouter une image</h2>
          <input className="field" name="title" placeholder="Titre de l’image" />
          <input className="field" name="file" type="file" accept="image/*" required />
          <button className="button" type="submit">Uploader</button>
        </form>
        <form action={addVideo} className="admin-panel grid gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold"><PlaySquare size={20} /> Ajouter une vidéo</h2>
          <input className="field" name="title" placeholder="Titre de la vidéo" required />
          <input className="field" name="url" placeholder="URL embed YouTube, Vimeo ou autre" required />
          <button className="button" type="submit">Ajouter</button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {media.map((item) => (
          <div key={item.id} className="admin-panel">
            <p className="text-sm font-bold uppercase tracking-wider text-brand">{item.type}</p>
            <h3 className="mt-2 font-bold">{item.title}</h3>
            {item.type === "image" ? <img src={item.url} alt={item.title} className="mt-4 h-48 w-full rounded-lg object-cover" /> : <p className="mt-4 break-all text-sm text-slatecopy">{item.url}</p>}
            <form action={deleteMedia} className="mt-4">
              <input type="hidden" name="id" value={item.id} />
              <button className="button-secondary" type="submit">Supprimer</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesPanel({ messages }: { messages: ContactMessage[] }) {
  return (
    <div className="grid gap-4">
      {messages.length === 0 ? <div className="admin-panel">Aucun message pour le moment.</div> : null}
      {messages.map((message) => (
        <article key={message.id} className="admin-panel">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-bold">{message.name}</h2>
              <p className="text-sm text-slatecopy">{message.email} · {message.phone}</p>
            </div>
            <time className="text-sm text-slatecopy">{new Date(message.created_at).toLocaleString("fr-FR")}</time>
          </div>
          <p className="mt-4 whitespace-pre-line leading-7 text-slatecopy">{message.message}</p>
        </article>
      ))}
    </div>
  );
}
