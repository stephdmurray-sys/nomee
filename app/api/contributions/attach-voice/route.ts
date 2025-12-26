import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const contributionId = formData.get("contributionId") as string

    console.log("[v0] API - Attaching voice to contribution:", contributionId)

    if (!contributionId || !file) {
      return NextResponse.json(
        { ok: false, error: "Missing contribution ID or file", code: "MISSING_PARAMS" },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()

    const timestamp = Date.now()
    const fileExt = file.name.split(".").pop() || "webm"
    const fileName = `audio/${contributionId}.${fileExt}`

    console.log("[v0] API - Uploading voice file:", fileName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("nomee-audio")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true, // Allow re-uploads
      })

    if (uploadError) {
      console.error("[v0] API - Voice upload error:", uploadError)

      await supabase
        .from("contributions")
        .update({
          audio_status: "failed",
        })
        .eq("id", contributionId)

      return NextResponse.json(
        {
          ok: false,
          error: "Couldn't upload voice. Your message was already submitted successfully.",
          code: "UPLOAD_ERROR",
          details: uploadError.message,
        },
        { status: 500 },
      )
    }

    const { data: publicUrlData } = supabase.storage.from("nomee-audio").getPublicUrl(fileName)

    console.log("[v0] API - Voice uploaded:", publicUrlData.publicUrl)

    let audioDuration: number | null = null
    try {
      // Note: Duration calculation would require audio processing
      // For now, we'll leave it null and could add later if needed
      audioDuration = null
    } catch {
      // Ignore duration calculation errors
    }

    const { error: updateError } = await supabase
      .from("contributions")
      .update({
        voice_url: publicUrlData.publicUrl,
        audio_status: "uploaded",
        audio_path: fileName,
        audio_duration_ms: audioDuration,
      })
      .eq("id", contributionId)

    if (updateError) {
      console.error("[v0] API - Voice attachment error:", updateError)
      return NextResponse.json(
        {
          ok: false,
          error: "Couldn't attach voice. Your message was already submitted successfully.",
          code: "VOICE_ATTACH_ERROR",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] API - ✅ Voice attached successfully")

    return NextResponse.json(
      {
        ok: true,
        success: true,
        voiceUrl: publicUrlData.publicUrl,
        message: "Voice recording attached",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] API - Unexpected error in voice attachment:", error)
    return NextResponse.json(
      {
        ok: false,
        error: "Couldn't attach voice. Your message was already submitted successfully.",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
