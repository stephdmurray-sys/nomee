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
  const dedupedImportedFeedback = Array.from(
    new Map(
      rawImportedFeedback.map((feedback) => {
        const key = `${feedback.giver_name}|${feedback.giver_company}|${feedback.ai_extracted_excerpt}`
        return [key, feedback]
      }),
    ).values(),
  )

  const importedFeedback = dedupedImportedFeedback.filter((feedback) => {
    const ownerFirstName = profile.full_name?.split(" ")[0]?.toLowerCase()
    const excerptLower = (feedback.ai_extracted_excerpt || "").toLowerCase()

    const commonNames = ["stephanie", "sarah", "john", "michael", "david", "jennifer", "jessica"]
    const mentionsDifferentName = commonNames.some((name) => name !== ownerFirstName && excerptLower.includes(name))

    return !mentionsDifferentName
  })

  const voiceContributions = contributions.filter((c) => c.audio_url && c.audio_url.trim() !== "")
  const analyzableUploads = rawImportedFeedback.filter((u) => u.included_in_analysis && u.ocr_text)
  const totalUploads = rawImportedFeedback.length
  const voiceNotesCount = voiceContributions.length

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

  const getFrequencyLevel = (count: number): number => {
    const maxCount = Math.max(...traitsWithExamples.map((t) => t.count))
    const ratio = count / maxCount
    if (ratio >= 0.8) return 4 // Level 4: highest (80-100%)
    if (ratio >= 0.6) return 3 // Level 3: high (60-79%)
    if (ratio >= 0.4) return 2 // Level 2: medium (40-59%)
    return 1 // Level 1: low (0-39%)
  }

  const getFrequencyStyles = (count: number, isSelected: boolean) => {
    if (isSelected) {
      return {
        bg: "bg-neutral-900",
        border: "border-neutral-900",
        text: "text-white",
        badge: "bg-white/20 text-white",
      }
    }

    const level = getFrequencyLevel(count)

    // Apply light blue intensity based on frequency level
    switch (level) {
      case 4: // Highest frequency
        return {
          bg: "bg-blue-50/90",
          border: "border-blue-200",
          text: "text-neutral-900",
          badge: "bg-blue-100 text-neutral-700",
        }
      case 3: // High frequency
        return {
          bg: "bg-blue-50/60",
          border: "border-blue-100",
          text: "text-neutral-900",
          badge: "bg-blue-50 text-neutral-600",
        }
      case 2: // Medium frequency
        return {
          bg: "bg-blue-50/30",
          border: "border-neutral-200",
          text: "text-neutral-800",
          badge: "bg-neutral-100 text-neutral-600",
        }
      default: // Low frequency
        return {
          bg: "bg-white",
          border: "border-neutral-200",
          text: "text-neutral-700",
          badge: "bg-neutral-50 text-neutral-500",
        }
    }
  }

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

          <p className="text-sm text-neutral-500 uppercase tracking-wide">
            Nomee Profile · Based on feedback from {rawContributions.length}{" "}
            {rawContributions.length === 1 ? "person" : "people"}
            {totalUploads > 0 && ` · ${totalUploads} ${totalUploads === 1 ? "upload" : "uploads"}`}
          </p>

          <p className="text-xs text-neutral-500 mt-2">Each contributor can submit once.</p>
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
                    <span className="text-xs text-neutral-400 uppercase tracking-widest block">
                      Updated automatically
                    </span>
                    {rawContributions.length > 0 && (
                      <span className="text-xs text-neutral-500 block mt-1">
                        {rawContributions.length} {rawContributions.length === 1 ? "contribution" : "contributions"} •{" "}
                        {voiceNotesCount} {voiceNotesCount === 1 ? "voice note" : "voice notes"}
                        {totalUploads > 0 && (
                          <>
                            {" "}
                            • {totalUploads} {totalUploads === 1 ? "upload" : "uploads"}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary content */}
                <AiPatternSummary
                  contributions={rawContributions}
                  importedFeedback={rawImportedFeedback}
                  topTraits={traitsWithExamples.slice(0, 5).map((t) => ({ label: t.label, count: t.count }))}
                />

                <p className="text-xs text-neutral-500 pt-4 border-t border-neutral-100">
                  Generated from {rawContributions.length}{" "}
                  {rawContributions.length === 1 ? "contribution" : "contributions"}
                  {totalUploads > 0 && (
                    <>
                      {" "}
                      and {totalUploads} {totalUploads === 1 ? "upload" : "uploads"}
                    </>
                  )}{" "}
                  • Updates as more people contribute
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-16 md:space-y-20 py-8">
        {/* In Their Own Words - ALWAYS PRESENT */}
        <section className="space-y-8 py-8 md:py-10">
          {/* Header - neutral and editorial */}
          <div className="space-y-2 text-center">
            <h3 className="text-3xl md:text-4xl font-semibold text-neutral-900">In Their Own Words</h3>
            <p className="text-base text-neutral-600 leading-relaxed">
              {voiceContributions.length > 0
                ? `Unedited voice notes from people who know ${profile.full_name?.split(" ")[0] || "them"}`
                : "Voice notes appear here when contributors add them."}
            </p>
          </div>

          {/* Show voice cards if they exist */}
          {voiceContributions.length > 0 ? (
            <>
              {/* Mobile: horizontal scroll with snap */}
              <div className="md:hidden -mx-6">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 scrollbar-hide">
                  {voiceContributions.slice(0, 3).map((contribution) => (
                    <VoiceCard
                      key={contribution.id}
                      contribution={contribution}
                      isMobile
                      highlightPatterns={highlightPatterns}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop: grid layout */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto max-w-6xl">
                {voiceContributions.slice(0, 3).map((contribution) => (
                  <VoiceCard key={contribution.id} contribution={contribution} highlightPatterns={highlightPatterns} />
                ))}
              </div>

              {/* Show "See all" if more than 3 */}
              {voiceContributions.length > 3 && (
                <p className="text-center text-sm text-neutral-500 mt-4">
                  +{voiceContributions.length - 3} more {voiceContributions.length === 4 ? "voice note" : "voice notes"}
                </p>
              )}
            </>
          ) : (
            // Empty state: calm placeholder only, NO button
            <div className="max-w-2xl mx-auto text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <p className="text-sm text-neutral-500">Voice notes appear here when contributors add them.</p>
            </div>
          )}
        </section>

        {/* Subtle section divider */}
        <div className="border-t border-neutral-100" />

        {traits.length > 0 && (
          <section className="space-y-6 pt-8 md:pt-10">
            <div className="space-y-2 max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-semibold text-neutral-900 text-center">Pattern Recognition</h3>
              <p className="text-sm text-neutral-500 text-center">
                Not hand-picked — patterns emerge as more people contribute.
              </p>
              <p className="text-xs text-neutral-400 text-center pt-1">Darker = mentioned more often</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Left panel: Top signals */}
              <div className="p-6 rounded-xl border border-neutral-200 bg-white">
                <h4 className="text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">Top signals</h4>
                <div className="space-y-2">
                  {traitsWithExamples.slice(0, 5).map((trait) => {
                    const isSelected = selectedHeatmapTrait === trait.label
                    const styles = getFrequencyStyles(trait.count, isSelected)

                    return (
                      <button
                        key={trait.label}
                        onClick={() => handleTraitSelect(isSelected ? null : trait.label)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all hover:shadow-sm ${
                          styles.bg
                        } ${styles.border}`}
                      >
                        <span className={`font-semibold ${styles.text}`}>{trait.label}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.badge}`}>
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
                    const styles = getFrequencyStyles(trait.count, isSelected)

                    return (
                      <button
                        key={trait.label}
                        onClick={() => handleTraitSelect(isSelected ? null : trait.label)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all hover:shadow-sm ${
                          styles.bg
                        } ${styles.border}`}
                      >
                        <span className={`font-medium ${styles.text}`}>{trait.label}</span>
                        <span className={`text-xs font-semibold ${styles.badge}`}>×{trait.count}</span>
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

        {/* Subtle section divider */}
        <div className="border-t border-neutral-100" />

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

        {importedFeedback.length > 0 && (
          <>
            <div className="border-t border-neutral-100" />
            <section className="space-y-8 py-8 md:py-10">
              <div className="space-y-3 max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-semibold text-neutral-900 text-center">Uploaded proof</h3>
                <p className="text-sm text-neutral-600 text-center">
                  Screenshots and highlights {profile.full_name?.split(" ")[0] || "they"} saved.
                </p>
              </div>

              <div className="relative overflow-hidden -mx-6 lg:-mx-8">
                <div className="flex gap-5 animate-marquee-left-slow hover:[animation-play-state:paused] px-6 lg:px-8">
                  {importedFeedback.map((feedback, index) => {
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
