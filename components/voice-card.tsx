"use client"

import { useState } from "react"
import { IntimateAudioPlayer } from "./intimate-audio-player"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

function safeString(str: string | null | undefined): string {
  return typeof str === "string" ? str : ""
}

interface VoiceCardProps {
  // New interface (direct props)
  audioUrl?: string
  contributorName?: string
  relationship?: string
  traits?: string[]
  writtenNote?: string
  contributorCompany?: string
  // Old interface (contribution object)
  contribution?: {
    id?: string
    contributor_name?: string | null
    contributor_company?: string | null
    relationship?: string | null
    voice_url?: string | null
    audio_url?: string | null
    audio_duration_ms?: number | null
    written_note?: string | null
    traits_category1?: string[] | null
    traits_category2?: string[] | null
    traits_category3?: string[] | null
    traits_category4?: string[] | null
  } | null
  isMobile?: boolean
  profileName?: string
  compact?: boolean // Added compact prop to hide contributor info when shown elsewhere
}

export function VoiceCard({
  audioUrl: directAudioUrl,
  contributorName: directContributorName,
  relationship: directRelationship,
  traits: directTraits,
  writtenNote: directWrittenNote,
  contributorCompany: directContributorCompany,
  contribution,
  isMobile = false,
  profileName,
  compact = false, // Added compact prop to hide contributor info when shown elsewhere
}: VoiceCardProps) {
  const [showFullTranscript, setShowFullTranscript] = useState(false)

  const audioUrl = directAudioUrl || safeString(contribution?.voice_url) || safeString(contribution?.audio_url)
  const contributorName = directContributorName || safeString(contribution?.contributor_name)
  const relationship = directRelationship || safeString(contribution?.relationship)
  const contributorCompany = directContributorCompany || safeString(contribution?.contributor_company)
  const writtenNote = directWrittenNote || safeString(contribution?.written_note)

  // Get traits from either direct props or contribution object
  const allTraits = directTraits || [
    ...safeArray(contribution?.traits_category1),
    ...safeArray(contribution?.traits_category2),
    ...safeArray(contribution?.traits_category3),
    ...safeArray(contribution?.traits_category4),
  ]

  if (!audioUrl) {
    return null
  }

  const effectivePatterns = extractKeywordsFromText(writtenNote, allTraits)

  const previewText = writtenNote.slice(0, 200)
  const fullText = writtenNote
  const hasMoreText = fullText.length > previewText.length

  const highlightedPreview = previewText ? highlightQuote(previewText, effectivePatterns, 5) : null
  const highlightedFull = fullText ? highlightQuote(fullText, effectivePatterns, 5) : null

  return (
    <div className={`rounded-xl p-6 bg-white border border-gray-200 ${isMobile ? "min-w-[85vw] snap-center" : ""}`}>
      <div className="space-y-3">
        <IntimateAudioPlayer audioUrl={audioUrl} />

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

        {allTraits.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {allTraits.slice(0, 5).map((trait, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                {trait}
              </span>
            ))}
          </div>
        )}

        {!compact && (
          <div className="border-t border-gray-100 pt-3 mt-4">
            <div className="text-sm font-medium text-gray-900">{contributorName || "Anonymous"}</div>
            {relationship && <div className="text-xs text-gray-500 capitalize">{relationship.replace(/_/g, " ")}</div>}
            {contributorCompany && <div className="text-xs text-gray-500">{contributorCompany}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
