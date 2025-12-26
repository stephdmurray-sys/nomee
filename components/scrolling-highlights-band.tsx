"use client"

import { useRef, useState } from "react"

interface Contribution {
  id: string
  message: string
  contributor_name: string
  relationship: string
}

interface ScrollingHighlightsBandProps {
  contributions: Contribution[]
}

function extractHighlightPhrase(message: string): string {
  // Extract 2-6 word meaningful phrases
  const sentences = message.split(/[.!?]+/).filter(Boolean)
  if (sentences.length === 0) return ""

  const firstSentence = sentences[0].trim()
  const words = firstSentence.split(/\s+/)

  // Try to find a meaningful 2-6 word phrase
  if (words.length >= 2 && words.length <= 6) {
    return firstSentence
  }

  // Take first 4-5 words if longer
  if (words.length > 6) {
    return words.slice(0, 4).join(" ")
  }

  return firstSentence
}

function formatRelationship(relationship: string): string {
  // Convert relationships to readable format
  const formatted = relationship.toLowerCase()
  if (formatted.includes("peer") || formatted.includes("colleague")) return "Colleague"
  if (formatted.includes("manager")) return "Manager"
  if (formatted.includes("client")) return "Client"
  if (formatted.includes("direct report")) return "Direct report"
  return "Colleague"
}

export function ScrollingHighlightsBand({ contributions }: ScrollingHighlightsBandProps) {
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Extract highlights from contributions
  const highlights = contributions
    .map((c) => {
      const phrase = extractHighlightPhrase(c.message)
      if (!phrase || phrase.length < 5) return null
      return {
        id: c.id,
        phrase,
        attribution: formatRelationship(c.relationship),
      }
    })
    .filter(Boolean) as { id: string; phrase: string; attribution: string }[]

  // Duplicate highlights for seamless loop
  const duplicatedHighlights = [...highlights, ...highlights, ...highlights]

  return (
    <div className="relative w-full overflow-hidden py-8 mb-16">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--warm-sand)] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--warm-sand)] to-transparent z-10 pointer-events-none" />

      {/* Scrolling content */}
      <div
        ref={scrollRef}
        className="flex gap-12 whitespace-nowrap animate-scroll-left"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedHighlights.map((highlight, idx) => (
          <span key={`${highlight.id}-${idx}`} className="inline-flex items-baseline gap-2 text-[var(--near-black)]">
            <span className="text-lg font-light tracking-wide">{highlight.phrase}</span>
            <span className="text-sm text-[var(--soft-gray-text)] font-light">— {highlight.attribution}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
