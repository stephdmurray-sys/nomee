"use client"

import { useState, useMemo } from "react"
import { ChevronDown, X, Sparkles } from "lucide-react"

interface TraitCount {
  trait: string
  count: number
  confidence: "High" | "Med" | "Low"
  cards: Array<{ id: string; excerpt: string }>
}

interface PremierTraitBarProps {
  // All cards (both Nomee submissions and imported)
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
}

export function PremierTraitBar({
  allCards,
  selectedTraits,
  onTraitSelect,
  onClearFilters,
  maxTraits = 6,
  sourceFilter,
}: PremierTraitBarProps) {
  const [showAllTraits, setShowAllTraits] = useState(false)

  // Compute trait counts from visible cards based on sourceFilter
  const traitCounts = useMemo(() => {
    const filteredCards = sourceFilter === "all" ? allCards : allCards.filter((card) => card.type === sourceFilter)

    const counts: Record<string, { count: number; cards: Array<{ id: string; excerpt: string }> }> = {}

    filteredCards.forEach((card) => {
      card.traits.forEach((trait) => {
        if (!counts[trait]) {
          counts[trait] = { count: 0, cards: [] }
        }
        counts[trait].count++
        counts[trait].cards.push({ id: card.id, excerpt: card.excerpt })
      })
    })

    const totalCards = filteredCards.length

    // Compute confidence based on heuristic
    // High = N >= 6 OR >= 40% of cards
    // Med = 3-5 OR 20-39% of cards
    // Low = 1-2 OR < 20% of cards
    const getConfidence = (count: number): "High" | "Med" | "Low" => {
      if (totalCards < 6) {
        // Scale proportionally for small datasets
        const percentage = (count / totalCards) * 100
        if (percentage >= 40) return "High"
        if (percentage >= 20) return "Med"
        return "Low"
      }
      // Standard heuristic for larger datasets
      if (count >= 6) return "High"
      if (count >= 3) return "Med"
      return "Low"
    }

    return Object.entries(counts)
      .map(([trait, data]) => ({
        trait,
        count: data.count,
        confidence: getConfidence(data.count),
        cards: data.cards,
      }))
      .sort((a, b) => b.count - a.count) as TraitCount[]
  }, [allCards, sourceFilter])

  const visibleTraits = showAllTraits ? traitCounts : traitCounts.slice(0, maxTraits)
  const hasMoreTraits = traitCounts.length > maxTraits

  // Extract micro-evidence snippets for selected traits
  const microEvidence = useMemo(() => {
    if (selectedTraits.length === 0) return []

    const snippets: string[] = []
    const selectedTrait = selectedTraits[0] // Primary trait for evidence

    const traitData = traitCounts.find((t) => t.trait === selectedTrait)
    if (!traitData) return []

    // Find sentences containing the trait word
    traitData.cards.slice(0, 3).forEach((card) => {
      const sentences = card.excerpt.split(/[.!?]+/).filter((s) => s.trim())
      for (const sentence of sentences) {
        if (
          sentence.toLowerCase().includes(selectedTrait.toLowerCase()) &&
          sentence.trim().length > 20 &&
          sentence.trim().length <= 120
        ) {
          snippets.push(sentence.trim())
          break
        }
      }
    })

    // Fallback: use first sentence from top cards if no trait match
    if (snippets.length === 0) {
      traitData.cards.slice(0, 2).forEach((card) => {
        const firstSentence = card.excerpt.split(/[.!?]+/)[0]?.trim()
        if (firstSentence && firstSentence.length <= 120) {
          snippets.push(firstSentence)
        }
      })
    }

    return snippets.slice(0, 2)
  }, [selectedTraits, traitCounts])

  const handleTraitClick = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      onTraitSelect(trait) // Deselect
    } else if (selectedTraits.length >= 2) {
      // Show inline message - handled by parent
      return
    } else {
      onTraitSelect(trait)
    }
  }

  const confidenceBadgeStyles = {
    High: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Med: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-neutral-50 text-neutral-500 border-neutral-200",
  }

  if (traitCounts.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h4 className="text-sm font-semibold text-neutral-900">Top signals people repeat</h4>
        </div>
        <p className="text-xs text-neutral-500">Ranked by how consistently they appear across perspectives</p>
      </div>

      {/* Trait Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {visibleTraits.map((traitData) => {
          const isSelected = selectedTraits.includes(traitData.trait)
          return (
            <button
              key={traitData.trait}
              onClick={() => handleTraitClick(traitData.trait)}
              className={`
                group inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
                border transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-50 border-blue-300 text-blue-800 shadow-sm"
                    : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                }
              `}
            >
              <span>{traitData.trait}</span>
              <span className="text-xs text-neutral-400">{traitData.count}x</span>
              <span
                className={`
                  text-[10px] px-1.5 py-0.5 rounded-full border font-medium
                  ${confidenceBadgeStyles[traitData.confidence]}
                `}
              >
                {traitData.confidence}
              </span>
              {isSelected && (
                <X className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          )
        })}
      </div>

      {/* View all traits toggle */}
      {hasMoreTraits && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAllTraits(!showAllTraits)}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAllTraits ? "Show less" : `View all ${traitCounts.length} traits`}
            <ChevronDown className={`w-3 h-3 transition-transform ${showAllTraits ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}

      {/* Filter limit message */}
      {selectedTraits.length >= 2 && (
        <p className="text-center text-xs text-neutral-500">
          Limit 2 filters for clarity.{" "}
          <button onClick={onClearFilters} className="text-blue-600 hover:underline">
            Reset filters
          </button>
        </p>
      )}

      {/* Clear filters button */}
      {selectedTraits.length > 0 && selectedTraits.length < 2 && (
        <div className="flex justify-center">
          <button onClick={onClearFilters} className="text-xs text-neutral-500 hover:text-neutral-700 underline">
            Reset filters
          </button>
        </div>
      )}

      {/* Micro-evidence snippets */}
      {selectedTraits.length > 0 && microEvidence.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-xs font-medium text-blue-800 mb-2">Why people say this:</p>
          <div className="space-y-2">
            {microEvidence.map((snippet, idx) => (
              <p key={idx} className="text-sm text-neutral-700 italic">
                "{snippet}..."
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
