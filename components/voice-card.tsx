"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { IntimateAudioPlayer } from "./intimate-audio-player"

interface VoiceCardProps {
  contribution: {
    id: string
    contributor_name: string
    contributor_company?: string | null
    relationship?: string | null
    voice_url?: string | null
    audio_duration_ms?: number | null
    written_note?: string | null
  }
  isMobile?: boolean
}

export function VoiceCard({ contribution, isMobile = false }: VoiceCardProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div
      className={`
        rounded-xl p-6 space-y-4 transition-all duration-300 cursor-pointer
        ${isMobile ? "min-w-[85vw] snap-center" : ""}
        ${
          isPlaying
            ? "border-blue-300 bg-blue-50/30 shadow-lg scale-[1.02]"
            : "bg-white border border-blue-200/60 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] hover:-translate-y-1"
        }
      `}
    >
      <IntimateAudioPlayer audioUrl={contribution.voice_url!} onPlayingChange={setIsPlaying} />

      {/* Contributor info - clean hierarchy */}
      <div className="space-y-1">
        <p className="text-base font-semibold text-neutral-900 transition-colors group-hover:text-blue-900">
          {contribution.contributor_name}
        </p>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          {contribution.contributor_company && <span>{contribution.contributor_company}</span>}
          {contribution.contributor_company && contribution.relationship && <span>•</span>}
          {contribution.relationship && (
            <span className="capitalize">{contribution.relationship.replace(/_/g, " ")}</span>
          )}
        </div>
        {contribution.audio_duration_ms && (
          <p className="text-xs text-neutral-500">{Math.round(contribution.audio_duration_ms / 1000)}s</p>
        )}
      </div>

      {contribution.written_note && (
        <div className="border-t border-neutral-200 pt-3 space-y-2">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-expanded={showTranscript}
          >
            <span>Read transcript</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${showTranscript ? "rotate-180" : ""}`}
            />
          </button>
          {showTranscript && (
            <div className="text-sm text-neutral-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
              {contribution.written_note}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
