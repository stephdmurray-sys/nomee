"use client"
import { FloatingQuoteCards } from "@/components/floating-quote-cards"
import type { Contribution } from "@/types"
import type { HighlightPattern } from "@/lib/extract-highlight-patterns"

interface TestimonialGroupProps {
  title: string
  contributions: Contribution[]
  isFirstGroup?: boolean
  selectedTraits?: string[]
  hoveredTrait?: string | null
  profileName?: string
  highlightPatterns?: HighlightPattern[] // Replace boldingType with highlightPatterns
}

export function TestimonialGroup({
  title,
  contributions,
  isFirstGroup = false,
  selectedTraits = [],
  hoveredTrait = null,
  profileName = "this professional",
  highlightPatterns = [], // Use highlightPatterns instead of boldingType
}: TestimonialGroupProps) {
  const visibleCount = 3 // Changed to 3 visible quotes for all groups
  const hasMore = contributions.length > visibleCount

  return (
    <section className="space-y-6">
      {title && (
        <div className="text-left space-y-1">
          <h3 className="text-lg md:text-xl font-medium text-neutral-900">{title}</h3>
        </div>
      )}

      <FloatingQuoteCards
        contributions={contributions}
        selectedTraits={selectedTraits}
        hoveredTrait={hoveredTrait}
        profileName={profileName}
        isFeatured={isFirstGroup}
        isFirstInGroup={isFirstGroup}
        groupIndex={isFirstGroup ? 0 : 1}
        highlightPatterns={highlightPatterns}
      />
    </section>
  )
}
