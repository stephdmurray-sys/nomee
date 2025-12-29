import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const contributionId = formData.get("contributionId") as string

    console.log("[VOICE] API: Attaching voice to contribution", {
      contributionId,
      hasFile: !!file,
      fileSize: file?.size,
      fileType: file?.type,
    })

    if (!contributionId || !file) {
      return NextResponse.json(
        { ok: false, error: "Missing contribution ID or file", code: "MISSING_PARAMS" },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()

    const timestamp = Date.now()
    const fileExt = file.name.split(".").pop() || "webm"
    const fileName = `audio/${contributionId}-${timestamp}.${fileExt}`

    console.log("[VOICE] API: Uploading to storage", {
      fileName,
      bucket: "nomee-audio",
    })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("nomee-audio")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error("[VOICE] API: Upload error", {
        error: uploadError,
        message: uploadError.message,
      })

      await supabase
        .from("contributions")
        .update({
          audio_status: "failed",
        })
        .eq("id", contributionId)

      return NextResponse.json(
        {
          ok: false,
          error: "Failed to upload voice recording. Please try again.",
          code: "UPLOAD_ERROR",
          details: uploadError.message,
        },
        { status: 500 },
      )
    }

    const { data: publicUrlData } = supabase.storage.from("nomee-audio").getPublicUrl(fileName)

    console.log("[VOICE] API: Upload successful, updating contribution", {
      voiceUrl: publicUrlData.publicUrl,
      contributionId,
    })

    const { data: updatedContribution, error: updateError } = await supabase
      .from("contributions")
      .update({
        voice_url: publicUrlData.publicUrl,
        audio_status: "uploaded",
        audio_path: fileName,
      })
      .eq("id", contributionId)
      .select()
      .single()

    if (updateError) {
      console.error("[VOICE] API: DB update error", {
        error: updateError,
        message: updateError.message,
      })
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to attach voice to contribution. Please try again.",
          code: "DB_UPDATE_ERROR",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    console.log("[VOICE] API: ✅ Voice attached successfully", {
      contributionId,
      voiceUrl: publicUrlData.publicUrl,
      hasVoiceUrl: !!updatedContribution.voice_url,
    })

    return NextResponse.json(
      {
        ok: true,
        success: true,
        voiceUrl: publicUrlData.publicUrl,
        message: "Voice recording attached successfully",
        contribution: updatedContribution,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[VOICE] API: Unexpected error", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json(
      {
        ok: false,
        error: "An unexpected error occurred. Please try again.",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
