export interface HighlightPattern {
  phrase: string
  tier: "theme" | "working-style" | "contextual"
  frequency: number
}

export function extractHighlightPatterns(
  contributions: any[],
  importedFeedback: any[],
  traits: any[] = [],
): HighlightPattern[] {
  const patterns: HighlightPattern[] = []
  const phraseCounts = new Map<string, { tier: string; count: number }>()

  // TIER 1: THEME KEYWORDS (from Pattern Recognition traits)
  // These are the core reputation themes that define the person
  const traitPhrases = new Set<string>()
  contributions.forEach((c) => {
    const allTraits = [
      ...(c.traits_category1 || []),
      ...(c.traits_category2 || []),
      ...(c.traits_category3 || []),
      ...(c.traits_category4 || []),
    ]
    allTraits.forEach((trait) => traitPhrases.add(trait.toLowerCase()))
  })

  // Count theme keyword frequency
  traitPhrases.forEach((trait) => {
    let count = 0

    contributions.forEach((c) => {
      const written = (c.written_note || "").toLowerCase()
      if (written.includes(trait)) count++
    })
    importedFeedback.forEach((f) => {
      const excerpt = (f.ai_extracted_excerpt || "").toLowerCase()
      if (excerpt.includes(trait)) count++
    })

    if (count >= 2) {
      phraseCounts.set(trait, { tier: "theme", count })
    }
  })

  // TIER 2: WORKING-STYLE ATTRIBUTES
  // Phrases that describe collaboration and day-to-day experience
  const workingStylePhrases = [
    "asks the right questions",
    "ask the right questions",
    "builds trust",
    "building trust",
    "easy to work with",
    "open and collaborative",
    "thinks strategically",
    "strategic thinking",
    "strategic thinker",
    "stays authentic",
    "brings fresh ideas",
    "positive energy",
    "creative approach",
    "thoughtful",
    "detail-oriented",
    "organized",
    "prepared",
    "reliable",
    "goes above and beyond",
    "clear communication",
    "responsive",
  ]

  workingStylePhrases.forEach((phrase) => {
    let count = 0
    const lowerPhrase = phrase.toLowerCase()

    contributions.forEach((c) => {
      if ((c.written_note || "").toLowerCase().includes(lowerPhrase)) {
        count++
      }
    })
    importedFeedback.forEach((f) => {
      if ((f.ai_extracted_excerpt || "").toLowerCase().includes(lowerPhrase)) {
        count++
      }
    })

    if (count >= 2) {
      phraseCounts.set(lowerPhrase, { tier: "working-style", count })
    }
  })

  // TIER 3: CONTEXTUAL STRENGTHS (sparing, concrete execution)
  // Only highlight if they appear 2+ times
  const contextualPhrases = [
    "helped us",
    "helped me",
    "solved problems",
    "problem solver",
    "drove engagement",
    "improved performance",
    "built relationships",
    "delivered results",
    "exceeded expectations",
    "created value",
    "strategic partner",
    "business acumen",
  ]

  contextualPhrases.forEach((phrase) => {
    let count = 0
    const lowerPhrase = phrase.toLowerCase()

    contributions.forEach((c) => {
      if ((c.written_note || "").toLowerCase().includes(lowerPhrase)) {
        count++
      }
    })
    importedFeedback.forEach((f) => {
      if ((f.ai_extracted_excerpt || "").toLowerCase().includes(lowerPhrase)) {
        count++
      }
    })

    if (count >= 2) {
      phraseCounts.set(lowerPhrase, { tier: "contextual", count })
    }
  })

  // Convert to array and prioritize by tier, then frequency
  phraseCounts.forEach((value, key) => {
    patterns.push({
      phrase: key,
      tier: value.tier as any,
      frequency: value.count,
    })
  })

  // Sort: theme keywords first (highest frequency), then working-style, then contextual
  patterns.sort((a, b) => {
    if (a.tier !== b.tier) {
      const tierOrder = { theme: 0, "working-style": 1, contextual: 2 }
      return tierOrder[a.tier] - tierOrder[b.tier]
    }
    return b.frequency - a.frequency
  })

  return patterns
}
