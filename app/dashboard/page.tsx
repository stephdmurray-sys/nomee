import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DashboardClient from "./dashboard-client"
import LogoutButton from "./logout-button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/onboarding")
  }

  const { data: contributions } = await supabase
    .from("contributions")
    .select("*")
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false })

  const allContributions = contributions || []
  const confirmedContributions = allContributions
  const pendingContributions: any[] = []

  const publicUrl = profile.slug ? `https://www.nomee.co/${profile.slug}` : null
  const collectionUrl = profile.slug ? `https://www.nomee.co/c/${profile.slug}` : null

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Nomee</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">{user.email}</span>
            {publicUrl && (
              <Button variant="outline" asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  View Public Page
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h2 className="mb-2 text-4xl font-bold text-neutral-900">Welcome back, {profile.full_name}</h2>
          <p className="text-xl text-neutral-600">Your professional reputation — captured and ready to share</p>
        </div>

        <DashboardClient
          profile={profile}
          confirmedCount={confirmedContributions.length}
          pendingCount={pendingContributions.length}
          publicUrl={publicUrl}
          collectionUrl={collectionUrl}
          contributions={allContributions}
        />
      </div>
    </div>
  )
}
