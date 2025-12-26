"use client"

import { useState } from "react"

interface Trait {
  label: string
  count: number
}

interface TraitFilterHeatmapProps {
  traits: Trait[]
  onFilterChange: (selectedTrait: string | null) => void
  ownerFirstName: string
}

export function TraitFilterHeatmap({ traits, onFilterChange, ownerFirstName }: TraitFilterHeatmapProps) {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null)

  const displayTraits = [...traits].sort((a, b) => b.count - a.count).slice(0, 9)

  // Identify top 2 traits by frequency
  const topTwoLabels = displayTraits.slice(0, 2).map((t) => t.label)

  const handleTraitClick = (label: string) => {
    const newSelection = selectedTrait === label ? null : label
    setSelectedTrait(newSelection)
    onFilterChange(newSelection)
  }

  const handleClear = () => {
    setSelectedTrait(null)
    onFilterChange(null)
  }

  if (displayTraits.length === 0) return null

  const renderTrait = (label: string, count: number) => {
    const isTopTwo = topTwoLabels.includes(label)
    const isSelected = selectedTrait === label
    const isUnselected = selectedTrait && !isSelected

    return (
      <button
        key={label}
        onClick={() => handleTraitClick(label)}
        className={`
          ${isTopTwo ? "px-5 py-3 text-lg" : "px-4 py-2.5 text-base"}
          rounded-full
          transition-all duration-150
          ${
            isSelected
              ? // SELECTED STATE: High contrast, stronger emphasis
                "bg-slate-900 text-white font-semibold shadow-lg scale-[1.02] ring-2 ring-slate-900/30"
              : isUnselected
                ? // UNSELECTED STATE: Visually recedes
                  "bg-white/50 text-slate-900/40 font-normal border border-slate-200/50"
                : // DEFAULT STATE: Clear and readable
                  isTopTwo
                  ? "bg-white text-slate-900 font-semibold border-2 border-slate-900/20 shadow-sm"
                  : "bg-white text-slate-900 font-medium border border-slate-200 shadow-sm"
          }
          ${!isSelected ? "hover:bg-slate-50 hover:shadow-md hover:border-slate-300" : ""}
        `}
      >
        {label}
        <span
          className={`ml-2 text-sm ${isSelected ? "text-white/80" : isUnselected ? "text-slate-400/60" : "text-slate-500"}`}
        >
          {count}
        </span>
      </button>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm uppercase tracking-widest text-[var(--quiet-indigo)] font-medium">
          What collaborators consistently highlight
        </h2>
        {selectedTrait && (
          <button
            onClick={handleClear}
            className="text-xs text-slate-600 hover:text-slate-900 transition-colors duration-200 underline"
          >
            Clear
          </button>
        )}
      </div>

      {selectedTrait && (
        <p className="text-sm text-slate-600 mb-6 font-light italic">
          Showing how collaborators described {ownerFirstName} as {selectedTrait.toLowerCase()}.
        </p>
      )}

      <div className="flex flex-wrap gap-3">{displayTraits.map((t) => renderTrait(t.label, t.count))}</div>
    </div>
  )
}
