"use client"
import { motion } from "framer-motion"
import type { RelationshipFilterCategory } from "@/lib/relationship-filter"
import { getRelationshipCounts } from "@/lib/relationship-filter"

interface RelationshipFilterProps {
  contributions: any[]
  selectedCategory: RelationshipFilterCategory
  onCategoryChange: (category: RelationshipFilterCategory) => void
}

const FILTER_CATEGORIES: RelationshipFilterCategory[] = ["All", "Manager", "Direct report", "Peer", "Client", "Other"]

export function RelationshipFilter({ contributions, selectedCategory, onCategoryChange }: RelationshipFilterProps) {
  const counts = getRelationshipCounts(contributions)

  const visibleCategories = FILTER_CATEGORIES.filter((cat) => {
    return cat === "All" || counts[cat] > 0
  })

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-6">
      <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-6 px-6 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-min">
          {visibleCategories.map((category) => {
            const isSelected = selectedCategory === category
            const count = counts[category]

            return (
              <motion.button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  snap-start flex-shrink-0 px-4 py-3 min-h-[44px] rounded-full text-sm font-medium
                  transition-all duration-200 ease-out whitespace-nowrap
                  ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 border-2 border-blue-200"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100"
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                <span>{category}</span>
                {count > 0 && (
                  <span className={`ml-1.5 ${isSelected ? "text-blue-600" : "text-neutral-400"}`}>({count})</span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
      {/* Edge fade effect for visual scroll indicator */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent sm:hidden" />
    </div>
  )
}
