"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TraitWithCount {
  label: string
  count: number
  category: "leadership" | "execution" | "collaboration" | "eq"
  examples: string[]
}

export function TraitHeatmap({
  traits,
  totalCount,
  selectedTrait,
  onTraitSelect,
  onTraitHover, // Add hover callback
  emphasizedTrait,
  hasSeenReveal = true,
}: {
  traits: TraitWithCount[]
  totalCount: number
  selectedTrait: string | null
  onTraitSelect: (trait: string | null) => void
  onTraitHover?: (trait: string | null) => void // New prop
  emphasizedTrait?: string | null
  hasSeenReveal?: boolean
}) {
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)
  const [showCaption, setShowCaption] = useState(false)

  useEffect(() => {
    if (!hasSeenReveal) {
      const timer = setTimeout(() => {
        setShowCaption(true)
      }, 4500)
      return () => clearTimeout(timer)
    }
  }, [hasSeenReveal])

  const sortedTraits = [...traits].sort((a, b) => b.count - a.count)
  const topTraits = sortedTraits.slice(0, 6)

  const getTraitSize = (count: number, maxCount: number, index: number) => {
    if (index === 0)
      return {
        fontSize: "text-2xl md:text-3xl",
        weight: "font-bold",
        padding: "px-6 py-3",
      }
    if (index <= 2)
      return {
        fontSize: "text-xl md:text-2xl",
        weight: "font-semibold",
        padding: "px-5 py-2.5",
      }
    return {
      fontSize: "text-lg md:text-xl",
      weight: "font-medium",
      padding: "px-4 py-2",
    }
  }

  const maxCount = topTraits[0]?.count || 1

  const handleTraitHover = (trait: string | null) => {
    setHoveredTrait(trait)
    onTraitHover?.(trait)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {topTraits.map((trait, index) => {
          const percentage = (trait.count / totalCount) * 100
          const isSelected = selectedTrait === trait.label
          const isOtherSelected = selectedTrait && selectedTrait !== trait.label
          const isEmphasized = emphasizedTrait === trait.label

          const { fontSize, weight, padding } = getTraitSize(trait.count, maxCount, index)

          return (
            <motion.div
              key={trait.label}
              className="relative group"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{
                opacity: isOtherSelected ? 0.3 : 1,
                scale: isEmphasized ? 1.08 : 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              whileHover={{
                scale: 1.12,
                transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                onClick={() => onTraitSelect(isSelected ? null : trait.label)}
                onMouseEnter={() => handleTraitHover(trait.label)}
                onMouseLeave={() => handleTraitHover(null)}
                className={`
                  ${isSelected ? "bg-neutral-900 text-white ring-2 ring-neutral-900 shadow-lg" : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 shadow-sm hover:shadow-md"}
                  ${fontSize} ${weight} ${padding}
                  cursor-pointer transition-all duration-300
                  rounded-full
                `}
              >
                {trait.label}
                <span className="ml-2 text-xs opacity-60">{trait.count}</span>
              </Badge>

              {hoveredTrait === trait.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 bg-neutral-900 text-white rounded-xl shadow-2xl pointer-events-none"
                >
                  <div className="text-xs font-semibold mb-2">
                    {trait.count} {trait.count === 1 ? "person" : "people"} mentioned this ({percentage.toFixed(0)}%)
                  </div>
                  {trait.examples.length > 0 && (
                    <div className="text-xs text-neutral-300 italic line-clamp-2 leading-relaxed">
                      "{trait.examples[0]}"
                    </div>
                  )}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-neutral-900 rotate-45 shadow-lg" />
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {selectedTrait && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-neutral-600 pt-3 text-center"
        >
          Showing perspectives mentioning "{selectedTrait}" •{" "}
          <button
            onClick={() => onTraitSelect(null)}
            className="text-neutral-900 hover:underline font-medium transition-colors"
          >
            Clear filter
          </button>
        </motion.div>
      )}
    </div>
  )
}
