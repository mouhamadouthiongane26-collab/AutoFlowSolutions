import { createSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "./admin-dashboard"
import { getArticles, getMedia, getMessages, getOffers, getTexts } from "@/lib/data"
import type { UserRole } from "@/lib/defaults"
import { signOut } from "@/app/actions"

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
    return <AccessDenied userEmail={user.email} role={role} />
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

function AccessDenied({ userEmail, role }: { userEmail?: string; role?: UserRole }) {
  return (
    <main className="mesh-bg grid min-h-screen place-items-center px-4 py-10">
      <section className="glass-card w-full max-w-lg p-6">
        <img src="/logo-autoflow.svg" alt="AutoFlowSolutions" className="mb-6 h-16 w-auto rounded-lg bg-white px-3 py-2 shadow-glow" />
        <h1 className="text-2xl font-bold">Acces admin non autorise</h1>
        <p className="mt-3 leading-7 text-slatecopy">
          Vous etes connecte avec {userEmail ?? "ce compte"}, mais ce compte n'a pas encore le role admin.
          Role actuel : {role ?? "aucun"}.
        </p>
        <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-slatecopy">
          Dans Supabase, mettez ce compte en admin dans la table profiles, puis reconnectez-vous.
        </p>
        <form action={signOut} className="mt-6">
          <button className="button-secondary" type="submit">Se deconnecter</button>
        </form>
      </section>
    </main>
  )
}
