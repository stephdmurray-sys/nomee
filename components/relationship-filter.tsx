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

  // Only show pills with at least 1 contribution (except "All")
  const visibleCategories = FILTER_CATEGORIES.filter((cat) => {
    return cat === "All" || counts[cat] > 0
  })

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {visibleCategories.map((category) => {
        const isSelected = selectedCategory === category
        const count = counts[category]

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 ease-out
              ${
                isSelected
                  ? "bg-blue-50 text-blue-700 border-2 border-blue-200"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
              }
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{category}</span>
            {count > 0 && (
              <span className={`ml-1.5 ${isSelected ? "text-blue-600" : "text-neutral-400"}`}>({count})</span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
