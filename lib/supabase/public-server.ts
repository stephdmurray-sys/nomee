import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Public Supabase client for anonymous access to public data
 * Used for public profile pages and other non-authenticated routes
 */
export async function createPublicServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please add SUPABASE_URL and SUPABASE_ANON_KEY in the Vars section.",
    )
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Cookie setting fails in Server Components, which is fine
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Cookie removal fails in Server Components, which is fine
        }
      },
    },
  })
}
