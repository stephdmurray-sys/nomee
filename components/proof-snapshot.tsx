"use client"

import { useState } from "react"
import type { TraitSignal, VibeSignal } from "@/lib/build-profile-analysis"
import { Briefcase, Sparkles, TrendingUp } from "lucide-react"

interface ProofSnapshotProps {
  traitSignals: TraitSignal[]
  vibeSignals: VibeSignal[]
  analysisText: string
  firstName: string
  onFilterChange?: (filter: { type: "trait" | "vibe" | "outcome"; value: string } | null) => void
}

const TRAIT_TO_VIBE_MAP: Record<string, string> = {
  Proactive: "Energizing",
  Prepared: "Energizing",
  "Fast Executor": "Energizing",
  Reliable: "Grounding",
  Calm: "Grounding",
  "Calm Under Pressure": "Grounding",
  Trustworthy: "Grounding",
  Collaborative: "Supportive",
  Kind: "Supportive",
  Supportive: "Supportive",
  Encouraging: "Supportive",
  Strategic: "Clarifying",
  "Problem solver": "Clarifying",
  "Strategic Thinker": "Clarifying",
  Analytical: "Clarifying",
  Creative: "Inspiring",
  Inspirational: "Inspiring",
  Visionary: "Inspiring",
  "Detail-Oriented": "Precise",
  Organized: "Precise",
  "Results-Driven": "Driven",
  Ambitious: "Driven",
}

export function ProofSnapshot({
  traitSignals,
  vibeSignals,
  analysisText,
  firstName,
  onFilterChange,
}: ProofSnapshotProps) {
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null)

  // Extract top 3 work style traits (highest count)
  const workStyle = traitSignals.slice(0, 3)

  let collaborationVibe = vibeSignals.slice(0, 3)
  if (collaborationVibe.length < 3) {
    const derivedVibes: Record<string, number> = {}

    // Add existing vibes
    collaborationVibe.forEach((v) => {
      derivedVibes[v.label] = v.count
    })

    // Derive more from traits
    traitSignals.forEach((trait) => {
      const mappedVibe = TRAIT_TO_VIBE_MAP[trait.label]
      if (mappedVibe && !derivedVibes[mappedVibe]) {
        derivedVibes[mappedVibe] = trait.count
      }
    })

    collaborationVibe = Object.entries(derivedVibes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }))
  }

  const outcomes = extractOutcomes(analysisText, 3)

  // Don't render if no data at all
  if (workStyle.length === 0 && collaborationVibe.length === 0 && outcomes.length === 0) {
    return null
  }

  const handleClick = (type: "trait" | "vibe" | "outcome", value: string) => {
    if (activeFilter?.type === type && activeFilter?.value === value) {
      setActiveFilter(null)
      onFilterChange?.(null)
    } else {
      setActiveFilter({ type, value })
      onFilterChange?.({ type, value })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Work Style */}
      {workStyle.length > 0 && (
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Work Style</h4>
          </div>
          <div className="space-y-2">
            {workStyle.map((trait, idx) => {
              const isActive = activeFilter?.type === "trait" && activeFilter?.value === trait.label
              return (
                <button
                  key={idx}
                  onClick={() => handleClick("trait", trait.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                    isActive
                      ? "bg-blue-100 border-blue-300 shadow-sm"
                      : "bg-blue-50 border-blue-100 hover:border-blue-200 hover:shadow-sm"
                  }`}
                >
                  <span className="text-sm font-medium text-neutral-800">{trait.label}</span>
                  <span className="text-xs font-semibold text-blue-600">×{trait.count}</span>
                </button>
              )
            })}
            <button
              className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1"
              onClick={() => handleClick("trait", workStyle[0]?.label || "")}
            >
              View proof →
            </button>
          </div>
        </div>
      )}

      {/* Collaboration Vibe */}
      {collaborationVibe.length > 0 && (
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Collaboration Vibe</h4>
          </div>
          <div className="space-y-2">
            {collaborationVibe.map((vibe, idx) => {
              const isActive = activeFilter?.type === "vibe" && activeFilter?.value === vibe.label
              return (
                <button
                  key={idx}
                  onClick={() => handleClick("vibe", vibe.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                    isActive
                      ? "bg-purple-100 border-purple-300 shadow-sm"
                      : "bg-purple-50 border-purple-100 hover:border-purple-200 hover:shadow-sm"
                  }`}
                >
                  <span className="text-sm font-medium text-neutral-800">{vibe.label}</span>
                  <span className="text-xs font-semibold text-purple-600">×{vibe.count}</span>
                </button>
              )
            })}
            <button
              className="text-xs text-purple-600 hover:text-purple-700 font-medium mt-1"
              onClick={() => handleClick("vibe", collaborationVibe[0]?.label || "")}
            >
              View proof →
            </button>
          </div>
        </div>
      )}

      {outcomes.length > 0 && (
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Outcomes people credit {firstName} for
            </h4>
          </div>
          <div className="space-y-2">
            {outcomes.map((outcome, idx) => {
              const isActive = activeFilter?.type === "outcome" && activeFilter?.value === outcome.keyword
              return (
                <button
                  key={idx}
                  onClick={() => handleClick("outcome", outcome.keyword)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                    isActive
                      ? "bg-amber-100 border-amber-300 shadow-sm"
                      : "bg-amber-50 border-amber-100 hover:border-amber-200 hover:shadow-sm"
                  }`}
                >
                  <span className="text-sm text-neutral-700 leading-relaxed">{outcome.phrase}</span>
                  <span className="text-xs font-semibold text-amber-600 ml-2">×{outcome.count}</span>
                </button>
              )
            })}
            <button
              className="text-xs text-amber-600 hover:text-amber-700 font-medium mt-1"
              onClick={() => handleClick("outcome", outcomes[0]?.keyword || "")}
            >
              View proof →
            </button>
          </div>
        </div>
      )}

      {/* Clear filter indicator */}
      {activeFilter && (
        <div className="md:col-span-3 flex items-center justify-center gap-2 pt-2">
          <span className="text-sm text-neutral-500">
            Filtering by: <span className="font-medium text-neutral-700">{activeFilter.value}</span>
          </span>
          <button
            onClick={() => {
              setActiveFilter(null)
              onFilterChange?.(null)
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  )
}

interface OutcomeResult {
  keyword: string
  phrase: string
  count: number
}

function extractOutcomes(text: string, maxOutcomes: number): OutcomeResult[] {
  if (!text || text.length < 50) return []

  // Outcome keywords to search for
  const outcomeKeywords = [
    "tripling",
    "doubled",
    "tripled",
    "quadrupled",
    "highest",
    "exceeded",
    "increased",
    "grew",
    "saved",
    "launched",
    "delivered",
    "achieved",
    "transformed",
    "improved",
    "boosted",
    "accelerated",
    "scaled",
    "record",
    "milestone",
    "breakthrough",
  ]

  // Also look for percentages, dollars, and timeframes
  const quantifierPatterns = [/\d+%/g, /\$[\d,]+/g, /\d+x/gi]

  const keywordCounts: Record<string, { phrase: string; count: number }> = {}
  const textLower = text.toLowerCase()

  // Count keyword occurrences
  for (const keyword of outcomeKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi")
    const matches = textLower.match(regex)
    if (matches && matches.length > 0) {
      // Extract a phrase around this keyword
      const phraseRegex = new RegExp(`[^.]*\\b${keyword}\\b[^.]{0,40}`, "i")
      const phraseMatch = text.match(phraseRegex)
      const phrase = phraseMatch ? phraseMatch[0].trim().slice(0, 60) : keyword

      keywordCounts[keyword] = {
        phrase: phrase.length > 50 ? phrase.slice(0, 50) + "..." : phrase,
        count: matches.length,
      }
    }
  }

  // Check for quantifiers
  for (const pattern of quantifierPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      for (const match of matches) {
        if (!keywordCounts[match]) {
          keywordCounts[match] = {
            phrase: match,
            count: 1,
          }
        }
      }
    }
  }

  // Sort by count and return top results
  return Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, maxOutcomes)
    .map(([keyword, data]) => ({
      keyword,
      phrase: data.phrase,
      count: data.count,
    }))
}
