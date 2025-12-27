"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { TestimonialGroup } from "@/components/testimonial-group"
import { VoiceCard } from "@/components/voice-card" // Import VoiceCard component
import { categorizeTestimonials } from "@/lib/categorize-testimonials"
import { extractRepeatedPhrases } from "@/lib/extract-repeated-phrases"
import { dedupeContributions } from "@/lib/dedupe-contributions"
import { filterWrongOwnerQuotes } from "@/lib/filter-wrong-owner-quotes"
import { extractHighlightPatterns } from "@/lib/extract-highlight-patterns"
import { highlightQuote } from "@/lib/highlight-quote"
import type { ImportedFeedback } from "@/lib/imported-feedback-traits"
import type { Contribution } from "@/types"

interface PremierProfileClientProps {
  profile: any
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  traits: any[]
  totalContributions: number
  uniqueCompanies: number
  interpretationSentence: string | null
  vibeLabels?: string[]
  anchorQuote: string | null
}

export function PremierProfileClient({
  profile,
  contributions: rawContributions,
  importedFeedback: rawImportedFeedback,
  traits,
  totalContributions,
  uniqueCompanies,
  interpretationSentence,
  vibeLabels = [],
  anchorQuote,
}: PremierProfileClientProps) {
  const dedupedContributions = dedupeContributions(rawContributions, profile.full_name)
  const contributions = filterWrongOwnerQuotes(dedupedContributions, profile.full_name)

  // Filter imported feedback to remove quotes mentioning wrong owner names
  const importedFeedback = rawImportedFeedback.filter((feedback) => {
    const ownerFirstName = profile.full_name?.split(" ")[0]?.toLowerCase()
    const excerptLower = (feedback.ai_extracted_excerpt || "").toLowerCase()

    // Check if excerpt mentions a different name
    const commonNames = ["stephanie", "sarah", "john", "michael", "david", "jennifer", "jessica"]
    const mentionsDifferentName = commonNames.some((name) => name !== ownerFirstName && excerptLower.includes(name))

    if (mentionsDifferentName) {
      console.log(`[v0] Filtering imported feedback ${feedback.id} - mentions different owner name`)
      return false
    }

    return true
  })

  const voiceContributions = contributions.filter((c) => c.voice_url)

  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)
  const [selectedHeatmapTrait, setSelectedHeatmapTrait] = useState<string | null>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleTraitSelect = (trait: string | null) => {
    if (!trait) {
      setSelectedTraits([])
      setSelectedHeatmapTrait(null)
      setHoveredTrait(null)
    } else {
      setSelectedTraits([trait])
      setSelectedHeatmapTrait(trait)
      setHoveredTrait(trait)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${profile.full_name}'s Nomee Profile`,
          text: `Check out ${profile.full_name}'s professional feedback on Nomee`,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      handleCopyLink()
    }
  }

  const traitsWithExamples = traits.map((trait) => ({
    label: trait.label,
    count: trait.count,
    category: "leadership" as const,
    examples: trait.examples || [],
  }))

  const { howItFeels } = categorizeTestimonials(contributions)
  const repeatedPhrases = extractRepeatedPhrases(contributions)
  const topTraits = traits.slice(0, 5).map((t) => t.label)

  const highlightPatterns = extractHighlightPatterns(contributions, importedFeedback, traits)

  console.log("[v0] Extracted highlight patterns:", highlightPatterns)
  console.log("[v0] Number of contributions:", contributions.length)
  console.log("[v0] Number of imported feedback:", importedFeedback.length)

  return (
    <div className="min-h-screen bg-white">
      {/* Floating share cluster - Desktop only */}
      <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShareProfile}
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 hover:border-neutral-400 hover:bg-white shadow-sm opacity-50 hover:opacity-100 transition-all"
            title="Share profile"
          >
            <Share2 className="h-4 w-4 text-neutral-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 hover:border-neutral-400 hover:bg-white shadow-sm opacity-50 hover:opacity-100 transition-all"
            title={showCopied ? "Copied!" : "Copy link"}
          >
            <Copy className="h-4 w-4 text-neutral-600" />
          </Button>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 md:pt-20 pb-12 md:pb-16">
        {/* Owner anchor */}
        <div
          className={`mb-8 md:mb-10 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "0ms" }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-neutral-900 mb-2 tracking-tight leading-[1.1]">
            {profile.full_name}
          </h1>

          {profile.headline && (
            <p className="text-lg md:text-xl text-neutral-600 mb-3 leading-relaxed">{profile.headline}</p>
          )}

          <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            Nomee profile · Based on feedback from {totalContributions} {totalContributions === 1 ? "person" : "people"}
          </p>
        </div>

        {/* Insight summary with highlighted traits */}
        <div className="space-y-6 md:space-y-8">
          <h2
            className={`text-xl md:text-2xl font-medium text-neutral-600 leading-snug transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "200ms", lineHeight: "1.35" }}
          >
            What consistently shows up about working with {profile.full_name?.split(" ")[0] || "them"}
          </h2>

          {topTraits.length > 0 && (
            <div
              className={`flex flex-wrap gap-3 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "400ms" }}
            >
              {topTraits.map((trait, idx) => (
                <span
                  key={trait}
                  className="inline-block text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 px-4 py-2 rounded-lg transition-transform hover:scale-105"
                  style={{
                    backgroundColor:
                      idx === 0
                        ? "rgba(59, 130, 246, 0.15)"
                        : idx === 1
                          ? "rgba(59, 130, 246, 0.10)"
                          : "rgba(59, 130, 246, 0.06)",
                    lineHeight: "1.2",
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {interpretationSentence && (
            <p
              className={`text-base md:text-lg text-neutral-600 leading-relaxed max-w-[65ch] transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "600ms", lineHeight: "1.6" }}
            >
              {interpretationSentence}
            </p>
          )}
        </div>
      </section>
      {/* End hero section */}

      <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-20 md:space-y-24 py-10">
        {/* Working Energy Snapshot */}
        {vibeLabels.length > 0 && (
          <section className="space-y-6 py-8 md:py-10">
            <div className="relative max-w-4xl mx-auto p-8 md:p-10 rounded-3xl border-2 border-blue-200/60 bg-blue-50/20 animate-border-draw">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium text-center">
                  {profile.full_name?.split(" ")[0] || "The"}'s working energy
                </p>

                <div className="text-center">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-tight">
                    {vibeLabels.map((label, idx) => (
                      <span key={label}>
                        {label}
                        {idx < vibeLabels.length - 1 && ". "}
                        {idx === vibeLabels.length - 1 && "."}
                      </span>
                    ))}
                  </p>
                </div>

                <p className="text-sm text-neutral-500 text-center">Based on patterns across Nomee submissions.</p>
              </div>
            </div>
          </section>
        )}

        {/* Subtle section divider */}
        <div className="border-t border-neutral-100" />

        {/* Pattern Recognition */}
        {traits.length > 0 && (
          <section className="space-y-8 py-8 md:py-10">
            <div className="space-y-3 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-semibold text-neutral-900 text-center">Pattern Recognition</h3>
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed text-center max-w-[65ch] mx-auto">
                Filter reviews below by selecting traits contributors selected when describing what it's like to work
                together.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 max-w-5xl mx-auto justify-center">
              {traitsWithExamples.slice(0, 12).map((trait, idx) => {
                const maxCount = Math.max(...traitsWithExamples.map((t) => t.count))
                const relativeFrequency = trait.count / maxCount

                const isHighFrequency = relativeFrequency >= 0.7
                const isMediumFrequency = relativeFrequency >= 0.4 && relativeFrequency < 0.7

                const textColor = isHighFrequency
                  ? "text-neutral-800"
                  : isMediumFrequency
                    ? "text-neutral-700"
                    : "text-neutral-600"

                const borderOpacity = isHighFrequency
                  ? "border-neutral-400"
                  : isMediumFrequency
                    ? "border-neutral-300"
                    : "border-neutral-200"

                const bgOpacity = isHighFrequency
                  ? "rgba(59, 130, 246, 0.08)"
                  : isMediumFrequency
                    ? "rgba(59, 130, 246, 0.05)"
                    : "rgba(59, 130, 246, 0.02)"

                const isSelected = selectedHeatmapTrait === trait.label

                const hiddenOnMobile = idx >= 5 ? "hidden md:flex" : "flex"

                return (
                  <button
                    key={trait.label}
                    onClick={() => handleTraitSelect(isSelected ? null : trait.label)}
                    className={`${hiddenOnMobile} items-center gap-2 px-4 py-3 md:py-2.5 rounded-lg border transition-all hover:scale-[1.02] ${borderOpacity} ${
                      isSelected ? "ring-2 ring-neutral-900 ring-offset-2" : ""
                    }`}
                    style={{
                      backgroundColor: isSelected ? "var(--near-black)" : bgOpacity,
                    }}
                  >
                    <span className={`text-sm md:text-base font-medium ${isSelected ? "text-white" : textColor}`}>
                      {trait.label}
                    </span>
                    <span
                      className={`text-xs font-semibold ${isSelected ? "text-white/70" : "text-neutral-500"}`}
                      title={`Selected by ${trait.count} ${trait.count === 1 ? "contributor" : "contributors"}`}
                    >
                      ×{trait.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {selectedHeatmapTrait && (
              <button
                onClick={() => handleTraitSelect(null)}
                className="text-sm text-neutral-600 hover:text-neutral-900 underline py-2"
              >
                Clear filter
              </button>
            )}
          </section>
        )}

        {/* Subtle section divider */}
        <div className="border-t border-neutral-100" />

        {/* In Their Own Words - Voice Section */}
        {voiceContributions.length > 0 && (
          <section className="space-y-6 py-12 md:py-16">
            <div className="space-y-2 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-semibold text-neutral-900 text-center">In Their Own Words</h3>
              <p className="text-sm md:text-base text-neutral-600 text-center">
                Real voices from people who know {profile.full_name?.split(" ")[0] || "them"}
              </p>
              <p className="text-xs text-neutral-500 text-center pt-1">Submitted by verified contributors</p>
            </div>

            <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-4 -mx-4 scrollbar-hide">
              {voiceContributions.map((contribution) => (
                <VoiceCard key={contribution.id} contribution={contribution} />
              ))}
            </div>

            <div className="hidden md:flex md:flex-col md:gap-4 max-w-2xl mx-auto">
              {voiceContributions.map((contribution) => (
                <VoiceCard key={contribution.id} contribution={contribution} />
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button className="px-6 py-2 text-sm text-neutral-700 border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors duration-200">
                Add your voice
              </button>
            </div>
          </section>
        )}

        {/* Subtle section divider */}
        <div className="border-t border-neutral-100" />

        {/* How it feels */}
        {howItFeels.length > 0 && (
          <section className="space-y-8 py-8 md:py-10">
            <div className="space-y-3 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-semibold text-neutral-900 text-center">How it feels</h3>
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed text-center max-w-[65ch] mx-auto">
                Day-to-day collaboration style and working patterns
              </p>
            </div>
            <TestimonialGroup
              title=""
              contributions={howItFeels}
              selectedTraits={selectedTraits}
              hoveredTrait={hoveredTrait}
              profileName={profile.full_name}
              highlightPatterns={highlightPatterns}
            />
          </section>
        )}

        {/* Uploaded Reviews */}
        {importedFeedback.length > 0 && (
          <>
            <div className="border-t border-neutral-100" />
            <section className="space-y-8 py-8 md:py-10">
              <div className="space-y-3 max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-semibold text-neutral-900 text-center">
                  Uploaded Reviews by {profile.full_name?.split(" ")[0] || "Owner"}
                </h3>
              </div>

              <div className="relative overflow-hidden -mx-6 lg:-mx-8">
                <div className="flex gap-5 animate-marquee-left-slow hover:[animation-play-state:paused] px-6 lg:px-8">
                  {[...importedFeedback, ...importedFeedback].map((feedback, index) => (
                    <Card
                      key={`${feedback.id}-${index}`}
                      className="p-6 border border-neutral-200 bg-white flex-shrink-0 w-[340px] hover:shadow-lg transition-all duration-300 rounded-2xl"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-neutral-900">{feedback.giver_name}</p>
                          {feedback.giver_company && (
                            <p className="text-xs text-neutral-600 mt-0.5">{feedback.giver_company}</p>
                          )}
                          {feedback.giver_role && (
                            <p className="text-xs text-neutral-500 mt-0.5">{feedback.giver_role}</p>
                          )}
                        </div>
                        {feedback.source_type && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-100/40 text-blue-800 border-blue-200/40"
                          >
                            {feedback.source_type}
                          </Badge>
                        )}
                      </div>

                      {feedback.ai_extracted_excerpt && (
                        <p className="mb-4 text-sm text-neutral-700 leading-relaxed italic max-w-[72ch]">
                          "{highlightQuote(feedback.ai_extracted_excerpt, highlightPatterns, 3)}"
                        </p>
                      )}

                      {feedback.traits && feedback.traits.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {feedback.traits.slice(0, 4).map((trait) => (
                            <Badge
                              key={trait}
                              variant="outline"
                              className="text-xs text-neutral-500 border-neutral-200"
                            >
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {feedback.approx_date && (
                        <p className="text-xs text-neutral-400">
                          {new Date(feedback.approx_date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <section className="text-center py-16">
          <a
            href="/auth/signup"
            className="inline-block rounded-full bg-neutral-900 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-neutral-800 hover:scale-105 hover:shadow-xl"
          >
            Create your Nomee
          </a>
        </section>
      </div>
    </div>
  )
}
