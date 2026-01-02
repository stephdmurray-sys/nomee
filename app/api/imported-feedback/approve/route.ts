import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    console.log("[v0] Approve: Checking auth")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("[v0] Approve: Auth error:", authError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    if (!user) {
      console.error("[v0] Approve: No user found")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("[v0] Approve: User authenticated:", user.id)

    const { feedbackId, updates } = await request.json()

    if (!feedbackId) {
      return NextResponse.json({ error: "Missing feedback ID" }, { status: 400 })
    }

    console.log("[v0] Approve: Checking ownership for feedback:", feedbackId)

    const { data: feedback, error: fetchError } = await supabase
      .from("imported_feedback")
      .select("profile_id")
      .eq("id", feedbackId)
      .single()

    if (fetchError) {
      console.error("[v0] Approve: Fetch error:", fetchError)
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    if (!feedback || feedback.profile_id !== user.id) {
      console.error("[v0] Approve: Ownership mismatch. Feedback profile_id:", feedback?.profile_id, "User id:", user.id)
      return NextResponse.json({ error: "You don't have permission to edit this feedback" }, { status: 403 })
    }

    console.log("[v0] Approve: Ownership verified, updating feedback")

    const giverName = updates?.giverName
    if (!giverName || giverName === "Review needed" || giverName === "Unknown" || giverName.trim() === "") {
      console.error("[v0] Approve: Missing giver_name")
      return NextResponse.json(
        { error: "Giver name is required. Please provide the name of the person who gave this feedback." },
        { status: 400 },
      )
    }

    const giverCompany = updates?.giverCompany
    if (
      !giverCompany ||
      giverCompany === "Not specified" ||
      giverCompany === "Needs input" ||
      giverCompany.trim() === ""
    ) {
      console.error("[v0] Approve: Missing giver_company")
      return NextResponse.json(
        { error: "Company or relationship context is required. Please provide this information before approving." },
        { status: 400 },
      )
    }

    const giverRole = updates?.giverRole
    if (!giverRole || giverRole === "Not specified" || giverRole === "Needs input" || giverRole.trim() === "") {
      console.error("[v0] Approve: Missing giver_role")
      return NextResponse.json(
        { error: "Role or relationship type is required. Please provide this information before approving." },
        { status: 400 },
      )
    }

    // Update and approve
    const updateData: any = {
      approved_by_owner: true,
      approved_at: new Date().toISOString(),
      visibility: updates?.visibility || "public",
    }

    if (updates) {
      if (updates.excerpt) updateData.ai_extracted_excerpt = updates.excerpt
      if (updates.giverName) updateData.giver_name = updates.giverName
      if (updates.giverCompany !== undefined) updateData.giver_company = updates.giverCompany
      if (updates.giverRole !== undefined) updateData.giver_role = updates.giverRole
      if (updates.sourceType !== undefined) updateData.source_type = updates.sourceType
      if (updates.approxDate !== undefined) updateData.approx_date = updates.approxDate
      if (updates.traits) updateData.traits = updates.traits
    }

    const { error: updateError } = await supabase.from("imported_feedback").update(updateData).eq("id", feedbackId)

    if (updateError) {
      console.error("[v0] Approve: Update error:", updateError)
      return NextResponse.json({ error: "Failed to approve feedback" }, { status: 500 })
    }

    console.log("[v0] Approve: Success")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Approve: Exception:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Approval failed",
      },
      { status: 500 },
    )
  }
}
