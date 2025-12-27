"use client"

import { VoiceCard } from "./voice-card"
import { Button } from "./ui/button"
import { Mic } from "lucide-react"
import Link from "next/link"
import type { HighlightPattern } from "@/lib/extract-highlight-patterns"

interface VoiceHookModuleProps {
  voiceContributions: Array<{
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
  }>
  profileName: string
  highlightPatterns?: HighlightPattern[]
}

export function VoiceHookModule({ voiceContributions, profileName, highlightPatterns = [] }: VoiceHookModuleProps) {
  const firstName = profileName?.split(" ")[0] || "them"

  // If voice notes exist, show featured card
  if (voiceContributions.length > 0) {
    const featuredVoice = voiceContributions[0]

    return (
      <section className="py-8 md:py-10">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-3 mb-6 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold text-neutral-900">Hear it in their words</h3>
            <p className="text-sm text-neutral-600">Voice notes add context you can't get from text alone.</p>
          </div>

          <VoiceCard contribution={featuredVoice} highlightPatterns={highlightPatterns} />

          {voiceContributions.length > 1 && (
            <p className="text-center text-sm text-neutral-500 mt-4">
              +{voiceContributions.length - 1} more {voiceContributions.length === 2 ? "voice note" : "voice notes"}
            </p>
          )}
        </div>
      </section>
    )
  }

  // Empty state: elegant invitation
  return (
    <section className="py-8 md:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 md:p-10 rounded-xl border border-neutral-200 bg-gradient-to-br from-blue-50/20 to-transparent text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100/50 mb-2">
            <Mic className="w-6 h-6 text-blue-600" />
          </div>

          <h3 className="text-2xl font-semibold text-neutral-900">Hear it in their words</h3>

          <p className="text-base text-neutral-600 max-w-md mx-auto leading-relaxed">
            One 20–30 second voice note changes everything.
          </p>

          <Link href="/auth/signup">
            <Button
              variant="outline"
              className="mt-4 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 bg-transparent"
            >
              Request a voice note
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
