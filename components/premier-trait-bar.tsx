"use client"

import { useState, useMemo } from "react"
import { ChevronDown, X, Sparkles } from "lucide-react"

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

interface PremierTraitBarProps {
  traits: TraitWithCount[]
  selectedTraits: string[]
  onTraitSelect: (trait: string) => void
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
}

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

function safeString(str: string | null | undefined): string {
  return typeof str === "string" ? str : ""
}

function safeNumber(num: number | null | undefined, fallback = 0): number {
  return typeof num === "number" && !isNaN(num) ? num : fallback
}

export function PremierTraitBar({
  traits,
  selectedTraits,
  onTraitSelect,
  contributions,
  importedFeedback,
}: PremierTraitBarProps) {
  const [showAllTraits, setShowAllTraits] = useState(false)

  const safeTraits = safeArray(traits)
  const safeSelectedTraits = safeArray(selectedTraits)
  const safeContributions = safeArray(contributions)
  const safeImportedFeedback = safeArray(importedFeedback)

  const totalPeople = safeContributions.length
  const totalUploads = safeImportedFeedback.length

  // Use traits directly - they come pre-computed from page.tsx
  const traitCounts = useMemo(() => {
    return safeTraits.map((trait, idx) => ({
      trait: trait?.label || "",
      count: trait?.count || 0,
      confidence:
        (trait?.count || 0) >= 3 ? "High" : (trait?.count || 0) >= 2 ? "Med" : ("Low" as "High" | "Med" | "Low"),
      type: (idx < 6 ? "Top signal" : "Emerging") as "Top signal" | "Emerging",
    }))
  }, [safeTraits])

  const maxTraits = 6
  const visibleTraits = showAllTraits ? traitCounts : traitCounts.slice(0, maxTraits)
  const hiddenCount = Math.max(0, traitCounts.length - maxTraits)

  // Count how many cards match the selected trait filters
  const matchCount = useMemo(() => {
    if (safeSelectedTraits.length === 0) return 0

    let count = 0

    // Count contributions
    safeContributions.forEach((c) => {
      if (!c) return
      const allTraits = [
        ...safeArray(c.traits_category1),
        ...safeArray(c.traits_category2),
        ...safeArray(c.traits_category3),
        ...safeArray(c.traits_category4),
      ]
      if (
        safeSelectedTraits.some((selected) =>
          allTraits.some((t) => safeString(t).toLowerCase() === selected.toLowerCase()),
        )
      ) {
        count++
      }
    })

    // Count imported feedback
    safeImportedFeedback.forEach((f) => {
      if (!f) return
      const feedbackTraits = safeArray(f.traits)
      if (
        safeSelectedTraits.some((selected) =>
          feedbackTraits.some((t) => safeString(t).toLowerCase() === selected.toLowerCase()),
        )
      ) {
        count++
      }
    })

    return count
  }, [safeContributions, safeImportedFeedback, safeSelectedTraits])

  if (traitCounts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Common themes people repeat</h3>
        </div>
        <p className="text-xs text-neutral-500">Ranked by how consistently they appear across perspectives</p>
        <p className="text-xs text-neutral-400">
          Based on feedback from {safeNumber(totalPeople)} {totalPeople === 1 ? "person" : "people"}
          {totalUploads > 0 && ` + ${safeNumber(totalUploads)} ${totalUploads === 1 ? "upload" : "uploads"}`}
        </p>
      </div>

      {/* Trait pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {visibleTraits.map((item) => {
          if (!item || !item.trait) return null
          const isSelected = safeSelectedTraits.includes(item.trait)
          return (
            <button
              key={item.trait}
              onClick={() => onTraitSelect(item.trait)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                border transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-100 border-blue-300 text-blue-800 shadow-sm"
                    : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:shadow-sm"
                }
              `}
            >
              <span>{item.trait}</span>
              <span className={`text-xs ${isSelected ? "text-blue-600" : "text-neutral-400"}`}>{item.count}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  item.type === "Top signal" ? "bg-blue-600 text-white" : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {item.type}
              </span>
              {isSelected && <X className="w-3 h-3 ml-0.5" />}
            </button>
          )
        })}
      </div>

      {/* View all toggle */}
      {hiddenCount > 0 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllTraits(!showAllTraits)}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAllTraits ? "Show less" : `View all ${traitCounts.length} traits`}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAllTraits ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}

      {/* Match count & clear */}
      {safeSelectedTraits.length > 0 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="text-neutral-600">
            {matchCount} {matchCount === 1 ? "match" : "matches"}
          </span>
          <button
            onClick={() => safeSelectedTraits.forEach((t) => onTraitSelect(t))}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
