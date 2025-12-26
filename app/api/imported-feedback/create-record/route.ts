import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { imageUrl, profileId } = await request.json()

    if (!imageUrl || !profileId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", profileId)
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found or unauthorized" }, { status: 403 })
    }

    const { data: importedFeedback, error } = await supabase
      .from("imported_feedback")
      .insert({
        profile_id: profileId,
        raw_image_url: imageUrl,
        ocr_text: null,
        ai_extracted_excerpt: "Processing...",
        giver_name: "Processing...",
        giver_company: null,
        giver_role: null,
        source_type: null,
        approx_date: null,
        traits: [],
        confidence_score: null,
        approved_by_owner: false,
        visibility: "private",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database insert error:", error)
      return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
    }

    console.log("[v0] Created imported_feedback record:", importedFeedback.id)

    return NextResponse.json({
      id: importedFeedback.id,
      status: "pending_processing",
    })
  } catch (error) {
    console.error("[v0] Create record error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create record" },
      { status: 500 },
    )
  }
}
