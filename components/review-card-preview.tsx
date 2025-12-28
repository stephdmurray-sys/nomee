import type { HighlightPattern } from "@/lib/extract-highlight-patterns"
import { highlightQuote } from "@/lib/highlight-quote"
import { getRelationshipLabel } from "@/lib/nomee-enums"

interface ReviewCardPreviewProps {
  name: string
  relationship: string
  text: string
  highlightedTerms?: string[]
}

export function ReviewCardPreview({ name, relationship, text, highlightedTerms = [] }: ReviewCardPreviewProps) {
  // Convert highlighted terms to pattern format for highlightQuote
  const patterns: HighlightPattern[] = highlightedTerms.map((term) => ({
    phrase: term,
    frequency: 1,
    tier: "theme",
  }))

  const relationshipLabel = getRelationshipLabel(relationship) || "Contributor"
  const highlightedText = patterns.length > 0 ? highlightQuote(text, patterns, 3) : text

  return (
    <div className="w-full border border-neutral-200 bg-white rounded-lg p-4 hover:border-neutral-300 transition-all">
      {/* Top: Contributor name + relationship */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-neutral-900">{name}</span>
        <span className="text-xs text-neutral-500">·</span>
        <span className="inline-block text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
          {relationshipLabel}
        </span>
      </div>

      {/* Body: Review excerpt with keyword highlights */}
      <div className="text-sm leading-relaxed text-neutral-700">{highlightedText}</div>
    </div>
  )
}
