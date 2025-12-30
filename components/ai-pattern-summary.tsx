"use client"

import { useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

function safeString(str: string | null | undefined): string {
  return typeof str === "string" ? str : ""
}

function safeNumber(num: number | null | undefined, fallback = 0): number {
  return typeof num === "number" && !isNaN(num) ? num : fallback
}

export type TraitSignal = { label: string; count: number }
export type VibeSignal = { label: string; count: number }

interface TraitWithCount {
  label: string
  count: number
  weightedCount?: number
  category?: string
  examples?: string[]
}

interface AiPatternSummaryProps {
  // New interface
  traits?: TraitWithCount[]
  totalContributions?: number
  uniqueCompanies?: number
  interpretationSentence?: string
  vibeLabels?: string[]
  uploadsCount?: number
  voiceNotesCount?: number
  firstName?: string
  // Old interface
  analysisText?: string
  traitSignals?: TraitSignal[]
  vibeSignals?: VibeSignal[]
  contributionsCount?: number
}

export function AiPatternSummary({
  // New props
  traits,
  totalContributions,
  uniqueCompanies,
  interpretationSentence,
  vibeLabels,
  uploadsCount = 0,
  voiceNotesCount = 0,
  firstName: propFirstName,
  // Old props
  analysisText,
  traitSignals: directTraitSignals,
  vibeSignals: directVibeSignals,
  contributionsCount,
}: AiPatternSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const safeTraits = useMemo(() => safeArray(traits), [traits])
  const safeVibeLabels = useMemo(() => safeArray(vibeLabels), [vibeLabels])

  const firstName = safeString(propFirstName) || "this person"

  const traitSignals: TraitSignal[] = useMemo(() => {
    if (directTraitSignals) return directTraitSignals
    return safeTraits.map((t) => ({
      label: safeString(t?.label),
      count: safeNumber(t?.count, 1),
    }))
  }, [directTraitSignals, safeTraits])

  const vibeSignals: VibeSignal[] = useMemo(() => {
    if (directVibeSignals) return directVibeSignals
    return safeVibeLabels.map((v) => ({
      label: v,
      count: 1,
    }))
  }, [directVibeSignals, safeVibeLabels])

  const effectiveContributionsCount = safeNumber(contributionsCount) || safeNumber(totalContributions, 0)
  const effectiveAnalysisText = safeString(analysisText) || safeString(interpretationSentence)
  const totalDataCount = effectiveContributionsCount + safeNumber(uploadsCount, 0)

  const summary = useMemo(() => {
    const hasTraits = traitSignals.length > 0
    const hasVibes = vibeSignals.length > 0
    const hasText = effectiveAnalysisText.length >= 40

    const patterns: Array<{ label: string; type: "trait" | "vibe" }> = []

    traitSignals.slice(0, 3).forEach((t) => {
      if (t?.label) patterns.push({ label: t.label, type: "trait" })
    })

    if (patterns.length < 3) {
      vibeSignals.slice(0, 3 - patterns.length).forEach((v) => {
        if (v?.label) patterns.push({ label: v.label, type: "vibe" })
      })
    }

    let synthesis = ""
    const topThreeTraits = traitSignals.slice(0, 3)
    const topTwoVibes = vibeSignals.slice(0, 2)

    if (topThreeTraits.length > 0 && topThreeTraits[0]?.label) {
      if (totalDataCount === 1) {
        if (topThreeTraits.length >= 2 && topThreeTraits[1]?.label) {
          synthesis = `Early feedback describes this person as ${topThreeTraits[0].label.toLowerCase()} and ${topThreeTraits[1].label.toLowerCase()}${topThreeTraits.length >= 3 && topThreeTraits[2]?.label ? `, with a ${topThreeTraits[2].label.toLowerCase()} approach` : ""}.`
        } else {
          synthesis = `Early feedback describes this person as ${topThreeTraits[0].label.toLowerCase()}.`
        }
      } else if (totalDataCount === 2) {
        if (topThreeTraits.length >= 2 && topThreeTraits[1]?.label) {
          synthesis = `So far, this person comes through as ${topThreeTraits[0].label.toLowerCase()} and ${topThreeTraits[1].label.toLowerCase()}${topThreeTraits.length >= 3 && topThreeTraits[2]?.label ? `, with emphasis on ${topThreeTraits[2].label.toLowerCase()}` : ""}.`
        } else {
          synthesis = `So far, this person comes through as ${topThreeTraits[0].label.toLowerCase()}.`
        }
      } else if (totalDataCount >= 3 && totalDataCount < 5) {
        if (topThreeTraits.length >= 3 && topThreeTraits[1]?.label && topThreeTraits[2]?.label) {
          synthesis = `People describe working with this person as ${topThreeTraits[0].label.toLowerCase()} and ${topThreeTraits[1].label.toLowerCase()}, with a strong emphasis on ${topThreeTraits[2].label.toLowerCase()}.`
        } else if (topThreeTraits.length >= 2 && topThreeTraits[1]?.label) {
          synthesis = `People describe working with this person as ${topThreeTraits[0].label.toLowerCase()} and ${topThreeTraits[1].label.toLowerCase()}.`
        } else {
          synthesis = `People describe working with this person as ${topThreeTraits[0].label.toLowerCase()}.`
        }
      } else if (totalDataCount >= 5) {
        if (topThreeTraits.length >= 3 && topThreeTraits[1]?.label && topThreeTraits[2]?.label) {
          synthesis = `People consistently describe working with this person as ${topThreeTraits[0].label.toLowerCase()} and ${topThreeTraits[1].label.toLowerCase()}, with a strong emphasis on ${topThreeTraits[2].label.toLowerCase()}.`
        } else if (topThreeTraits.length >= 2 && topThreeTraits[1]?.label) {
          synthesis = `People consistently describe working with this person as ${topThreeTraits[0].label.toLowerCase()} and ${topThreeTraits[1].label.toLowerCase()}.`
        } else {
          synthesis = `People consistently describe working with this person as ${topThreeTraits[0].label.toLowerCase()}.`
        }
      }
    } else if (hasVibes && topTwoVibes.length > 0 && topTwoVibes[0]?.label) {
      if (topTwoVibes.length >= 2 && topTwoVibes[1]?.label) {
        synthesis = `Working with this person feels ${topTwoVibes[0].label.toLowerCase()} and ${topTwoVibes[1].label.toLowerCase()}.`
      } else {
        synthesis = `Working with this person feels ${topTwoVibes[0].label.toLowerCase()}.`
      }
    } else if (hasText && totalDataCount > 0) {
      const impactWords = [
        "helped",
        "delivered",
        "created",
        "improved",
        "drove",
        "led",
        "built",
        "transformed",
        "exceeded",
        "achieved",
      ]
      let impactStatement = ""

      for (const word of impactWords) {
        const regex = new RegExp(`[^.]*\\b${word}\\b[^.]*\\.`, "i")
        const match = effectiveAnalysisText.match(regex)
        if (match && match[0].length <= 120) {
          impactStatement = match[0].trim()
          break
        }
      }

      if (impactStatement) {
        synthesis = `Feedback highlights that this person ${impactStatement.charAt(0).toLowerCase()}${impactStatement.slice(1)}`
      } else {
        synthesis = `This person is building a professional reputation through ${effectiveContributionsCount > 0 ? `${effectiveContributionsCount} direct contribution${effectiveContributionsCount > 1 ? "s" : ""}` : ""}${effectiveContributionsCount > 0 && uploadsCount > 0 ? " and " : ""}${uploadsCount > 0 ? `${uploadsCount} imported testimonial${uploadsCount > 1 ? "s" : ""}` : ""}.`
      }
    } else if (totalDataCount > 0) {
      synthesis = `This person has ${effectiveContributionsCount > 0 ? `${effectiveContributionsCount} contribution${effectiveContributionsCount > 1 ? "s" : ""}` : ""}${effectiveContributionsCount > 0 && uploadsCount > 0 ? " and " : ""}${uploadsCount > 0 ? `${uploadsCount} saved testimonial${uploadsCount > 1 ? "s" : ""}` : ""} building their professional story.`
    }

    if (totalDataCount === 0 && !hasTraits && !hasVibes && !hasText) {
      return null
    }

    return {
      synthesis: synthesis || `This person is gathering feedback to build their professional reputation.`,
      patterns,
    }
  }, [traitSignals, vibeSignals, effectiveAnalysisText, totalDataCount, effectiveContributionsCount, uploadsCount])

  if (!summary && totalDataCount === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <p className="text-base leading-relaxed">Summary will appear once feedback or highlights are added.</p>
      </div>
    )
  }

  if (!summary && totalDataCount > 0) {
    return (
      <div className="space-y-4">
        <p className="text-neutral-700 leading-relaxed text-base sm:text-lg" style={{ lineHeight: "1.7" }}>
          {firstName} has received feedback from {effectiveContributionsCount}{" "}
          {effectiveContributionsCount === 1 ? "person" : "people"}
          {uploadsCount > 0 && ` and saved ${uploadsCount} testimonial${uploadsCount === 1 ? "" : "s"}`}.
        </p>
      </div>
    )
  }

  const needsExpand = summary!.synthesis.length > 240

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Teal/cyan left border accent */}
      <div className="flex">
        <div className="w-1.5 bg-cyan-400 flex-shrink-0" />
        <div className="flex-1 p-6 md:p-8">
          {/* Header row with title and stats */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">Summary of working with {firstName}</h2>
            <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-neutral-400">
              <span className="uppercase tracking-wider font-medium">Updated automatically</span>
              <span>
                {effectiveContributionsCount} contributions
                {voiceNotesCount > 0 && ` + ${voiceNotesCount} voice notes`}
                {uploadsCount > 0 && ` + ${uploadsCount} uploads`}
              </span>
            </div>
          </div>

          {/* Summary text */}
          <div className="relative mb-6">
            <p
              className={`text-neutral-700 leading-relaxed text-base md:text-lg transition-all duration-300 ${
                !isExpanded && needsExpand ? "line-clamp-3" : ""
              }`}
              style={{ lineHeight: "1.75" }}
            >
              {summary!.synthesis}
            </p>

            {needsExpand && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors font-medium"
              >
                {isExpanded ? "Read less" : "Read more"}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>

          {/* Most mentioned signals */}
          {summary!.patterns.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Most mentioned signals</p>
              <div className="flex flex-wrap gap-2">
                {summary!.patterns.map((pattern, index) => {
                  let displayText = ""

                  if (pattern.type === "trait") {
                    const prefixes = ["Known for being", "Reputation for", "Recognized for"]
                    const prefix = prefixes[index % prefixes.length]
                    displayText =
                      index === 1
                        ? `${prefix} ${pattern.label.toLowerCase()} work`
                        : index === 2
                          ? `${prefix} ${pattern.label.toLowerCase()} approach`
                          : `${prefix} ${pattern.label.toLowerCase()}`
                  } else {
                    displayText = `Brings a ${pattern.label.toLowerCase()} energy`
                  }

                  return (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 transition-all duration-200 ease-out cursor-default hover:bg-blue-100 hover:border-blue-200"
                    >
                      {displayText}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Footer note */}
          <p className="text-xs text-neutral-400 mt-6 pt-4 border-t border-neutral-100">
            Generated from {effectiveContributionsCount} contributions
            {uploadsCount > 0 && ` and ${uploadsCount} uploads`} • Updates as more people contribute
          </p>
        </div>
      </div>
    </div>
  )
}
