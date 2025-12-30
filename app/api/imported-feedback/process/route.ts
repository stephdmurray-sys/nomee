import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateText } from "ai"
import { LOCKED_TRAITS } from "@/lib/imported-feedback-traits"
import sharp from "sharp"

async function transcribeImage(imageBase64: string): Promise<{
  transcription_text: string
  transcription_confidence: number
}> {
  console.log("[v0] Starting text-only transcription pass")

  const { text } = await generateText({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: imageBase64,
          },
          {
            type: "text",
            text: `Extract ALL visible text from this image verbatim. Return ONLY the text you see, exactly as written.

Do not summarize, do not interpret, just transcribe.

If this is a LinkedIn recommendation, include: name, title, company, date, and the full recommendation text.
If this is an email, include: From, To, Subject, Date, and full email body.
If this is a Slack/Teams message, include: sender name, timestamp, and message content.
If this is a text/DM, include: contact name and message content.

Return JSON: {"text": "verbatim transcription here", "confidence": 0.95}

Confidence scale:
- 1.0 = crystal clear, all text perfectly readable
- 0.7-0.9 = mostly clear, minor blur or artifacts
- 0.4-0.6 = partially readable, some text unclear
- 0.0-0.3 = mostly unreadable, poor quality image`,
          },
        ],
      },
    ],
  })

  console.log("[v0] Transcription response:", text.substring(0, 200))

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("AI did not return valid JSON")
  }

  const parsed = JSON.parse(jsonMatch[0])
  return {
    transcription_text: parsed.text || "",
    transcription_confidence: Math.max(0, Math.min(1, Number(parsed.confidence || 0))),
  }
}

async function extractStructuredData(
  imageBase64: string,
  transcribedText: string,
): Promise<{
  giver_name: string
  role: string | null
  company: string | null
  excerpt: string | null
  traits: string[]
  source_type: string | null
  approx_date: string | null
  confidence: {
    overall: number
    giverName: number
    excerpt: number
    source: number
  }
}> {
  console.log("[v0] Starting structured data extraction")

  const systemPrompt = `You are a feedback extraction assistant. Based on this screenshot AND the transcribed text below, extract structured data.

TRANSCRIBED TEXT:
${transcribedText}

LOCKED TRAITS (select UP TO 3 that best apply): ${LOCKED_TRAITS.join(", ")}

Return ONLY valid JSON with this exact structure:
{
  "giver_name": "Full name of person who wrote this feedback (NOT the recipient)",
  "role": "Job title/role if visible, or null",
  "company": "Company/organization name if visible, or null",
  "excerpt": "1-2 sentence verbatim positive quote about the recipient from the recommendation/feedback",
  "traits": ["trait1", "trait2", "trait3"],
  "source_type": "Best match from: LinkedIn, Email, Slack, Teams, Text, DM, Facebook, Other",
  "approx_date": "YYYY-MM-DD format if date visible, or null",
  "confidence": {
    "overall": 0.85,
    "giverName": 0.9,
    "excerpt": 0.8,
    "source": 0.7
  }
}

CRITICAL RULES:
- giver_name is who WROTE the feedback, not who received it
- excerpt should be verbatim positive feedback content about the recipient
- Only use traits from the LOCKED list
- For LinkedIn: name/title/company is in the profile card at top
- For Email: name is in "From:" line, company may be in signature
- Set confidence based on how clearly you can identify each field from the image
- If a required field is visible in the screenshot, it MUST be filled (not null)`

  const { text } = await generateText({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: imageBase64,
          },
          {
            type: "text",
            text: systemPrompt,
          },
        ],
      },
    ],
  })

  console.log("[v0] Structured extraction response:", text)

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("AI did not return valid JSON")
  }

  const extracted = JSON.parse(jsonMatch[0])

  // Validate traits
  const validTraits = (extracted.traits || []).filter((t: string) => LOCKED_TRAITS.includes(t as any)).slice(0, 3)

  return {
    giver_name: extracted.giver_name || "Unknown",
    role: extracted.role || null,
    company: extracted.company || null,
    excerpt: extracted.excerpt || null,
    traits: validTraits,
    source_type: extracted.source_type || null,
    approx_date: extracted.approx_date || null,
    confidence: {
      overall: Math.max(0, Math.min(1, Number(extracted.confidence?.overall || 0))),
      giverName: Math.max(0, Math.min(1, Number(extracted.confidence?.giverName || 0))),
      excerpt: Math.max(0, Math.min(1, Number(extracted.confidence?.excerpt || 0))),
      source: Math.max(0, Math.min(1, Number(extracted.confidence?.source || 0))),
    },
  }
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const { profileId, recordId } = await request.json()

  console.log("[v0] Processing extraction request:", { profileId, recordId })

  if (!profileId || !recordId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Verify profile access
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", profileId).single()
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 403 })
  }

  // Get current record
  const { data: currentRecord } = await supabase.from("imported_feedback").select("*").eq("id", recordId).single()

  if (!currentRecord) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 })
  }

  const attemptNumber = (currentRecord.extraction_attempts || 0) + 1

  await supabase
    .from("imported_feedback")
    .update({ extraction_status: "processing", extraction_attempts: attemptNumber })
    .eq("id", recordId)

  try {
    let imageBuffer: Buffer
    let bytesDownloaded: number

    const storedImageUrl = currentRecord.raw_image_url

    if (!storedImageUrl) {
      throw new Error("No image URL available in raw_image_url")
    }

    console.log("[v0] Stored image URL:", storedImageUrl)
    console.log("[v0] URL type check - starts with http:", storedImageUrl.startsWith("http"))

    if (storedImageUrl.startsWith("http://") || storedImageUrl.startsWith("https://")) {
      console.log("[v0] Detected Vercel Blob URL, using fetch")

      const fetchResponse = await fetch(storedImageUrl)
      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch from Vercel Blob (${fetchResponse.status}): ${fetchResponse.statusText}`)
      }

      imageBuffer = Buffer.from(await fetchResponse.arrayBuffer())
      bytesDownloaded = imageBuffer.length

      console.log("[v0] Downloaded from Vercel Blob:", bytesDownloaded, "bytes")
    } else {
      // It's a Supabase Storage path (relative path only)
      console.log("[v0] Detected Supabase Storage path, using SDK")

      const { data: imageData, error: downloadError } = await supabase.storage
        .from("imported-feedback")
        .download(storedImageUrl)

      if (downloadError || !imageData) {
        throw new Error(`Supabase Storage download failed: ${downloadError?.message || "No data returned"}`)
      }

      imageBuffer = Buffer.from(await imageData.arrayBuffer())
      bytesDownloaded = imageBuffer.length

      console.log("[v0] Downloaded from Supabase Storage:", bytesDownloaded, "bytes")
    }

    await supabase
      .from("imported_feedback")
      .update({
        bytes_downloaded: bytesDownloaded,
      })
      .eq("id", recordId)

    const processedBuffer = await sharp(imageBuffer)
      .resize({ width: 1800, withoutEnlargement: true })
      .sharpen()
      .toBuffer()

    const imageBase64 = `data:image/jpeg;base64,${processedBuffer.toString("base64")}`
    console.log("[v0] Image preprocessed and converted to base64")

    const { transcription_text, transcription_confidence } = await transcribeImage(imageBase64)

    console.log("[v0] Transcription complete:", {
      textLength: transcription_text.length,
      confidence: transcription_confidence,
    })

    await supabase
      .from("imported_feedback")
      .update({
        transcription_len: transcription_text.length,
      })
      .eq("id", recordId)

    if (transcription_text.length < 80) {
      const error = "No readable text extracted (image too small, blurry, or no text visible)"
      console.error("[v0] Transcription failed:", error)

      await supabase
        .from("imported_feedback")
        .update({
          extraction_status: "failed",
          extraction_error: error,
          raw_transcription_text: transcription_text,
          extraction_attempts: attemptNumber,
          extracted_at: new Date().toISOString(),
        })
        .eq("id", recordId)

      return NextResponse.json({
        id: recordId,
        requiresReview: true,
        confidence: 0,
        attemptNumber,
        error,
      })
    }

    const extracted = await extractStructuredData(imageBase64, transcription_text)

    console.log("[v0] Extraction complete:", {
      giver_name: extracted.giver_name,
      hasExcerpt: !!extracted.excerpt,
      traits: extracted.traits,
      confidence: extracted.confidence.overall,
    })

    const updateData = {
      extraction_status: "success",
      extraction_error: null,
      raw_transcription_text: transcription_text,
      raw_model_response: extracted as any,
      extraction_attempts: attemptNumber,
      extracted_at: new Date().toISOString(),
      // Extracted fields
      giver_name: extracted.giver_name,
      giver_role: extracted.role,
      giver_company: extracted.company,
      ai_extracted_excerpt: extracted.excerpt,
      traits: extracted.traits,
      source_type: extracted.source_type || currentRecord.source_type,
      approx_date: extracted.approx_date,
      confidence_score: extracted.confidence.overall,
      confidence_details: extracted.confidence as any,
      ocr_text: transcription_text,
      ocr_confidence: transcription_confidence,
      included_in_analysis: extracted.confidence.overall >= 0.5,
    }

    const { error: updateError } = await supabase.from("imported_feedback").update(updateData).eq("id", recordId)

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    console.log("[v0] Extraction successful, database updated")

    return NextResponse.json({
      id: recordId,
      requiresReview: extracted.confidence.overall < 0.7,
      confidence: extracted.confidence.overall,
      attemptNumber,
      extracted: {
        giver_name: extracted.giver_name,
        role: extracted.role,
        company: extracted.company,
        excerpt: extracted.excerpt,
        traits: extracted.traits,
        source_type: extracted.source_type,
      },
    })
  } catch (error) {
    console.error("[v0] Extraction failed:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    await supabase
      .from("imported_feedback")
      .update({
        extraction_status: "failed",
        extraction_error: errorMessage,
        extraction_attempts: attemptNumber,
        extracted_at: new Date().toISOString(),
      })
      .eq("id", recordId)

    return NextResponse.json({
      id: recordId,
      requiresReview: true,
      confidence: 0,
      attemptNumber,
      error: errorMessage,
    })
  }
}
