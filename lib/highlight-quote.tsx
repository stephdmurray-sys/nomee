import type React from "react"
import type { HighlightPattern } from "./extract-highlight-patterns"

export function highlightQuote(text: string, patterns: HighlightPattern[], maxHighlights = 4): React.ReactNode {
  if (!text || patterns.length === 0) return text

  const matches: { phrase: string; index: number; length: number; tier: string }[] = []

  // Find all matches with their tier information
  patterns.forEach((pattern) => {
    const regex = new RegExp(`\\b${pattern.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        phrase: match[0],
        index: match.index,
        length: match[0].length,
        tier: pattern.tier,
      })
    }
  })

  if (matches.length === 0) return text

  // Sort by tier priority and then by position
  matches.sort((a, b) => {
    const tierOrder = { theme: 0, "working-style": 1, contextual: 2 }
    if (a.tier !== b.tier) {
      return tierOrder[a.tier as keyof typeof tierOrder] - tierOrder[b.tier as keyof typeof tierOrder]
    }
    return a.index - b.index
  })

  // Remove overlaps, prioritizing theme keywords
  const nonOverlapping: typeof matches = []
  let lastEnd = 0

  for (const match of matches) {
    if (match.index >= lastEnd) {
      nonOverlapping.push(match)
      lastEnd = match.index + match.length
      if (nonOverlapping.length >= maxHighlights) break
    }
  }

  if (nonOverlapping.length === 0) return text

  // Build the highlighted text with tiered styling
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  nonOverlapping.forEach((match, idx) => {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    // Tiered styling: theme (strong blue), working-style (neutral), contextual (subtle)
    let className = ""
    if (match.tier === "theme") {
      // TIER 1: Theme keywords - trust blue 12% opacity, most prominent
      className = "bg-blue-500/12 px-1 rounded font-medium"
    } else if (match.tier === "working-style") {
      // TIER 2: Working-style - neutral gray 8% opacity, secondary emphasis
      className = "bg-neutral-400/8 px-1 rounded font-medium"
    } else {
      // TIER 3: Contextual - subtle gray 5% opacity, minimal emphasis
      className = "bg-neutral-300/5 px-0.5 rounded"
    }

    parts.push(
      <span key={`highlight-${idx}`} className={className}>
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
