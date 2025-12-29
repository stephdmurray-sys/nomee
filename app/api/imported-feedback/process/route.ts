import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateText } from "ai"
import { LOCKED_TRAITS } from "@/lib/imported-feedback-traits"
import { redactSensitiveData } from "@/lib/redact-sensitive-data"

async function extractFeedbackFromImage(imageUrl: string): Promise<{
  excerpt: string | null
  giverName: string
  giverCompany: string | null
  giverRole: string | null
  sourceType: string | null
  approxDate: string | null
  traits: string[]
  rawExtractedText: string
  confidence: {
    overall: number
    giverName: number
    excerpt: number
    source: number
  }
}> {
  try {
    console.log("[SCREENSHOT_EXTRACTION] Starting vision-based extraction for:", imageUrl)

    const systemPrompt = `You are a feedback extraction assistant. Extract structured data from this screenshot of positive feedback, recommendation, or testimonial.

THIS COULD BE FROM ANY SOURCE:
- LinkedIn recommendation (look for profile info, job titles, dates)
- Email (look for sender name, signature, company in signature)
- Slack message (look for username, profile picture, workspace name)
- Text message/DM (look for contact name, phone number context)
- Facebook post/message (look for profile name, page name)
- Teams message (look for display name, org context)
- Other platforms (extract visible identifying info)

LOCKED TRAITS (select UP TO 3 that best apply): ${LOCKED_TRAITS.join(", ")}

Return ONLY valid JSON with this exact structure:
{
  "excerpt": "1-2 sentence verbatim positive quote about the person (Stephanie/Steph/recipient), or null if not found",
  "giverName": "Full name of person who wrote this (NOT the recipient). If only partial name visible, use what you can see. If unclear, use 'Unknown'",
  "giverCompany": "Company/organization name if visible, or null",
  "giverRole": "Job title/role if visible, or null",
  "sourceType": "Best match from: LinkedIn, Email, Slack, Text, DM, Facebook, Teams, Other. If unclear, use 'Other'",
  "approxDate": "YYYY-MM-DD format if date visible anywhere in screenshot, or null",
  "traits": ["trait1", "trait2", "trait3"],
  "rawExtractedText": "All visible text from the image verbatim for debugging",
  "confidence": {
    "overall": 0.85,
    "giverName": 0.9,
    "excerpt": 0.8,
    "source": 0.7
  }
}

CRITICAL EXTRACTION RULES:
- Extract verbatim text, DO NOT rewrite or paraphrase
- Excerpt should be the POSITIVE FEEDBACK CONTENT about the recipient, not metadata
- giverName is who WROTE the feedback, not who received it
- Only use traits from the LOCKED list provided above
- Confidence scale: 0-1 (1 = very confident, 0.5 = moderate, <0.5 = uncertain)
- If you can clearly see positive feedback with identifiable sender, set overall >= 0.7
- If screenshot is blurry, unclear, or not feedback-related, set overall < 0.5
- Look for sender info in: profile headers, email "From:" lines, message headers, signatures
- For LinkedIn: extract from profile card (name, title @ company)
- For Email: extract from sender line and email signature
- For Slack/Teams: extract from message header and profile info
- For Text/DM: extract from contact name or conversation header`

    const { text } = await generateText({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: imageUrl,
            },
            {
              type: "text",
              text: systemPrompt,
            },
          ],
        },
      ],
    })

    console.log("[SCREENSHOT_EXTRACTION] Raw AI response:", text)

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON")
    }

    const extracted = JSON.parse(jsonMatch[0])

    // Validate and clean data
    const validTraits = (extracted.traits || []).filter((t: string) => LOCKED_TRAITS.includes(t as any)).slice(0, 3)

    const result = {
      excerpt: extracted.excerpt || null,
      giverName: extracted.giverName || "Unknown",
      giverCompany: extracted.giverCompany || null,
      giverRole: extracted.giverRole || null,
      sourceType: extracted.sourceType || null,
      approxDate: extracted.approxDate || null,
      traits: validTraits,
      rawExtractedText: extracted.rawExtractedText || "",
      confidence: {
        overall: Math.max(0, Math.min(1, Number(extracted.confidence?.overall || 0))),
        giverName: Math.max(0, Math.min(1, Number(extracted.confidence?.giverName || 0))),
        excerpt: Math.max(0, Math.min(1, Number(extracted.confidence?.excerpt || 0))),
        source: Math.max(0, Math.min(1, Number(extracted.confidence?.source || 0))),
      },
    }

    console.log("[SCREENSHOT_EXTRACTION] Extracted data:", {
      hasExcerpt: !!result.excerpt,
      giverName: result.giverName,
      traits: result.traits,
      overallConfidence: result.confidence.overall,
    })

    return result
  } catch (error) {
    console.error("[SCREENSHOT_EXTRACTION] Extraction error:", error)
    throw new Error(`Failed to extract: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    const { imageUrl, profileId, recordId } = await request.json()

    console.log("[SCREENSHOT_EXTRACTION] Processing request:", { imageUrl, profileId, recordId })

    if (!imageUrl || !profileId || !recordId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify profile exists
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", profileId).single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 403 })
    }

    const { data: currentRecord } = await supabase.from("imported_feedback").select("*").eq("id", recordId).single()

    const attemptNumber = (currentRecord?.extraction_attempts || 0) + 1

    try {
      // Extract feedback using vision model
      const extracted = await extractFeedbackFromImage(imageUrl)

      // Redact sensitive data from raw text
      const redactedText = redactSensitiveData(extracted.rawExtractedText)

      // Determine if this should be included in analysis
      const shouldIncludeInAnalysis =
        extracted.confidence.overall >= 0.5 && (extracted.excerpt !== null || extracted.giverName !== "Unknown")

      console.log("[SCREENSHOT_EXTRACTION] Extraction successful:", {
        recordId,
        attemptNumber,
        giverName: extracted.giverName,
        hasExcerpt: !!extracted.excerpt,
        confidence: extracted.confidence.overall,
        shouldIncludeInAnalysis,
      })

      const updateData: any = {
        ocr_text: redactedText,
        ocr_confidence: extracted.confidence.overall,
        included_in_analysis: shouldIncludeInAnalysis,
        ai_extracted_excerpt: extracted.excerpt,
        giver_name: extracted.giverName,
        giver_company: extracted.giverCompany,
        giver_role: extracted.giverRole,
        source_type: extracted.sourceType,
        approx_date: extracted.approxDate,
        traits: extracted.traits,
        confidence_score: extracted.confidence.overall,
      }

      if ("extraction_attempts" in currentRecord) {
        updateData.extraction_attempts = attemptNumber
        updateData.last_extraction_at = new Date().toISOString()
        updateData.last_extraction_error = null
        updateData.confidence_details = extracted.confidence
      }

      const { error: updateError } = await supabase.from("imported_feedback").update(updateData).eq("id", recordId)

      if (updateError) {
        console.error("[SCREENSHOT_EXTRACTION] Database update error:", updateError)
        throw new Error(`Failed to update database: ${updateError.message}`)
      }

      console.log("[SCREENSHOT_EXTRACTION] Database updated successfully for record:", recordId)

      return NextResponse.json({
        id: recordId,
        requiresReview: extracted.confidence.overall < 0.7,
        confidence: extracted.confidence.overall,
        attemptNumber,
        extracted: {
          excerpt: extracted.excerpt,
          giverName: extracted.giverName,
          giverCompany: extracted.giverCompany,
          giverRole: extracted.giverRole,
          sourceType: extracted.sourceType,
          traits: extracted.traits,
        },
      })
    } catch (processingError) {
      console.error("[SCREENSHOT_EXTRACTION] Processing failed:", processingError)

      const errorUpdateData: any = {
        ai_extracted_excerpt: null,
        giver_name: "Review needed",
        confidence_score: 0,
        ocr_text: `Extraction failed: ${processingError instanceof Error ? processingError.message : "Unknown error"}`,
      }

      if ("extraction_attempts" in currentRecord) {
        errorUpdateData.extraction_attempts = attemptNumber
        errorUpdateData.last_extraction_at = new Date().toISOString()
        errorUpdateData.last_extraction_error =
          processingError instanceof Error ? processingError.message : "Unknown error"
      }

      await supabase.from("imported_feedback").update(errorUpdateData).eq("id", recordId)

      return NextResponse.json({
        id: recordId,
        requiresReview: true,
        confidence: 0,
        attemptNumber,
        message: "We couldn't extract details automatically. You can still publish by adding info manually.",
        error: processingError instanceof Error ? processingError.message : "Extraction failed",
      })
    }
  } catch (error) {
    console.error("[SCREENSHOT_EXTRACTION] Request error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Processing failed",
      },
      { status: 500 },
    )
  }
}
