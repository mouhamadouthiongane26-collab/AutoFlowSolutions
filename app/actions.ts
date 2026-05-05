"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseClient } from "../lib/supabase/server";
import type { UserRole } from "@/lib/defaults";

const publicPaths = ["/", "/services", "/offres", "/automatisation", "/contact"];
const maxActionUploadSize = 4 * 1024 * 1024;
const contentRoles: UserRole[] = ["admin"];

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function requireSupabase() {
  const supabase = await createSupabaseClient();
  if (!supabase) {
    throw new Error("Configurez Supabase dans .env.local avant d'enregistrer des donnees.");
  }
  return supabase;
}

async function getCurrentRole() {
  const supabase = await requireSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (error || !data?.role) {
    redirect(`/admin/dashboard?error=${encodeURIComponent("Role introuvable. Executez supabase/schema.sql puis reconnectez-vous.")}`);
  }

  return { supabase, role: data.role as UserRole };
}

async function requireContentRole() {
  const context = await getCurrentRole();
  if (!contentRoles.includes(context.role)) {
    redirect(`/admin/dashboard?error=${encodeURIComponent("Action non autorisee pour ce role.")}`);
  }
  return context.supabase;
}

function revalidatePublicSite() {
  publicPaths.forEach((path) => revalidatePath(path));
  revalidatePath("/articles/[slug]", "page");
  revalidatePath("/admin/dashboard");
}

function dashboardMessage(type: "success" | "error", message: string, tab = "overview") {
  redirect(`/admin/dashboard?tab=${tab}&${type}=${encodeURIComponent(message)}`);
}

function tableSetupError(tableName: string) {
  return `Table Supabase "${tableName}" introuvable. Executez supabase/schema.sql dans le SQL Editor du meme projet Supabase, puis relancez notify pgrst, 'reload schema';`;
}

function isMissingSchemaTable(error: { code?: string; message?: string }) {
  return error.code === "PGRST205" || error.message?.includes("schema cache");
}

function failFromError(error: { code?: string; message: string }, tableName: string, tab: string) {
  dashboardMessage("error", isMissingSchemaTable(error) ? tableSetupError(tableName) : error.message, tab);
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
  const { error } = await supabase.from("messages").insert({
    nom: value(formData, "name") || value(formData, "nom"),
    email: value(formData, "email"),
    message: value(formData, "message")
  });

  if (error) redirect(`/contact?error=${encodeURIComponent(error.message)}`);
  redirect("/contact?sent=1");
}

export async function upsertText(formData: FormData) {
  const supabase = await requireContentRole();
  const id = value(formData, "id");
  const payload = {
    titre: value(formData, "titre"),
    contenu: value(formData, "contenu")
  };

  const { error } = id
    ? await supabase.from("textes").update(payload).eq("id", id)
    : await supabase.from("textes").insert(payload);

  if (error) failFromError(error, "public.textes", "texts");
  revalidatePublicSite();
  dashboardMessage("success", "Modification enregistree.", "texts");
}

export async function deleteText(formData: FormData) {
  const supabase = await requireContentRole();
  const { error } = await supabase.from("textes").delete().eq("id", value(formData, "id"));
  if (error) failFromError(error, "public.textes", "texts");
  revalidatePublicSite();
  dashboardMessage("success", "Texte supprime.", "texts");
}

export async function upsertOffer(formData: FormData) {
  const supabase = await requireContentRole();
  const id = value(formData, "id");
  const payload = {
    titre: value(formData, "titre"),
    prix: value(formData, "prix"),
    description: value(formData, "description")
  };

  const { error } = id
    ? await supabase.from("offres").update(payload).eq("id", id)
    : await supabase.from("offres").insert(payload);

  if (error) failFromError(error, "public.offres", "offers");
  revalidatePublicSite();
  dashboardMessage("success", "Modification enregistree.", "offers");
}

export async function deleteOffer(formData: FormData) {
  const supabase = await requireContentRole();
  const { error } = await supabase.from("offres").delete().eq("id", value(formData, "id"));
  if (error) failFromError(error, "public.offres", "offers");
  revalidatePublicSite();
  dashboardMessage("success", "Offre supprimee.", "offers");
}

export async function upsertArticle(formData: FormData) {
  const supabase = await requireContentRole();
  const id = value(formData, "id");
  const payload = {
    titre: value(formData, "titre"),
    contenu: value(formData, "contenu"),
    image_url: value(formData, "image_url") || null
  };

  const { error } = id
    ? await supabase.from("articles").update(payload).eq("id", id)
    : await supabase.from("articles").insert(payload);

  if (error) failFromError(error, "public.articles", "articles");
  revalidatePublicSite();
  dashboardMessage("success", "Modification enregistree.", "articles");
}

export async function deleteArticle(formData: FormData) {
  const supabase = await requireContentRole();
  const { error } = await supabase.from("articles").delete().eq("id", value(formData, "id"));
  if (error) failFromError(error, "public.articles", "articles");
  revalidatePublicSite();
  dashboardMessage("success", "Article supprime.", "articles");
}

export async function uploadMedia(formData: FormData) {
  const supabase = await requireContentRole();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    dashboardMessage("error", "Selectionnez un fichier a uploader.", "media");
  }
  const uploadedFile = file as File;

  if (uploadedFile.size > maxActionUploadSize) {
    dashboardMessage("error", "Fichier trop lourd : utilisez un fichier de moins de 4 Mo.", "media");
  }

  const type = uploadedFile.type.startsWith("video/") ? "video" : "image";
  const extension = uploadedFile.name.split(".").pop() ?? "jpg";
  const safeName = `${type}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("media").upload(safeName, uploadedFile, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    dashboardMessage("error", `Upload impossible : ${error.message}. Verifiez le bucket Storage public "media".`, "media");
  }

  const { data } = supabase.storage.from("media").getPublicUrl(safeName);
  const { error: insertError } = await supabase.from("media").insert({
    type,
    url: data.publicUrl
  });

  if (insertError) failFromError(insertError, "public.media", "media");
  revalidatePublicSite();
  dashboardMessage("success", "Media ajoute.", "media");
}

export async function deleteMedia(formData: FormData) {
  const supabase = await requireContentRole();
  const id = value(formData, "id");
  const { data } = await supabase.from("media").select("url").eq("id", id).maybeSingle();

  if (data?.url?.includes("/storage/v1/object/public/media/")) {
    const storagePath = data.url.split("/storage/v1/object/public/media/")[1]?.split("?")[0];
    if (storagePath) {
      await supabase.storage.from("media").remove([decodeURIComponent(storagePath)]);
    }
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) failFromError(error, "public.media", "media");
  revalidatePublicSite();
  dashboardMessage("success", "Media supprime.", "media");
}

export async function upsertMessage(formData: FormData) {
  const supabase = await requireContentRole();
  const id = value(formData, "id");
  const payload = {
    nom: value(formData, "nom"),
    email: value(formData, "email"),
    message: value(formData, "message")
  };

  const { error } = id
    ? await supabase.from("messages").update(payload).eq("id", id)
    : await supabase.from("messages").insert(payload);

  if (error) failFromError(error, "public.messages", "messages");
  revalidatePublicSite();
  dashboardMessage("success", "Modification enregistree.", "messages");
}

export async function deleteMessage(formData: FormData) {
  const supabase = await requireContentRole();
  const { error } = await supabase.from("messages").delete().eq("id", value(formData, "id"));
  if (error) failFromError(error, "public.messages", "messages");
  revalidatePublicSite();
  dashboardMessage("success", "Message supprime.", "messages");
}
