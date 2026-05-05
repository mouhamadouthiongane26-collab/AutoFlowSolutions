import { createSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard"
import { getArticles, getMedia, getMessages, getOffers, getTexts } from "@/lib/data"
import type { UserRole } from "@/lib/defaults"

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string; tab?: string }>
}) {
  const params = await searchParams
  const supabase = await createSupabaseClient()
  if (!supabase) redirect("/admin/login?error=Configuration%20Supabase%20manquante%20sur%20le%20serveur.")

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  const role = profile?.role as UserRole | undefined

  if (role !== "admin") {
    redirect("/admin/login?error=Acces%20admin%20non%20autorise.")
  }

    const [texts, offers, articles, media, messages] = await Promise.all([
      getTexts(),
      getOffers(),
      getArticles(),
      getMedia(),
      getMessages()
    ])

  return (
    <AdminDashboard
    texts={texts}
    offers={offers}
    articles={articles}
    media={media}
    messages={messages}
    userEmail={user.email}
    role={role}
    error={params.error}
    success={params.success}
    initialTab={params.tab}
  />
  )
}
