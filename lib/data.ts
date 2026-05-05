import { createSupabaseClient } from "@/lib/supabase/server"
import {
  Article,
  ContactMessage,
  MediaItem,
  defaultArticles,
  defaultOffers,
  defaultSections,
  defaultMedia,
  Offer,
  SiteSection
} from "./defaults"

// =========================
// SECTIONS
// =========================
export async function getSections(): Promise<SiteSection[]> {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from("site_sections")
    .select("*")
    .order("id")

  return error || !data?.length ? defaultSections : data
}

export async function getSection(id: string): Promise<SiteSection> {
  const sections = await getSections()
  return (
    sections.find((section) => section.id === id) ??
    defaultSections.find((section) => section.id === id) ??
    defaultSections[0]
  )
}

// =========================
// OFFERS
// =========================
export async function getOffers(): Promise<Offer[]> {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("sort_order")

  return error || !data?.length ? defaultOffers : data
}

// =========================
// ARTICLES
// =========================
export async function getArticles(
  { includeDrafts = false } = {}
): Promise<Article[]> {
  const supabase = await createSupabaseClient()

  let query = supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })

  if (!includeDrafts) {
    query = query.eq("published", true)
  }

  const { data, error } = await query

  return error || !data?.length ? defaultArticles : data
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles()
  return articles.find((article) => article.slug === slug) ?? null
}

export async function getMedia(type?: MediaItem["type"]): Promise<MediaItem[]> {
  const supabase = await createSupabaseClient()

  let query = supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })

  if (type) {
    query = query.eq("type", type)
  }

  const { data, error } = await query
  const media = error || !data?.length ? defaultMedia : data

  return type ? media.filter((item) => item.type === type) : media
}
export async function getMessages(): Promise<ContactMessage[]> {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  return error || !data?.length ? [] : data
}
