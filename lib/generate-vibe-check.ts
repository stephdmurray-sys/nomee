import { generateText } from "ai"

// Approved vibe taxonomy - AI must use ONLY these labels
const APPROVED_VIBES = [
  // Pace
  "Fast-paced",
  "Steady",
  "High-momentum",
  "Thoughtful pace",
  // Presence
  "Calm presence",
  "Grounded",
  "Energizing",
  "Supportive",
  // Action
  "Gets things moving",
  "Low-friction",
  "Focused",
  "Intentional",
  // Collaboration
  "Easy to work with",
  "Clear and direct",
  "Open and collaborative",
  "Trust-building",
  // Creative approach
  "Creative flow",
  "Structured creativity",
  "Idea-forward",
  "Builder energy",
] as const

type ApprovedVibe = (typeof APPROVED_VIBES)[number]

interface Contribution {
  written_note?: string
  voice_url?: string | null
  relationship?: string
  contributor_name?: string
}

/**
 * Generate vibe labels from verified Nomee contributions
 * Uses AI to analyze energy, pace, tone, and collaboration feel
 * Returns 3-5 vibe labels from the approved taxonomy only
 */
export async function generateVibeCheck(contributions: Contribution[]): Promise<ApprovedVibe[]> {
  if (contributions.length === 0) {
    return []
  }

  // Extract all written feedback
  const feedbackTexts = contributions
    .filter((c) => c.written_note && c.written_note.length > 20)
    .map((c) => c.written_note)
    .join("\n\n")

  if (!feedbackTexts) {
    return []
  }

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are analyzing professional feedback to identify the ENERGY and FELT EXPERIENCE of working with someone.

APPROVED VIBES (use ONLY these exact labels):
${APPROVED_VIBES.join(", ")}

FEEDBACK TO ANALYZE:
${feedbackTexts}

INSTRUCTIONS:
- Identify 3-5 vibes that capture the ENERGY people feel when working with this person
- Focus on pace, presence, collaboration style, and creative approach
- Use ONLY labels from the approved list above
- Do NOT invent new labels
- Do NOT focus on skills or traits
- Focus on what it FEELS LIKE to work together

Return ONLY a JSON array of 3-5 vibe labels, for example:
["Fast-paced", "Energizing", "Gets things moving", "Clear and direct"]

Your response:`,
      temperature: 0.3,
    })

    let cleanedText = text.trim()

    // Remove markdown code block syntax if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    // Parse the cleaned AI response
    const vibes = JSON.parse(cleanedText.trim())

    // Validate that all vibes are from approved list
    const validVibes = vibes.filter((vibe: string) => APPROVED_VIBES.includes(vibe as ApprovedVibe))

    // Return 3-5 vibes
    return validVibes.slice(0, 5) as ApprovedVibe[]
  } catch (error) {
    console.error("Error generating vibe check:", error)
    return []
  }
}
