import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import UploadForm from "./upload-form"

export default async function ImportedFeedbackUploadPage() {
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

  // Check plan limits for uploaded feedback
  const { data: existingFeedback } = await supabase.from("imported_feedback").select("id").eq("profile_id", profile.id)

  const uploadCount = existingFeedback?.length || 0
  const plan = profile.plan || "free"
  const uploadLimit = plan === "free" ? 5 : plan === "starter" ? 15 : Number.POSITIVE_INFINITY

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-neutral-900">Import Previous Feedback</h1>
          <p className="text-lg text-neutral-600">
            Upload screenshots and we'll extract the positive feedback using AI
          </p>
        </div>

        {uploadCount >= uploadLimit ? (
          <div className="p-8 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="mb-2 text-lg font-semibold text-amber-900">Upload Limit Reached</h3>
            <p className="mb-4 text-sm text-amber-800">
              You've uploaded {uploadCount} of {uploadLimit} items on your {plan} plan.
            </p>
            <Button asChild>
              <Link href="/pricing">Upgrade to upload more</Link>
            </Button>
          </div>
        ) : (
          <UploadForm profileId={profile.id} currentCount={uploadCount} limit={uploadLimit} />
        )}
      </div>
    </div>
  )
}
