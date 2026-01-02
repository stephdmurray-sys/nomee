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

    const { imageUrl, imagePath, profileId, sourceType } = await request.json()

    console.log("[CREATE_RECORD] Received request:", {
      hasImageUrl: !!imageUrl,
      hasImagePath: !!imagePath,
      profileId,
      sourceType,
      userId: user.id,
    })

    if (!imageUrl || !profileId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!sourceType) {
      return NextResponse.json({ error: "Source type is required" }, { status: 400 })
    }

    const validSourceTypes = ["Email", "LinkedIn", "DM", "Review", "Other"]
    if (!validSourceTypes.includes(sourceType)) {
      console.error("[CREATE_RECORD] Invalid source type:", { sourceType, validTypes: validSourceTypes })
      return NextResponse.json(
        {
          ok: false,
          code: "INVALID_SOURCE_TYPE",
          message: "Invalid source selected",
          details: `Source type "${sourceType}" is not valid`,
          hint: `Must be one of: ${validSourceTypes.join(", ")}`,
        },
        { status: 400 },
      )
    }

    console.log("[CREATE_RECORD] Validating profile ownership...")

    // The profiles.id IS the auth user ID, so we just verify profileId matches user.id
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", profileId).single()

    if (!profile || profile.id !== user.id) {
      console.error("[CREATE_RECORD] Profile not found or unauthorized:", { profileId, userId: user.id })
      return NextResponse.json(
        {
          ok: false,
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found",
          details: "The profile ID is invalid or you don't have access",
          hint: "Make sure you're uploading to your own profile",
        },
        { status: 403 },
      )
    }

    console.log("[CREATE_RECORD] Profile validated, inserting record...")

    const insertPayload = {
      profile_id: profileId,
      raw_image_url: imageUrl,
      source_type: sourceType,
      // Database defaults handle the rest:
      // ocr_text: null (default)
      // ai_extracted_excerpt: null (default)
      // giver_name: 'Not specified' (default)
      // approved_by_owner: false (default)
      // visibility: 'private' (default)
    }

    console.log("[CREATE_RECORD] Insert payload:", insertPayload)

    const { data: importedFeedback, error } = await supabase
      .from("imported_feedback")
      .insert(insertPayload)
      .select()
      .single()

    if (error) {
      console.error("[CREATE_RECORD] Database insert failed:", {
        error: error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: JSON.stringify(error, null, 2),
      })

      return NextResponse.json(
        {
          ok: false,
          code: error.code || "DB_INSERT_FAILED",
          message: "We couldn't save this file yet",
          details: error.message,
          hint: error.hint || "Check the browser console for full error details",
        },
        { status: 500 },
      )
    }

    console.log("[CREATE_RECORD] Successfully created record:", {
      id: importedFeedback.id,
      sourceType: importedFeedback.source_type,
      profileId: importedFeedback.profile_id,
    })

    return NextResponse.json({
      ok: true,
      id: importedFeedback.id,
      status: "created",
    })
  } catch (error) {
    console.error("[CREATE_RECORD] Unexpected error:", error)

    return NextResponse.json(
      {
        ok: false,
        code: "UNEXPECTED_ERROR",
        message: "We couldn't save this file yet",
        details: error instanceof Error ? error.message : "Unknown error",
        hint: "Check the browser console for full error details",
      },
      { status: 500 },
    )
  }
}
