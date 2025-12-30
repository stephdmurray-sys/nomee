"use client"

import { useState, useMemo } from "react"
import { X } from "lucide-react"

interface Contribution {
  id: string
  written_note?: string | null
  traits_category1?: string[] | null
  traits_category2?: string[] | null
  traits_category3?: string[] | null
  traits_category4?: string[] | null
}

interface ImportedFeedback {
  id: string
  ai_extracted_excerpt?: string | null
  traits?: string[] | null
}

interface TraitWithCount {
  label: string
  count: number
  weightedCount: number
  category: string
  examples: string[]
}

interface SmartVibePillsProps {
  vibes: string[]
  traits: TraitWithCount[]
  selectedVibes: string[]
  onVibeSelect: (vibe: string) => void
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
}

// Curated impact phrases
const IMPACT_PHRASES = [
  "increased",
  "grew",
  "drove",
  "improved",
  "exceeded",
  "delivered",
  "launched",
  "saved",
  "reduced",
  "scaled",
  "led",
  "built",
  "created",
  "transformed",
  "streamlined",
  "optimized",
  "achieved",
  "generated",
  "boosted",
  "accelerated",
]

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

function safeString(str: string | null | undefined): string {
  return typeof str === "string" ? str : ""
}

export function SmartVibePills({
  vibes,
  traits,
  selectedVibes,
  onVibeSelect,
  contributions,
  importedFeedback,
}: SmartVibePillsProps) {
  const [activeTab, setActiveTab] = useState<"work-style" | "impact">("work-style")

  const safeVibes = safeArray(vibes)
  const safeTraits = safeArray(traits)
  const safeSelectedVibes = safeArray(selectedVibes)
  const safeContributions = safeArray(contributions)
  const safeImportedFeedback = safeArray(importedFeedback)

  // Build allCards from contributions + importedFeedback
  const allCards = useMemo(() => {
    const nomeeCards = safeContributions.map((c) => ({
      id: safeString(c?.id),
      excerpt: safeString(c?.written_note),
      traits: [
        ...safeArray(c?.traits_category1),
        ...safeArray(c?.traits_category2),
        ...safeArray(c?.traits_category3),
        ...safeArray(c?.traits_category4),
      ],
      type: "nomee" as const,
    }))

    const importedCards = safeImportedFeedback.map((f) => ({
      id: safeString(f?.id),
      excerpt: safeString(f?.ai_extracted_excerpt),
      traits: safeArray(f?.traits),
      type: "imported" as const,
    }))

    return [...nomeeCards, ...importedCards]
  }, [safeContributions, safeImportedFeedback])

  // Compute vibe signals from traits (category4 typically)
  const vibeSignals = useMemo(() => {
    // Use vibes directly if available
    if (safeVibes.length > 0) {
      const counts: Record<string, number> = {}
      safeVibes.forEach((vibe) => {
        counts[vibe] = (counts[vibe] || 0) + 1
      })
      return Object.entries(counts)
        .map(([label, count]) => ({ label, count }))
        .slice(0, 8)
    }

    // Fallback: extract from traits
    return safeTraits.slice(0, 8).map((t) => ({ label: t?.label || "", count: t?.count || 0 }))
  }, [safeVibes, safeTraits])

  // Compute impact signals from excerpts
  const impactSignals = useMemo(() => {
    const counts: Record<string, number> = {}

    allCards.forEach((card) => {
      if (!card) return
      const textLower = safeString(card.excerpt).toLowerCase()
      IMPACT_PHRASES.forEach((phrase) => {
        const regex = new RegExp(`\\b${phrase}\\b`, "gi")
        const matches = textLower.match(regex)
        if (matches) {
          counts[phrase] = (counts[phrase] || 0) + matches.length
        }
      })
    })

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([label, count]) => ({ label, count }))
  }, [allCards])

  // Work style = vibes
  const workStylePills = vibeSignals

  // Count matches for selected vibes/impacts
  const matchCount = useMemo(() => {
    if (safeSelectedVibes.length === 0) return 0

    return allCards.filter((card) => {
      if (!card) return false
      const cardText = safeString(card.excerpt).toLowerCase()
      const cardTraits = safeArray(card.traits)
      return safeSelectedVibes.some((vibe) => {
        // Check if vibe is in traits or in text
        if (cardTraits.some((t) => safeString(t).toLowerCase() === safeString(vibe).toLowerCase())) return true
        return cardText.includes(safeString(vibe).toLowerCase())
      })
    }).length
  }, [allCards, safeSelectedVibes])

  const currentPills = activeTab === "work-style" ? workStylePills : impactSignals

  if (workStylePills.length === 0 && impactSignals.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex justify-center gap-1 p-1 bg-neutral-100 rounded-lg w-fit mx-auto">
        <button
          onClick={() => setActiveTab("work-style")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            activeTab === "work-style"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Work Style
        </button>
        <button
          onClick={() => setActiveTab("impact")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            activeTab === "impact" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Impact
        </button>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {currentPills.map((pill) => {
          if (!pill || !pill.label) return null
          const isSelected = safeSelectedVibes.includes(pill.label)
          return (
            <button
              key={pill.label}
              onClick={() => onVibeSelect(pill.label)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                border transition-all duration-200
                ${
                  isSelected
                    ? activeTab === "work-style"
                      ? "bg-purple-100 border-purple-300 text-purple-800"
                      : "bg-amber-100 border-amber-300 text-amber-800"
                    : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300"
                }
              `}
            >
              <span className="capitalize">{safeString(pill.label)}</span>
              <span className={`text-xs ${isSelected ? "opacity-80" : "text-neutral-400"}`}>{pill.count ?? 0}</span>
              {isSelected && <X className="w-3 h-3 ml-0.5" />}
            </button>
          )
        })}
      </div>

      {/* Match count & clear */}
      {safeSelectedVibes.length > 0 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="text-neutral-600">
            {matchCount} {matchCount === 1 ? "match" : "matches"}
          </span>
          <button
            onClick={() => safeSelectedVibes.forEach((v) => onVibeSelect(v))}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  )
}
