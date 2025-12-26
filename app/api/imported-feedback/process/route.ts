import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { LOCKED_TRAITS } from "@/lib/imported-feedback-traits"

// OCR function using AI SDK for text extraction
async function extractTextFromImage(imageUrl: string): Promise<{ text: string; confidence: number }> {
  try {
    // Use AI SDK with vision model for OCR
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
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
              text: "Extract all text from this image. Return only the extracted text, nothing else. If this appears to be feedback, a message, or a review, preserve the original formatting and structure.",
            },
          ],
        },
      ],
    })

    // Simple confidence heuristic: longer text = higher confidence
    const wordCount = text.trim().split(/\s+/).length
    const confidence = Math.min(wordCount / 50, 1)

    return { text, confidence: Number(confidence.toFixed(2)) }
  } catch (error) {
    console.error("[v0] OCR extraction error:", error)
    throw new Error("Failed to extract text from image")
  }
}

// AI extraction with strict bounded prompt
async function extractStructuredFeedback(ocrText: string): Promise<{
  excerpt: string | null
  giverName: string
  giverCompany: string | null
  giverRole: string | null
  sourceType: string | null
  approxDate: string | null
  traits: string[]
  confidence: number
}> {
  try {
    const systemPrompt = `You are a deterministic extraction assistant. Extract ONLY the following from feedback text:

1. Positive excerpt (1-2 sentences, verbatim or lightly trimmed, must be genuinely positive)
2. Giver name (or "Not specified")
3. Company/organization name (if present)
4. Giver role/title (if present)
5. Source type: one of [Email, LinkedIn, DM, Review, Other]
6. Approximate date (YYYY-MM-DD format if present)
7. Traits: Select UP TO 3 from this LOCKED list ONLY: ${LOCKED_TRAITS.join(", ")}
8. Confidence score (0-1, based on clarity and positivity)

STRICT RULES:
- Do NOT invent traits outside the locked list
- Do NOT rewrite creatively, only extract verbatim or trim lightly
- If no positive content found, set excerpt to null and confidence < 0.6
- If confidence < 0.6, the item requires manual review
- Extract ONLY what is clearly present, do not infer

Return valid JSON with this structure:
{
  "excerpt": "...",
  "giverName": "...",
  "giverCompany": "..." or null,
  "giverRole": "..." or null,
  "sourceType": "..." or null,
  "approxDate": "..." or null,
  "traits": ["...", "..."],
  "confidence": 0.85
}`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Extract structured data from this text:\n\n${ocrText}`,
        },
      ],
    })

    // Parse AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON")
    }

    const extracted = JSON.parse(jsonMatch[0])

    // Validate traits are from locked list
    const validTraits = extracted.traits.filter((t: string) => LOCKED_TRAITS.includes(t as any)).slice(0, 3)

    return {
      excerpt: extracted.excerpt || null,
      giverName: extracted.giverName || "Not specified",
      giverCompany: extracted.giverCompany || null,
      giverRole: extracted.giverRole || null,
      sourceType: extracted.sourceType || null,
      approxDate: extracted.approxDate || null,
      traits: validTraits,
      confidence: Math.max(0, Math.min(1, Number(extracted.confidence))),
    }
  } catch (error) {
    console.error("[v0] AI extraction error:", error)
    throw new Error("Failed to extract structured feedback")
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { imageUrl, profileId, recordId } = await request.json()

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

    try {
      // Step 1: OCR extraction
      console.log("[v0] Starting OCR extraction for image:", imageUrl)
      const { text: ocrText, confidence: ocrConfidence } = await extractTextFromImage(imageUrl)

      if (!ocrText || ocrText.trim().length < 10) {
        await supabase
          .from("imported_feedback")
          .update({
            ai_extracted_excerpt: "Could not extract text",
            giver_name: "Review needed",
            confidence_score: 0,
          })
          .eq("id", recordId)

        return NextResponse.json({
          id: recordId,
          requiresReview: true,
          confidence: 0,
          message: "Could not extract meaningful text. Please review manually.",
        })
      }

      console.log("[v0] OCR extraction complete. Text length:", ocrText.length, "Confidence:", ocrConfidence)

      // Step 2: AI structured extraction
      console.log("[v0] Starting AI structured extraction")
      const extracted = await extractStructuredFeedback(ocrText)

      console.log("[v0] AI extraction complete. Confidence:", extracted.confidence, "Traits:", extracted.traits)

      // Step 3: Update database record with extracted data
      const { error } = await supabase
        .from("imported_feedback")
        .update({
          ocr_text: ocrText,
          ai_extracted_excerpt: extracted.excerpt,
          giver_name: extracted.giverName,
          giver_company: extracted.giverCompany,
          giver_role: extracted.giverRole,
          source_type: extracted.sourceType,
          approx_date: extracted.approxDate,
          traits: extracted.traits,
          confidence_score: extracted.confidence,
        })
        .eq("id", recordId)

      if (error) {
        console.error("[v0] Database update error:", error)
        throw new Error("Failed to update imported feedback")
      }

      console.log("[v0] Successfully updated imported feedback:", recordId)

      return NextResponse.json({
        id: recordId,
        requiresReview: extracted.confidence < 0.6,
        confidence: extracted.confidence,
      })
    } catch (processingError) {
      console.error("[v0] Processing error:", processingError)

      await supabase
        .from("imported_feedback")
        .update({
          ai_extracted_excerpt: "Processing failed - manual review needed",
          giver_name: "Review needed",
          confidence_score: 0,
        })
        .eq("id", recordId)

      return NextResponse.json({
        id: recordId,
        requiresReview: true,
        confidence: 0,
        message: "Processing failed. Please review and edit manually.",
      })
    }
  } catch (error) {
    console.error("[v0] Process error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 })
  }
}
