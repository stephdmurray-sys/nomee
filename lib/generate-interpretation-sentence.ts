import { generateText } from "ai"

interface TraitData {
  label: string
  count: number
  weightedCount: number
}

export async function generateInterpretationSentence(
  personName: string,
  topTraits: TraitData[],
  totalVerifiedCount: number,
): Promise<string> {
  // If confidence is low or data is sparse, return neutral fallback
  if (topTraits.length === 0) {
    return `People describe working with ${personName.split(" ")[0]} as thoughtful and professional.`
  }

  if (topTraits.length === 1) {
    const trait = topTraits[0].label.toLowerCase()
    return `People describe working with ${personName.split(" ")[0]} as ${trait} in day-to-day collaboration.`
  }

  // Use only top 3-5 traits
  const traitsToUse = topTraits.slice(0, Math.min(5, topTraits.length))
  const traitLabels = traitsToUse.map((t) => t.label).join(", ")

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      temperature: 0.3,
      maxTokens: 100,
      messages: [
        {
          role: "system",
          content: `You are generating a single editorial sentence that summarizes what it feels like to work with a person based on verified feedback traits.

HARD RULES:
- Output exactly ONE sentence
- Maximum 25 words
- Use only provided traits
- Do NOT invent new qualities
- Do NOT exaggerate
- Do NOT use hype words or superlatives
- Do NOT mention AI, models, or analysis
- Do NOT mention counts or numbers
- Do NOT repeat the headline text

FORBIDDEN WORDS:
best, exceptional, world-class, top-tier, outstanding, amazing, incredible, rockstar, superstar, passionate, visionary, thought leader, highly, extremely, very, proven, guaranteed

APPROVED STYLE:
- Editorial, observational, plainspoken, professional
- Use patterns like:
  * "People describe working with X as..."
  * "Those who've worked with X often mention..."
  * "Working with X is frequently described as..."

Return only the sentence. No quotes. No markdown. No explanation.`,
        },
        {
          role: "user",
          content: `Person's name: ${personName}
Top verified traits: ${traitLabels}
Number of verified contributors: ${totalVerifiedCount}

Generate the interpretation sentence now.`,
        },
      ],
    })

    // Clean up the response
    const cleanedText = text
      .trim()
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .replace(/\*\*/g, "") // Remove markdown bold
      .replace(/\n/g, " ") // Remove line breaks

    return cleanedText
  } catch (error) {
    console.error("[v0] Error generating interpretation sentence:", error)
    // Fallback to a neutral sentence
    return `People describe working with ${personName.split(" ")[0]} as ${traitsToUse
      .slice(0, 3)
      .map((t) => t.label.toLowerCase())
      .join(", ")}.`
  }
}
