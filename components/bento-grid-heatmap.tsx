"use client"

import { useState } from "react"

interface Trait {
  label: string
  count: number
}

interface BentoGridHeatmapProps {
  traits: Trait[]
  onTraitClick: (trait: string | null) => void
}

export function BentoGridHeatmap({ traits, onTraitClick }: BentoGridHeatmapProps) {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null)

  const handleClick = (label: string) => {
    const newSelection = selectedTrait === label ? null : label
    setSelectedTrait(newSelection)
    onTraitClick(newSelection)
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {traits.map((trait) => {
        const isSelected = selectedTrait === trait.label
        const opacity = !selectedTrait || isSelected ? 1 : 0.4

        return (
          <button
            key={trait.label}
            onClick={() => handleClick(trait.label)}
            className="group relative aspect-square p-4 rounded-xl border transition-all duration-300"
            style={{
              opacity,
              backgroundColor: isSelected ? "rgba(79, 70, 229, 0.05)" : "white",
              borderColor: isSelected ? "rgba(79, 70, 229, 0.3)" : "rgba(0, 0, 0, 0.1)",
              boxShadow: isSelected ? "0 4px 20px rgba(79, 70, 229, 0.15)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="flex flex-col items-start justify-between h-full">
              <div className="text-left">
                <div className="text-sm font-medium text-[var(--near-black)] mb-1 leading-tight">{trait.label}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-light text-[var(--quiet-indigo)]">{trait.count}</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.min(trait.count, 5) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-[var(--quiet-indigo)]"
                      style={{ height: `${8 + i * 2}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
