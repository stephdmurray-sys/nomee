import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    console.log("[v0] Update visibility: Checking auth")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Update visibility: Auth failed:", authError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("[v0] Update visibility: User authenticated:", user.id)

    const { feedbackId, visibility } = await request.json()

    if (!feedbackId || !visibility) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: feedback, error: fetchError } = await supabase
      .from("imported_feedback")
      .select("profile_id")
      .eq("id", feedbackId)
      .single()

    if (fetchError) {
      console.error("[v0] Update visibility: Fetch error:", fetchError)
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    if (!feedback || feedback.profile_id !== user.id) {
      console.error("[v0] Update visibility: Ownership mismatch")
      return NextResponse.json({ error: "You don't have permission to edit this feedback" }, { status: 403 })
    }

    const { error: updateError } = await supabase.from("imported_feedback").update({ visibility }).eq("id", feedbackId)

    if (updateError) {
      console.error("[v0] Update visibility error:", updateError)
      return NextResponse.json({ error: "Failed to update visibility" }, { status: 500 })
    }

    console.log("[v0] Update visibility: Success")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update visibility: Exception:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Update failed",
      },
      { status: 500 },
    )
  }
}
