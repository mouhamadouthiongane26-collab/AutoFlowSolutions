import { FileText, LogOut, Tags, Type } from "lucide-react";
import {
  deleteArticle,
  deleteMedia,
  deleteMessage,
  deleteOffer,
  deleteText,
  signOut,
  upsertArticle,
  upsertMessage,
  upsertOffer,
  upsertText
} from "@/app/actions";
import { articlePath } from "@/lib/data";
import type { Article, ContactMessage, MediaItem, Offer, TextItem, UserRole } from "@/lib/defaults";
import { DashboardTabs } from "./dashboard-tabs";
import { DeleteButton } from "./delete-button";
import { MediaUploadForm } from "./media-upload-form";

type Props = {
  texts: TextItem[];
  offers: Offer[];
  articles: Article[];
  media: MediaItem[];
  messages: ContactMessage[];
  userEmail?: string;
  role: UserRole;
  error?: string;
  success?: string;
  initialTab?: string;
};

export function AdminDashboard({ texts, offers, articles, media, messages, userEmail, role, error, success, initialTab }: Props) {
  return (
    <div className="mesh-bg min-h-screen">
      <header className="border-b border-white/10 bg-ink/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <img src="/logo-autoflow.svg" alt="AutoFlowSolutions" className="mb-2 h-14 w-auto rounded-lg bg-white px-3 py-2" />
            <h1 className="text-2xl font-bold">Dashboard administrateur</h1>
            <p className="text-sm text-slatecopy">{userEmail} · role {role}</p>
          </div>
          <form action={signOut}>
            <button className="button-secondary" type="submit"><LogOut size={18} /> Deconnexion</button>
          </form>
        </div>
      </header>
      <StatusMessage error={error} success={success} />
      <DashboardTabs
        initialTab={initialTab}
        showMessages
        overview={<Overview texts={texts} offers={offers} articles={articles} media={media} messages={messages} />}
        texts={<TextsPanel texts={texts} />}
        offers={<OffersPanel offers={offers} />}
        articles={<ArticlesPanel articles={articles} />}
        media={<MediaPanel media={media} />}
        messages={<MessagesPanel messages={messages} />}
      />
    </div>
  );
}

function StatusMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;

  return (
    <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      {success ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-100">{success}</p> : null}
      {error ? <p className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">{error}</p> : null}
    </div>
  );
}

function Overview({ texts, offers, articles, media, messages }: Pick<Props, "texts" | "offers" | "articles" | "media" | "messages">) {
  const stats = [
    ["Textes", texts.length],
    ["Offres", offers.length],
    ["Articles", articles.length],
    ["Medias", media.length],
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
        <h2 className="text-xl font-bold">Separation claire code / contenu</h2>
        <p className="mt-3 leading-7 text-slatecopy">
          Le code reste dans le projet. Le client modifie uniquement les lignes Supabase exposees ici : textes, offres,
          articles, medias et messages.
        </p>
      </div>
    </div>
  );
}

function TextsPanel({ texts }: { texts: TextItem[] }) {
  return (
    <div className="grid gap-5">
      <TextForm />
      {texts.map((text) => <TextForm key={text.id} text={text} />)}
    </div>
  );
}

function TextForm({ text }: { text?: TextItem }) {
  return (
    <div className="admin-panel grid gap-4">
      <form action={upsertText} className="grid gap-4">
        <input type="hidden" name="id" value={text?.id ?? ""} />
        <h2 className="flex items-center gap-2 text-lg font-bold"><Type size={18} /> {text ? "Modifier un texte" : "Ajouter un texte"}</h2>
        <label className="grid gap-2">
          <span className="label">Titre / cle CMS</span>
          <input className="field" name="titre" defaultValue={text?.titre ?? ""} placeholder="ex: home.hero.titre" required />
        </label>
        <label className="grid gap-2">
          <span className="label">Contenu</span>
          <textarea className="field min-h-28" name="contenu" defaultValue={text?.contenu ?? ""} required />
        </label>
        <button className="button w-fit" type="submit">{text ? "Modifier" : "Ajouter"}</button>
      </form>
      {text ? (
        <form action={deleteText}>
          <input type="hidden" name="id" value={text.id} />
          <DeleteButton message="Supprimer ce texte ?" />
        </form>
      ) : null}
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
    <div className="admin-panel grid gap-4">
      <form action={upsertOffer} className="grid gap-4">
        <input type="hidden" name="id" value={offer?.id ?? ""} />
        <h2 className="flex items-center gap-2 text-lg font-bold"><Tags size={18} /> {offer ? "Modifier une offre" : "Ajouter une offre"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="label">Titre</span>
            <input className="field" name="titre" defaultValue={offer?.titre ?? ""} required />
          </label>
          <label className="grid gap-2">
            <span className="label">Prix</span>
            <input className="field" name="prix" defaultValue={offer?.prix ?? ""} required />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="label">Description</span>
          <textarea className="field min-h-28" name="description" defaultValue={offer?.description ?? ""} required />
        </label>
        <button className="button w-fit" type="submit">{offer ? "Modifier" : "Ajouter"}</button>
      </form>
      {offer ? (
        <form action={deleteOffer}>
          <input type="hidden" name="id" value={offer.id} />
          <DeleteButton message="Supprimer cette offre ?" />
        </form>
      ) : null}
    </div>
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
    <div className="admin-panel grid gap-4">
      <form action={upsertArticle} className="grid gap-4">
        <input type="hidden" name="id" value={article?.id ?? ""} />
        <h2 className="flex items-center gap-2 text-lg font-bold"><FileText size={18} /> {article ? "Modifier un article" : "Ajouter un article"}</h2>
        <label className="grid gap-2">
          <span className="label">Titre</span>
          <input className="field" name="titre" defaultValue={article?.titre ?? ""} required />
        </label>
        <label className="grid gap-2">
          <span className="label">Contenu</span>
          <textarea className="field min-h-44" name="contenu" defaultValue={article?.contenu ?? ""} required />
        </label>
        <label className="grid gap-2">
          <span className="label">Image URL</span>
          <input className="field" name="image_url" defaultValue={article?.image_url ?? ""} placeholder="https://..." />
        </label>
        {article ? <a className="text-sm font-semibold text-pulse" href={articlePath(article)} target="_blank">Voir sur le site</a> : null}
        <button className="button w-fit" type="submit">{article ? "Modifier" : "Ajouter"}</button>
      </form>
      {article ? (
        <form action={deleteArticle}>
          <input type="hidden" name="id" value={article.id} />
          <DeleteButton message="Supprimer cet article ?" />
        </form>
      ) : null}
    </div>
  );
}

function MediaPanel({ media }: { media: MediaItem[] }) {
  return (
    <div className="grid gap-5">
      <MediaUploadForm />
      <div className="grid gap-4 md:grid-cols-2">
        {media.map((item) => (
          <div key={item.id} className="admin-panel">
            <p className="text-sm font-bold uppercase tracking-wider text-brand">{item.type}</p>
            <MediaPreview item={item} />
            <form action={deleteMedia} className="mt-4">
              <input type="hidden" name="id" value={item.id} />
              <DeleteButton message="Supprimer ce media ?" />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaPreview({ item }: { item: MediaItem }) {
  const isFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(item.url);
  if (item.type === "image") {
    return <img src={item.url} alt="" className="mt-4 h-48 w-full rounded-lg object-cover" />;
  }

  return isFile ? (
    <video src={item.url} className="mt-4 h-48 w-full rounded-lg bg-black object-cover" controls playsInline preload="metadata" />
  ) : (
    <p className="mt-4 break-all text-sm text-slatecopy">{item.url}</p>
  );
}

function MessagesPanel({ messages }: { messages: ContactMessage[] }) {
  return (
    <div className="grid gap-5">
      <MessageForm />
      {messages.length === 0 ? <div className="admin-panel">Aucun message pour le moment.</div> : null}
      {messages.map((message) => <MessageForm key={message.id} message={message} />)}
    </div>
  );
}

function MessageForm({ message }: { message?: ContactMessage }) {
  return (
    <div className="admin-panel grid gap-4">
      <form action={upsertMessage} className="grid gap-4">
        <input type="hidden" name="id" value={message?.id ?? ""} />
        <h2 className="flex items-center gap-2 text-lg font-bold">{message ? "Modifier un message" : "Ajouter un message"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="label">Nom</span>
            <input className="field" name="nom" defaultValue={message?.nom ?? ""} required />
          </label>
          <label className="grid gap-2">
            <span className="label">Email</span>
            <input className="field" name="email" type="email" defaultValue={message?.email ?? ""} required />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="label">Message</span>
          <textarea className="field min-h-28" name="message" defaultValue={message?.message ?? ""} required />
        </label>
        {message?.created_at ? <time className="text-sm text-slatecopy">{new Date(message.created_at).toLocaleString("fr-FR")}</time> : null}
        <button className="button w-fit" type="submit">{message ? "Modifier" : "Ajouter"}</button>
      </form>
      {message ? (
        <form action={deleteMessage}>
          <input type="hidden" name="id" value={message.id} />
          <DeleteButton message="Supprimer ce message ?" />
        </form>
      ) : null}
    </div>
  );
}
