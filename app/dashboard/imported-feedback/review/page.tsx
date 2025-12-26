import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ReviewList from "./review-list"

export default async function ImportedFeedbackReviewPage() {
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

  // Get all imported feedback for this profile (approved or not)
  const { data: importedFeedback } = await supabase
    .from("imported_feedback")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })

  const pendingReview = importedFeedback?.filter((f) => !f.approved_by_owner) || []
  const approved = importedFeedback?.filter((f) => f.approved_by_owner) || []

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/imported-feedback/upload">Upload More</Link>
          </Button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-neutral-900">Review Imported Feedback</h1>
          <p className="text-lg text-neutral-600">
            Review and approve extracted feedback before it appears on your public profile
          </p>
        </div>

        <ReviewList pending={pendingReview} approved={approved} profileId={profile.id} />
      </div>
    </div>
  )
}
