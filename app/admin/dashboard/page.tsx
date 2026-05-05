import { createSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard"
import { getArticles, getOffers, getSections, getMedia, getMessages } from "@/lib/data"

export default async function DashboardPage() {
  const supabase = await createSupabaseClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

    const [sections, offers, articles, media, messages] = await Promise.all([
      getSections(),
      getOffers(),
      getArticles({ includeDrafts: true }),
      getMedia(),
      getMessages()
    ])

  return (
    <AdminDashboard
    sections={sections}
    offers={offers}
    articles={articles}
    media={media}
    messages={messages}
    userEmail={user.email}
  />
  )
}