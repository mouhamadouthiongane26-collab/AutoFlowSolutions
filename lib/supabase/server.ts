import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Server Components cannot write cookies. Middleware/Server Actions handle auth cookie updates.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch {
            // Server Components cannot write cookies. Middleware/Server Actions handle auth cookie updates.
          }
        },
      },
    }
  )
}
