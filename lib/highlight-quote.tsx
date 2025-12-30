import type React from "react"
import type { HighlightPattern } from "./extract-highlight-patterns"

const IMPACT_PHRASES = [
  "increased",
  "grew",
  "drove",
  "improved",
  "exceeded",
  "highest",
  "revenue",
  "conversion",
  "engagement",
  "launched",
  "delivered",
  "saved",
  "reduced",
  "shipped",
  "led",
  "scaled",
  "promoted",
  "generated",
  "boosted",
  "accelerated",
  "transformed",
  "streamlined",
  "optimized",
  "pioneered",
  "achieved",
  "tripled",
  "doubled",
  "quadrupled",
  "outperformed",
  "surpassed",
]

// Curated impact dictionary for Layer A
const CURATED_IMPACT_DICTIONARY = [
  "incredible",
  "amazing",
  "exceptional",
  "outstanding",
  "remarkable",
  "excellent",
  "brilliant",
  "fantastic",
  "wonderful",
  "superb",
  "stellar",
  "phenomenal",
  "extraordinary",
  "invaluable",
  "indispensable",
  "irreplaceable",
  "game-changer",
  "visionary",
  "innovative",
  "creative",
  "strategic",
  "thoughtful",
  "reliable",
  "trustworthy",
  "dedicated",
  "passionate",
  "driven",
  "proactive",
  "collaborative",
  "supportive",
  "inspiring",
  "empowering",
  "transformative",
  "impactful",
  "effective",
  "efficient",
  "organized",
  "detail-oriented",
  "results-driven",
  "solution-oriented",
  "professional",
  "genuine",
  "authentic",
  "calm",
  "composed",
  "resilient",
  "adaptable",
  "flexible",
  "resourceful",
  "knowledgeable",
  "experienced",
  "skilled",
]

// Stopwords and generic filler to NEVER highlight
const NEVER_HIGHLIGHT = new Set([
  "good",
  "nice",
  "great",
  "very",
  "really",
  "just",
  "like",
  "also",
  "even",
  "much",
  "many",
  "some",
  "any",
  "all",
  "most",
  "more",
  "less",
  "few",
  "such",
  "quite",
  "rather",
  "pretty",
  "somewhat",
  "kind",
  "sort",
  "thing",
  "stuff",
  "lot",
  "lots",
  "bit",
  "way",
  "ways",
  "time",
  "times",
  "day",
  "days",
  "work",
  "working",
  "worked",
  "person",
  "people",
  "team",
  "teams",
])

export function highlightQuote(
  text: string,
  patterns: HighlightPattern[],
  maxHighlights = 8,
  enableTwoTone = true,
  useMarkerStyle = true,
  selectedVibes: string[] = [], // New: currently selected vibe pills
  topSignals: string[] = [], // New: top signals computed on page load
): React.ReactNode {
  if (!text || text.trim().length === 0) return text

  // ===== LAYER A: Deterministic matching (no AI) =====
  const matches: { phrase: string; index: number; length: number; tier: string; color: "marker" | "impact" }[] = []

  // 1. Match extracted traits from the record
  const validPatterns = patterns.filter((p) => p && typeof p.phrase === "string" && p.phrase.trim().length > 0)
  validPatterns.forEach((pattern) => {
    if (NEVER_HIGHLIGHT.has(pattern.phrase.toLowerCase())) return
    const regex = new RegExp(`\\b${pattern.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        phrase: match[0],
        index: match.index,
        length: match[0].length,
        tier: pattern.tier,
        color: "marker",
      })
    }
  })

  // 2. Match currently selected vibe pills
  selectedVibes.forEach((vibe) => {
    if (NEVER_HIGHLIGHT.has(vibe.toLowerCase())) return
    const regex = new RegExp(`\\b${vibe.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        phrase: match[0],
        index: match.index,
        length: match[0].length,
        tier: "vibe",
        color: "marker",
      })
    }
  })

  // 3. Match top signals computed on page load
  topSignals.forEach((signal) => {
    if (NEVER_HIGHLIGHT.has(signal.toLowerCase())) return
    const regex = new RegExp(`\\b${signal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        phrase: match[0],
        index: match.index,
        length: match[0].length,
        tier: "signal",
        color: "marker",
      })
    }
  })

  // 4. Match curated impact dictionary
  CURATED_IMPACT_DICTIONARY.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        phrase: match[0],
        index: match.index,
        length: match[0].length,
        tier: "curated",
        color: "marker",
      })
    }
  })

  // 5. Match impact phrases (verbs/outcomes) if two-tone enabled
  if (enableTwoTone) {
    // Match numbers/percentages
    const numberRegex = /\b(\d+%|\$[\d,]+|\d+x|\d+\s*(weeks?|months?|days?|years?|hours?))\b/gi
    let numMatch
    while ((numMatch = numberRegex.exec(text)) !== null) {
      matches.push({
        phrase: numMatch[0],
        index: numMatch.index,
        length: numMatch[0].length,
        tier: "impact",
        color: "impact",
      })
    }

    // Match impact verbs
    IMPACT_PHRASES.forEach((phrase) => {
      const regex = new RegExp(`\\b${phrase}\\b`, "gi")
      let match
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          phrase: match[0],
          index: match.index,
          length: match[0].length,
          tier: "impact",
          color: "impact",
        })
      }
    })
  }

  // ===== LAYER B: AI Fallback (only if Layer A finds zero) =====
  // This is handled by extractKeywordsFromText which has its own fallback logic
  // If we still have zero matches here, the text renders without highlights (acceptable)

  if (matches.length === 0) return text

  // Sort by tier priority (marker > impact) and then by position
  matches.sort((a, b) => {
    if (a.color !== b.color) {
      return a.color === "marker" ? -1 : 1
    }
    const tierOrder = { theme: 0, vibe: 1, signal: 2, "working-style": 3, curated: 4, contextual: 5, impact: 6 }
    if (a.tier !== b.tier) {
      return (tierOrder[a.tier as keyof typeof tierOrder] ?? 99) - (tierOrder[b.tier as keyof typeof tierOrder] ?? 99)
    }
    return a.index - b.index
  })

  // Remove overlaps, prioritizing marker highlights
  const nonOverlapping: typeof matches = []
  let lastEnd = 0
  let markerCount = 0
  let impactCount = 0
  const maxMarker = Math.min(maxHighlights, 5)
  const maxImpact = 3

  for (const match of matches) {
    if (match.index >= lastEnd) {
      if (match.color === "marker" && markerCount >= maxMarker) continue
      if (match.color === "impact" && impactCount >= maxImpact) continue

      nonOverlapping.push(match)
      lastEnd = match.index + match.length

      if (match.color === "marker") markerCount++
      else impactCount++
    }
  }

  if (nonOverlapping.length === 0) return text

  // Re-sort by position for building the output
  nonOverlapping.sort((a, b) => a.index - b.index)

  // Build the highlighted text with appropriate CSS classes
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  nonOverlapping.forEach((match, idx) => {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const className = useMarkerStyle
      ? match.color === "marker"
        ? "nomee-highlight-marker"
        : "nomee-highlight-impact"
      : match.color === "marker"
        ? "nomee-highlight"
        : "nomee-highlight-impact"

    parts.push(
      <span
        key={`highlight-${idx}`}
        className={className}
        title={match.tier !== "impact" ? `Signal: ${match.tier}` : undefined}
      >
        {match.phrase}
      </span>,
    )

    lastIndex = match.index + match.length
  })

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}
