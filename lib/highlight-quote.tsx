import type React from "react"
import type { HighlightPattern } from "./extract-highlight-patterns"

export function highlightQuote(text: string, patterns: HighlightPattern[], maxHighlights = 5): React.ReactNode {
  if (!text || patterns.length === 0) return text

  const validPatterns = patterns.filter((p) => p && typeof p.phrase === "string" && p.phrase.trim().length > 0)

  if (validPatterns.length === 0) return text

  const matches: { phrase: string; index: number; length: number; tier: string }[] = []

  // Find all matches with their tier information
  validPatterns.forEach((pattern) => {
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

  // Build the highlighted text with light blue marker style (NO PILLS)
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  nonOverlapping.forEach((match, idx) => {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    // Increased visual emphasis of inline highlights for better scanning
    parts.push(
      <span key={`highlight-${idx}`} className="bg-blue-100 px-1.5 py-0.5 rounded-md font-medium text-slate-900">
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
