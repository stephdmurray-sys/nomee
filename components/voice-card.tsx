"use client"

import { useState } from "react"
import { IntimateAudioPlayer } from "./intimate-audio-player"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"
import type { HighlightPattern } from "@/lib/extract-highlight-patterns"

interface VoiceCardProps {
  contribution: {
    id: string
    contributor_name: string
    contributor_company?: string | null
    relationship?: string | null
    voice_url?: string | null
    audio_duration_ms?: number | null
    written_note?: string | null
    traits_category1?: string[] | null
    traits_category2?: string[] | null
    traits_category3?: string[] | null
    traits_category4?: string[] | null
  }
  isMobile?: boolean
  highlightPatterns?: HighlightPattern[]
  profileName?: string
}

export function VoiceCard({ contribution, isMobile = false, highlightPatterns = [], profileName }: VoiceCardProps) {
  const [showFullTranscript, setShowFullTranscript] = useState(false)

  const allTraits = [
    ...(contribution.traits_category1 || []),
    ...(contribution.traits_category2 || []),
    ...(contribution.traits_category3 || []),
    ...(contribution.traits_category4 || []),
  ]

  const effectivePatterns = extractKeywordsFromText(contribution.written_note || "", allTraits)

  const previewText = contribution.written_note?.slice(0, 200) || ""
  const fullText = contribution.written_note || ""
  const hasMoreText = fullText.length > previewText.length

  const highlightedPreview = previewText ? highlightQuote(previewText, effectivePatterns, 5) : null
  const highlightedFull = fullText ? highlightQuote(fullText, effectivePatterns, 5) : null

  return (
    <div className={`rounded-xl p-6 bg-white border border-gray-200 ${isMobile ? "min-w-[85vw] snap-center" : ""}`}>
      <div className="space-y-3">
        <IntimateAudioPlayer audioUrl={contribution.voice_url!} />

        {highlightedPreview && (
          <div className="space-y-2">
            <div className="text-sm leading-relaxed text-gray-700">
              {showFullTranscript ? highlightedFull : highlightedPreview}
            </div>

            {hasMoreText && (
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="text-sm text-blue-600 hover:text-blue-700 min-h-[44px]"
              >
                {showFullTranscript ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {allTraits.slice(0, 5).map((trait, idx) => (
            <span key={idx} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
              {trait}
            </span>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 mt-4">
          <div className="text-sm font-medium text-gray-900">{contribution.contributor_name}</div>
          {contribution.relationship && (
            <div className="text-xs text-gray-500 capitalize">{contribution.relationship.replace(/_/g, " ")}</div>
          )}
        </div>
      </div>
    </div>
  )
}
