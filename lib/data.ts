import { createSupabaseClient } from "@/lib/supabase/server";
import { defaultArticles, defaultOffers, defaultTextValues, type Article, type ContactMessage, type MediaItem, type Offer, type TextItem, type UserRole } from "./defaults";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function articlePath(article: Article) {
  return `/articles/${slugify(article.titre) || article.id}`;
}

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return data?.role ?? user.app_metadata?.role ?? null;
}

export async function getTexts(): Promise<TextItem[]> {
  const supabase = await createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("textes").select("*").order("titre");
  if (error) return [];

  return (data ?? [])
    .map((row: TextItem & { cle?: string; valeur?: string }) => ({
      ...row,
      titre: row.titre || row.cle || "",
      contenu: row.contenu || row.valeur || ""
    }))
    .filter((row) => row.titre.length > 0);
}

export async function getTextMap() {
  const rows = await getTexts();
  return {
    ...defaultTextValues,
    ...Object.fromEntries(rows.map((row) => [row.titre, row.contenu]))
  };
}

export function textValue(texts: Record<string, string>, key: string) {
  return texts[key] ?? defaultTextValues[key] ?? "";
}

export function jsonTextValue<T>(texts: Record<string, string>, key: string, fallback: T): T {
  const raw = texts[key];
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getOffers(): Promise<Offer[]> {
  const supabase = await createSupabaseClient();
  if (!supabase) return defaultOffers;

  const { data, error } = await supabase.from("offres").select("*").order("created_at");
  return error || !data?.length ? defaultOffers : data;
}

export async function getArticles(): Promise<Article[]> {
  const supabase = await createSupabaseClient();
  if (!supabase) return defaultArticles;

  const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  return error || !data?.length ? defaultArticles : data;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((article) => slugify(article.titre) === slug || article.id === slug) ?? null;
}

export async function getMedia(type?: MediaItem["type"]): Promise<MediaItem[]> {
  const supabase = await createSupabaseClient();
  if (!supabase) return [];

  let query = supabase.from("media").select("*").order("created_at", { ascending: false });
  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  return error ? [] : (data ?? []).filter((item) => item.url.length > 0);
}

export async function getMessages(): Promise<ContactMessage[]> {
  const supabase = await createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  return error ? [] : data ?? [];
}
