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
}

export function VoiceCard({ contribution }: VoiceCardProps) {
  const [showTranscript, setShowTranscript] = useState(false)

  return (
    <div className="bg-neutral-50 rounded-2xl p-5 min-w-[85vw] md:min-w-0 snap-center space-y-4">
      {/* Audio player with static waveform */}
      <IntimateAudioPlayer audioUrl={contribution.voice_url!} />

      {/* Contributor info - small, neutral */}
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-neutral-900">{contribution.contributor_name}</p>
        <p className="text-xs text-neutral-600">
          {contribution.contributor_company && `${contribution.contributor_company} • `}
          {contribution.relationship?.replace(/_/g, " ")}
        </p>
        {contribution.audio_duration_ms && (
          <p className="text-xs text-neutral-500 pt-0.5">{Math.round(contribution.audio_duration_ms / 1000)}s</p>
        )}
      </div>

      {/* Transcript toggle - collapsed by default */}
      {contribution.written_note && (
        <div className="border-t border-neutral-200 pt-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <span>Read transcript</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${showTranscript ? "rotate-180" : ""}`}
            />
          </button>
          {showTranscript && (
            <p className="text-xs text-neutral-600 leading-relaxed mt-2 pl-1">{contribution.written_note}</p>
          )}
        </div>
      )}
    </div>
  )
}
