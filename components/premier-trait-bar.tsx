"use client"

import { useState, useMemo } from "react"
import { ChevronDown, X, Sparkles } from "lucide-react"

interface TraitCount {
  trait: string
  count: number
  confidence: "High" | "Med" | "Low"
  type: "Top signal" | "Emerging"
  cards: Array<{ id: string; excerpt: string }>
}

interface PremierTraitBarProps {
  allCards: Array<{
    id: string
    excerpt: string
    traits: string[]
    type: "nomee" | "imported"
  }>
  selectedTraits: string[]
  onTraitSelect: (trait: string) => void
  onClearFilters: () => void
  maxTraits?: number
  sourceFilter: "all" | "nomee" | "imported"
  totalPeople?: number
  totalUploads?: number
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
  allCards,
  selectedTraits,
  onTraitSelect,
  onClearFilters,
  maxTraits = 6,
  sourceFilter,
  totalPeople = 0,
  totalUploads = 0,
}: PremierTraitBarProps) {
  const [showAllTraits, setShowAllTraits] = useState(false)

  const safeAllCards = safeArray(allCards)
  const safeSelectedTraits = safeArray(selectedTraits)

  // Compute trait counts from visible cards based on sourceFilter
  const traitCounts = useMemo(() => {
    const filteredCards =
      sourceFilter === "all" ? safeAllCards : safeAllCards.filter((card) => card?.type === sourceFilter)

    const counts: Record<string, { count: number; cards: Array<{ id: string; excerpt: string }> }> = {}

    filteredCards.forEach((card) => {
      if (!card) return
      const cardTraits = safeArray(card.traits)
      cardTraits.forEach((trait) => {
        const safeTrait = safeString(trait)
        if (!safeTrait) return
        if (!counts[safeTrait]) {
          counts[safeTrait] = { count: 0, cards: [] }
        }
        counts[safeTrait].count++
        counts[safeTrait].cards.push({ id: safeString(card.id), excerpt: safeString(card.excerpt) })
      })
    })

    const totalCards = filteredCards.length

    // Compute confidence based on heuristic
    const getConfidence = (count: number): "High" | "Med" | "Low" => {
      if (totalCards < 6) {
        const percentage = (count / Math.max(totalCards, 1)) * 100
        if (percentage >= 40) return "High"
        if (percentage >= 20) return "Med"
        return "Low"
      }
      if (count >= 6) return "High"
      if (count >= 3) return "Med"
      return "Low"
    }

    const sorted = Object.entries(counts)
      .map(([trait, data], idx) => ({
        trait,
        count: data.count,
        confidence: getConfidence(data.count),
        type: (idx < 6 ? "Top signal" : "Emerging") as "Top signal" | "Emerging",
        cards: data.cards,
      }))
      .sort((a, b) => b.count - a.count)

    return sorted
  }, [safeAllCards, sourceFilter])

  const visibleTraits = showAllTraits ? traitCounts : traitCounts.slice(0, maxTraits)
  const hiddenCount = Math.max(0, traitCounts.length - maxTraits)

  // Count how many cards match the selected trait filters
  const matchCount = useMemo(() => {
    if (safeSelectedTraits.length === 0) return 0

    const filteredCards =
      sourceFilter === "all" ? safeAllCards : safeAllCards.filter((card) => card?.type === sourceFilter)

    return filteredCards.filter((card) => {
      if (!card) return false
      const cardTraits = safeArray(card.traits)
      return safeSelectedTraits.some((selected) =>
        cardTraits.some((t) => safeString(t).toLowerCase() === safeString(selected).toLowerCase()),
      )
    }).length
  }, [safeAllCards, safeSelectedTraits, sourceFilter])

  if (traitCounts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Top signals people repeat</h3>
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
          if (!item) return null
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
          <button onClick={onClearFilters} className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
