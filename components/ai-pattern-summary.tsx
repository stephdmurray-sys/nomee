"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

interface Contribution {
  id: string
  written_note: string
  relationship: string
}

interface ImportedFeedback {
  id: string
  ocr_text: string | null
  ai_extracted_excerpt: string | null
  traits: string[] | null
  included_in_analysis: boolean
}

interface AiPatternSummaryProps {
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  topTraits: { label: string; count: number }[]
  firstName?: string
}

export function AiPatternSummary({
  contributions,
  importedFeedback,
  topTraits,
  firstName = "this person",
}: AiPatternSummaryProps) {
  const [summary, setSummary] = useState<{
    synthesis: string
    patterns: string[]
    relationshipInsights?: { role: string; qualities: string[] }[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    generateSummary()
  }, [contributions, importedFeedback, topTraits, firstName])

  const generateSummary = () => {
    if (contributions.length === 0 || topTraits.length === 0) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const analyzableUploads = (importedFeedback || []).filter((u) => u.included_in_analysis && u.ocr_text)

    const traits = topTraits.slice(0, 3)
    let synthesis = ""

    if (traits.length >= 3) {
      synthesis = `People consistently describe working with ${firstName} as ${traits[0].label.toLowerCase()} and ${traits[1].label.toLowerCase()}, with a strong emphasis on ${traits[2].label.toLowerCase()}.`
    } else if (traits.length === 2) {
      synthesis = `People describe working with ${firstName} as ${traits[0].label.toLowerCase()} and ${traits[1].label.toLowerCase()}.`
    } else if (traits.length === 1) {
      synthesis = `People describe working with ${firstName} as ${traits[0].label.toLowerCase()}.`
    }

    const patterns = traits.map((t) => `Known for being ${t.label.toLowerCase()}`)

    setSummary({
      synthesis,
      patterns: patterns.slice(0, 3),
    })

    setIsLoading(false)
  }

  if (isLoading && contributions.length > 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-neutral-100 rounded-lg"></div>
        <div className="h-8 bg-neutral-100 rounded-lg w-1/2"></div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p className="text-lg">Summary will appear once contributions are received.</p>
      </div>
    )
  }

  const needsExpand = summary.synthesis.length > 240

  return (
    <div className="space-y-5">
      <div className="relative">
        <p
          className={`text-neutral-700 leading-relaxed text-lg md:text-xl transition-all duration-300 ${
            !isExpanded && needsExpand ? "line-clamp-2" : ""
          }`}
          style={{ lineHeight: "1.7" }}
        >
          {summary.synthesis}
        </p>

        {needsExpand && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors font-medium"
          >
            {isExpanded ? "Read less" : "Read more"}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {summary.patterns.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Most mentioned signals</p>
          <div className="flex flex-wrap gap-3">
            {summary.patterns.slice(0, 4).map((pattern, index) => (
              <span
                key={index}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 transition-all duration-300 ease-out cursor-default hover:scale-105 hover:shadow-lg hover:shadow-blue-100/50 hover:bg-blue-100 hover:border-blue-200 hover:-translate-y-0.5"
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
