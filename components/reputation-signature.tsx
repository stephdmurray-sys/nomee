"use client"

import { useState } from "react"
import * as Tooltip from "@radix-ui/react-tooltip"

interface Recognition {
  feedback_text: string
  working_relationship?: string
}

interface KeywordChip {
  keyword: string
  count: number
  consensusRatio: number
  tier: "large" | "medium" | "small"
  exampleQuote?: string
}

// Synonym mapping for grouping similar traits
const SYNONYM_MAP: Record<string, string[]> = {
  Reliable: ["reliable", "dependable", "consistent", "trustworthy"],
  Communicative: ["communicative", "clear communicator", "great communication", "articulate"],
  "Detail-oriented": ["detail-oriented", "meticulous", "thorough", "careful"],
  Strategic: ["strategic", "strategic thinker", "visionary"],
  Supportive: ["supportive", "helpful", "encouraging"],
  "Team player": ["team player", "collaborative", "cooperative"],
  Efficient: ["efficient", "productive", "gets things done"],
  Creative: ["creative", "innovative", "inventive"],
  "Problem solver": ["problem solver", "solution-oriented", "resourceful"],
  Professional: ["professional", "polished"],
  "Calm under pressure": ["calm under pressure", "composed", "level-headed"],
  Organized: ["organized", "structured", "systematic"],
  Responsive: ["responsive", "quick to respond", "timely"],
  Knowledgeable: ["knowledgeable", "expert", "skilled"],
  "High ownership": ["high ownership", "takes ownership", "accountable", "responsible"],
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  const lowerText = text.toLowerCase()
  const keywords: string[] = []

  // Check all synonym groups
  for (const [canonical, synonyms] of Object.entries(SYNONYM_MAP)) {
    for (const synonym of synonyms) {
      if (lowerText.includes(synonym)) {
        keywords.push(canonical)
        break
      }
    }
  }

  // Additional pattern matching for common descriptive phrases
  const patterns = [
    /\b(always|very|extremely|incredibly)\s+(\w+)\b/gi,
    /\b(great|excellent|amazing|fantastic|wonderful)\s+(\w+)\b/gi,
  ]

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      if (match[2]) {
        const adjective = match[2].charAt(0).toUpperCase() + match[2].slice(1)
        if (!keywords.some((k) => k.toLowerCase() === adjective.toLowerCase())) {
          keywords.push(adjective)
        }
      }
    }
  })

  return [...new Set(keywords)] // Remove duplicates
}

// Calculate relationship weights
function getRelationshipWeight(relationship?: string): number {
  const normalized = relationship?.toLowerCase() || ""
  if (normalized.includes("manager")) return 1.1
  if (normalized.includes("client")) return 1.05
  return 1.0
}

// Generate keyword chips from recognitions
function generateKeywordChips(recognitions: Recognition[]): KeywordChip[] {
  const totalSubmissions = recognitions.length
  if (totalSubmissions === 0) return []

  const keywordData = new Map<
    string,
    {
      count: number
      weightedScore: number
      exampleQuotes: string[]
    }
  >()

  // Extract keywords from each recognition
  recognitions.forEach((recognition) => {
    const keywords = extractKeywords(recognition.feedback_text)
    const weight = getRelationshipWeight(recognition.working_relationship)

    keywords.forEach((keyword) => {
      const existing = keywordData.get(keyword) || {
        count: 0,
        weightedScore: 0,
        exampleQuotes: [],
      }

      existing.count += 1
      existing.weightedScore += weight

      // Store example quote (first 100 chars)
      if (existing.exampleQuotes.length < 3) {
        const excerpt = recognition.feedback_text.slice(0, 100)
        existing.exampleQuotes.push(excerpt + (recognition.feedback_text.length > 100 ? "..." : ""))
      }

      keywordData.set(keyword, existing)
    })
  })

  // Convert to chips and calculate consensus
  const chips: KeywordChip[] = []
  keywordData.forEach((data, keyword) => {
    const consensusRatio = data.count / totalSubmissions

    // Only include keywords mentioned in at least 20% of submissions
    if (consensusRatio >= 0.2) {
      let tier: "large" | "medium" | "small"
      if (consensusRatio >= 0.66) tier = "large"
      else if (consensusRatio >= 0.4) tier = "medium"
      else tier = "small"

      chips.push({
        keyword,
        count: data.count,
        consensusRatio,
        tier,
        exampleQuote: data.exampleQuotes[0],
      })
    }
  })

  // Sort by consensus ratio desc, then count desc
  chips.sort((a, b) => {
    if (b.consensusRatio !== a.consensusRatio) {
      return b.consensusRatio - a.consensusRatio
    }
    return b.count - a.count
  })

  // Return top 16
  return chips.slice(0, 16)
}

function getKeywordColor(keyword: string): string {
  const lowerKeyword = keyword.toLowerCase()

  // Leadership / strategic traits → Soft Sky
  if (lowerKeyword.includes("strategic") || lowerKeyword.includes("leader") || lowerKeyword.includes("visionary")) {
    return "bg-soft-sky"
  }

  // Emotional / human traits → Warm Sand
  if (lowerKeyword.includes("supportive") || lowerKeyword.includes("empathy") || lowerKeyword.includes("kind")) {
    return "bg-warm-sand"
  }

  // Execution / reliability traits → Pale Sage
  if (lowerKeyword.includes("reliable") || lowerKeyword.includes("efficient") || lowerKeyword.includes("organized")) {
    return "bg-pale-sage"
  }

  // Collaboration traits → Light Blush
  if (
    lowerKeyword.includes("team") ||
    lowerKeyword.includes("collaborative") ||
    lowerKeyword.includes("communicative")
  ) {
    return "bg-light-blush"
  }

  // Default to soft sky
  return "bg-soft-sky"
}

interface ReputationSignatureProps {
  recognitions: Recognition[]
  totalCount: number
}

export function ReputationSignature({ recognitions, totalCount }: ReputationSignatureProps) {
  const [mounted, setMounted] = useState(false)
  const chips = generateKeywordChips(recognitions)

  // Trigger animation after mount
  if (!mounted) {
    setTimeout(() => setMounted(true), 50)
  }

  return (
    <Tooltip.Provider delayDuration={200}>
      <section className="py-12 mb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-near-black mb-10 text-center tracking-tight">
            Reputation Signature
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {chips.slice(0, 16).map((chip, index) => {
              const colorClass = getKeywordColor(chip.keyword)

              return (
                <Tooltip.Root key={chip.keyword}>
                  <Tooltip.Trigger asChild>
                    <button
                      className={`
                        px-5 py-2.5 rounded-full
                        transition-all duration-200 hover:scale-105
                        hover:shadow-[0px_4px_12px_rgba(0,0,0,0.08)]
                        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                        ${colorClass}
                        text-near-black
                        ${chip.tier === "large" ? "text-xl font-semibold" : ""}
                        ${chip.tier === "medium" ? "text-lg font-medium" : ""}
                        ${chip.tier === "small" ? "text-base font-normal" : ""}
                      `}
                      style={{
                        transitionDelay: `${index * 50}ms`,
                      }}
                    >
                      {chip.keyword}
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-near-black text-white px-4 py-3 rounded-lg text-sm max-w-xs shadow-xl z-50"
                      sideOffset={5}
                    >
                      <div className="font-medium mb-1">
                        Mentioned in {chip.count} of {totalCount} Nomee{totalCount > 1 ? "s" : ""}
                      </div>
                      {chip.exampleQuote && (
                        <div className="text-neutral-300 text-xs italic">"{chip.exampleQuote}"</div>
                      )}
                      <Tooltip.Arrow className="fill-near-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )
            })}
          </div>

          <p className="text-sm text-soft-gray-text text-center">
            Built from repeated themes across Nomees — not a single opinion.
          </p>
        </div>
      </section>
    </Tooltip.Provider>
  )
}
