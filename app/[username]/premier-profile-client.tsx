"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { TestimonialGroup } from "@/components/testimonial-group"
import { VoiceCard } from "@/components/voice-card" // Import VoiceCard component
import { SiteHeader } from "@/components/site-header" // Import SiteHeader component
import { AiPatternSummary } from "@/components/ai-pattern-summary"
import { categorizeTestimonials } from "@/lib/categorize-testimonials"
import { extractRepeatedPhrases } from "@/lib/extract-repeated-phrases"
import { dedupeContributions } from "@/lib/dedupe-contributions"
import { filterWrongOwnerQuotes } from "@/lib/filter-wrong-owner-quotes"
import { extractHighlightPatterns } from "@/lib/extract-highlight-patterns"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"
import type { Profile, Contribution, ImportedFeedback, Trait } from "@/lib/types"
import Link from "next/link"

interface PremierProfileClientProps {
  profile: Profile
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  traits: Trait[]
}

export function PremierProfileClient({
  profile,
  contributions: rawContributions,
  importedFeedback: rawImportedFeedback,
  traits,
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
      {/* Fixed site header for navigation */}
      <SiteHeader />

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

      {/* Top padding to account for fixed header */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-28 md:pt-32 pb-12 md:pb-16">
        {/* Owner anchor */}
        <div
          className={`mb-10 md:mb-12 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "0ms" }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-neutral-900 mb-2 tracking-tight leading-[1.1]">
            {profile.full_name}
          </h1>

          {profile.headline && (
            <p className="text-lg md:text-xl text-neutral-600 mb-3 leading-relaxed">{profile.headline}</p>
          )}

          <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            Nomee profile · Based on feedback from {rawContributions.length}{" "}
            {rawContributions.length === 1 ? "person" : "people"}
          </p>
        </div>

        {rawContributions.length > 0 && traits.length > 0 && (
          <div
            className={`mb-10 md:mb-12 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative max-w-full p-8 md:p-10 rounded-xl border border-neutral-200 bg-gradient-to-br from-blue-50/30 to-transparent shadow-sm">
              {/* Left accent bar */}
              <div className="absolute left-0 top-8 bottom-8 w-1 bg-blue-500/40 rounded-r-full" />

              <div className="space-y-6">
                {/* Header with meta */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                  <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 leading-tight">
                    Summary of working with {profile.full_name?.split(" ")[0] || "them"}
                  </h2>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                      Updated automatically
                    </span>
                    {rawContributions.length > 0 && (
                      <span className="text-xs text-neutral-500 block mt-1">
                        {rawContributions.length} {rawContributions.length === 1 ? "contribution" : "contributions"} •{" "}
                        {voiceContributions.length} {voiceContributions.length === 1 ? "voice note" : "voice notes"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary content with expanded view */}
                <AiPatternSummary
                  contributions={rawContributions}
                  topTraits={traitsWithExamples.slice(0, 5).map((t) => ({ label: t.label, count: t.count }))}
                />

                {/* Credibility line */}
                <p className="text-xs text-neutral-500 pt-4 border-t border-neutral-100">
                  Generated from {rawContributions.length}{" "}
                  {rawContributions.length === 1 ? "contribution" : "contributions"} • Updates as more people contribute
                </p>
              </div>
            </div>
          </div>
        )}
        {/* END HERO MODULE */}

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

          {/* Added: Display interpretation sentence if available */}
          {profile.interpretation_sentence && (
            <p
              className={`text-base md:text-lg text-neutral-600 leading-relaxed max-w-[65ch] transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "600ms", lineHeight: "1.6" }}
            >
              {profile.interpretation_sentence}
            </p>
          )}
        </div>
      </section>
      {/* End hero section */}

      <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-16 md:space-y-20 py-8">
        {traits.length > 0 && (
          <section className="space-y-6 pt-8 md:pt-10">
            <div className="space-y-2 max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-semibold text-neutral-900 text-center">Pattern Recognition</h3>
              <p className="text-sm text-neutral-500 text-center">
                Not hand-picked — patterns emerge as more people contribute.
              </p>
            </div>

            {/* Bento grid layout: Top signals (left) + Emerging signals (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Left panel: Top signals */}
              <div className="p-6 rounded-xl border border-neutral-200 bg-white">
                <h4 className="text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">Top signals</h4>
                <div className="space-y-2">
                  {traitsWithExamples.slice(0, 5).map((trait) => {
                    const isSelected = selectedHeatmapTrait === trait.label
                    return (
                      <button
                        key={trait.label}
                        onClick={() => handleTraitSelect(isSelected ? null : trait.label)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all hover:shadow-sm ${
                          isSelected
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <span className={`font-semibold ${isSelected ? "text-white" : "text-neutral-900"}`}>
                          {trait.label}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            isSelected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          ×{trait.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right panel: Emerging signals */}
              <div className="p-6 rounded-xl border border-neutral-200 bg-white">
                <h4 className="text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
                  Emerging signals
                </h4>
                <div className="flex flex-wrap gap-2">
                  {traitsWithExamples.slice(5, 15).map((trait) => {
                    const isSelected = selectedHeatmapTrait === trait.label
                    return (
                      <button
                        key={trait.label}
                        onClick={() => handleTraitSelect(isSelected ? null : trait.label)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all hover:shadow-sm ${
                          isSelected
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <span className={`font-medium ${isSelected ? "text-white" : "text-neutral-700"}`}>
                          {trait.label}
                        </span>
                        <span className={`text-xs font-semibold ${isSelected ? "text-white/70" : "text-neutral-500"}`}>
                          ×{trait.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {selectedHeatmapTrait && (
              <button
                onClick={() => handleTraitSelect(null)}
                className="text-sm text-neutral-600 hover:text-neutral-900 underline py-2 mx-auto block"
              >
                Clear filter
              </button>
            )}
          </section>
        )}
        {/* END PATTERN RECOGNITION */}

        {/* Subtle section divider */}
        <div className="border-t border-neutral-100" />

        {/* In Their Own Words - Voice Section */}
        {voiceContributions.length > 0 && (
          <section className="space-y-8 py-16 md:py-20">
            {/* Header - neutral and editorial */}
            <div className="space-y-2 text-center">
              <h3 className="text-3xl md:text-4xl font-semibold text-neutral-900">In Their Own Words</h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                Unedited voice notes from people who know {profile.full_name?.split(" ")[0] || "them"}
              </p>
            </div>

            {/* Mobile: horizontal scroll with snap */}
            <div className="md:hidden -mx-6">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 scrollbar-hide">
                {voiceContributions.map((contribution) => (
                  <VoiceCard
                    key={contribution.id}
                    contribution={contribution}
                    isMobile
                    highlightPatterns={highlightPatterns}
                  />
                ))}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto max-w-6xl">
              {voiceContributions.map((contribution) => (
                <VoiceCard key={contribution.id} contribution={contribution} highlightPatterns={highlightPatterns} />
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 pt-8">
              <div className="w-24 h-px bg-neutral-200" />
              <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors tracking-wider">
                Share your perspective
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
                  {[...importedFeedback, ...importedFeedback].map((feedback, index) => {
                    const keywords = extractKeywordsFromText(feedback.ai_extracted_excerpt || "", feedback.traits || [])
                    const patterns = keywords
                      .filter((k) => typeof k === "string" && k.trim().length > 0)
                      .map((keyword) => ({
                        phrase: keyword,
                        tier: "theme" as const,
                        frequency: 1,
                      }))

                    return (
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
                          <div className="mb-4 text-sm text-neutral-700 leading-relaxed italic max-w-[72ch]">
                            "{highlightQuote(feedback.ai_extracted_excerpt, patterns, 5)}"
                          </div>
                        )}

                        {feedback.traits && feedback.traits.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {feedback.traits.slice(0, 3).map((trait, idx) => (
                              <Badge
                                key={`${feedback.id}-trait-${idx}`}
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-neutral-100/80 text-neutral-700 border-neutral-200/40"
                              >
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <section className="text-center py-16">
          <Link
            href="/auth/signup"
            className="inline-block rounded-full bg-neutral-900 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-neutral-800 hover:scale-105 hover:shadow-xl"
          >
            Create your Nomee
          </Link>
        </section>
      </div>
    </div>
  )
}
