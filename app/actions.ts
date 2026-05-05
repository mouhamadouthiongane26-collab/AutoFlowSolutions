"use server";

import { createSupabaseClient } from '../lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const publicPaths = ["/", "/services", "/offres", "/automatisation", "/contact"];

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function requireSupabase() {
  const supabase = await createSupabaseClient();
  if (!supabase) {
    throw new Error("Configurez Supabase dans .env.local avant d’enregistrer des données.");
  }
  return supabase;
}

async function requireAdmin() {
  const supabase = await requireSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function revalidatePublicSite() {
  publicPaths.forEach((path) => revalidatePath(path));
  revalidatePath("/articles/[slug]", "page");
}

export async function signIn(formData: FormData) {
  const supabase = await requireSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: value(formData, "email"),
    password: value(formData, "password")
  });

  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/dashboard");
}

export async function signUp(formData: FormData) {
  const supabase = await requireSupabase();
  const { error } = await supabase.auth.signUp({
    email: value(formData, "email"),
    password: value(formData, "password"),
    options: {
      data: {
        full_name: value(formData, "name")
      }
    }
  });

  if (error) redirect(`/admin/register?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/dashboard");
}

export async function signOut() {
  const supabase = await requireSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function submitContact(formData: FormData) {
  const supabase = await requireSupabase();
  const { error } = await supabase.from("contact_messages").insert({
    name: value(formData, "name"),
    email: value(formData, "email"),
    phone: value(formData, "phone"),
    message: value(formData, "message")
  });

  if (error) redirect(`/contact?error=${encodeURIComponent(error.message)}`);
  redirect("/contact?sent=1");
}

export async function upsertSection(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("site_sections").upsert({
    id: value(formData, "id"),
    title: value(formData, "title"),
    body: value(formData, "body"),
    metadata: {
      badge: value(formData, "badge"),
      cta: value(formData, "cta")
    }
  });
  revalidatePath("/");
  revalidatePublicSite();
}

export async function upsertOffer(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, "id");
  await supabase.from("offers").upsert({
    id: id || crypto.randomUUID(),
    name: value(formData, "name"),
    price: value(formData, "price"),
    description: value(formData, "description"),
    features: value(formData, "features").split("\n").map((item) => item.trim()).filter(Boolean),
    sort_order: Number(value(formData, "sort_order") || 99)
  });
  revalidatePublicSite();
}

export async function deleteOffer(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("offers").delete().eq("id", value(formData, "id"));
  revalidatePublicSite();
}

export async function upsertArticle(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, "id");
  const title = value(formData, "title");
  await supabase.from("articles").upsert({
    id: id || crypto.randomUUID(),
    title,
    slug: value(formData, "slug") || slugify(title),
    excerpt: value(formData, "excerpt"),
    content: value(formData, "content"),
    image_url: value(formData, "image_url") || null,
    published: formData.get("published") === "on"
  });
  revalidatePublicSite();
}

export async function deleteArticle(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("articles").delete().eq("id", value(formData, "id"));
  revalidatePublicSite();
}

export async function addVideo(formData: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("media").insert({
    type: "video",
    title: value(formData, "title"),
    url: value(formData, "url")
  });
  revalidatePublicSite();
}

export async function uploadMedia(formData: FormData) {
  const supabase = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const type = file.type.startsWith("video/") ? "video" : "image";
  const extension = file.name.split(".").pop() ?? "jpg";
  const safeName = `${type}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("media").upload(safeName, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(safeName);
  await supabase.from("media").insert({
    type,
    title: value(formData, "title") || file.name,
    url: data.publicUrl
  });
  revalidatePublicSite();
}

export async function uploadImage(formData: FormData) {
  return uploadMedia(formData);
}

export async function deleteMedia(formData: FormData) {
  const supabase = await requireAdmin();
  const id = value(formData, "id");
  const { data } = await supabase.from("media").select("url").eq("id", id).maybeSingle();

  if (data?.url?.includes("/storage/v1/object/public/media/")) {
    const storagePath = data.url.split("/storage/v1/object/public/media/")[1]?.split("?")[0];
    if (storagePath) {
      await supabase.storage.from("media").remove([decodeURIComponent(storagePath)]);
    }
  }

  await supabase.from("media").delete().eq("id", id);
  revalidatePublicSite();
}
