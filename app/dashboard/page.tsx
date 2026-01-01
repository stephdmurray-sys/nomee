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

  const { data: importedFeedback } = await supabase
    .from("imported_feedback")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })

  const allContributions = contributions || []
  const allImportedFeedback = importedFeedback || []
  const confirmedContributions = allContributions.filter((c) => c.status === "confirmed")
  const pendingContributions = allContributions.filter((c) => c.status === "pending")

  const importedStats = {
    pending: allImportedFeedback.filter((f) => !f.approved_by_owner && f.extraction_status === "completed").length,
    approved: allImportedFeedback.filter((f) => f.approved_by_owner).length,
    failed: allImportedFeedback.filter((f) => f.extraction_status === "failed").length,
    processing: allImportedFeedback.filter(
      (f) => f.extraction_status === "queued" || f.extraction_status === "processing",
    ).length,
  }

  const publicUrl = profile.slug ? `https://www.nomee.co/${profile.slug}` : null
  const collectionUrl = profile.slug ? `https://www.nomee.co/c/${profile.slug}` : null

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/images/nomee-20logo-20transparent.png" alt="Nomee" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
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

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <h2 className="mb-2 text-4xl font-bold text-neutral-900">
            Welcome back, {profile.full_name?.split(" ")[0] || profile.full_name}
          </h2>
          <p className="text-xl text-neutral-600">
            Your professional reputation — captured, current, and ready to share.
          </p>
        </div>

        <DashboardClient
          profile={profile}
          confirmedCount={confirmedContributions.length}
          pendingCount={pendingContributions.length}
          publicUrl={publicUrl}
          collectionUrl={collectionUrl}
          contributions={allContributions}
          importedFeedback={allImportedFeedback}
          importedStats={importedStats}
        />
      </div>
    </div>
  )
}
