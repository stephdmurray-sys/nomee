"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { VoiceCard } from "@/components/voice-card"
import { SiteHeader } from "@/components/site-header"
import { AiPatternSummary } from "@/components/ai-pattern-summary"
import { TestimonialGroup } from "@/components/testimonial-group"
import { RelationshipFilter } from "@/components/relationship-filter"
import { filterByRelationship, type RelationshipFilterCategory } from "@/lib/relationship-filter"
import { categorizeTestimonials } from "@/lib/categorize-testimonials"
import { extractRepeatedPhrases } from "@/lib/extract-repeated-phrases"
import { dedupeContributions } from "@/lib/dedupe-contributions"
import { extractHighlightPatterns } from "@/lib/extract-highlight-patterns"
import Link from "next/link"
import type { Profile, Contribution, ImportedFeedback, Trait } from "@/lib/types"

interface PremierProfileClientProps {
  profile: Profile
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  traits: Trait[]
  totalContributions: number
  uniqueCompanies: string[]
  interpretationSentence: string
  vibeLabels: string[]
  anchorQuote: string
}

export function PremierProfileClient({
  profile,
  contributions: rawContributions,
  importedFeedback: rawImportedFeedback,
  traits,
  totalContributions,
  uniqueCompanies,
  interpretationSentence,
  vibeLabels,
  anchorQuote,
}: PremierProfileClientProps) {
  console.log("[v0] PremierProfileClient: Profile loaded:", profile.slug)
  console.log("[v0] PremierProfileClient: Total contributions received:", rawContributions.length)
  console.log(
    "[v0] PremierProfileClient: Contributions with audio_url:",
    rawContributions.filter((c) => c.audio_url).length,
  )

  const contributions = dedupeContributions(rawContributions)
  const voiceContributions = contributions.filter((c) => c.voice_url)
  const voiceNotesCount = voiceContributions.length

  console.log("[v0] PremierProfileClient: voiceContributions.length:", voiceContributions.length)
  console.log("[v0] PremierProfileClient: voiceNotesCount (determines section visibility):", voiceNotesCount)
  console.log("[v0] PremierProfileClient: Will 'In Their Own Words' section render?", voiceNotesCount > 0)

  const analyzableUploads = rawImportedFeedback.filter((u) => u.included_in_analysis && u.ocr_text)
  const totalUploads = rawImportedFeedback.length

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

  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)
  const [selectedHeatmapTrait, setSelectedHeatmapTrait] = useState<string | null>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [howItFeelsRelationshipFilter, setHowItFeelsRelationshipFilter] = useState<RelationshipFilterCategory>("All")
  const [voiceRelationshipFilter, setVoiceRelationshipFilter] = useState<RelationshipFilterCategory>("All")

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
    if (ratio >= 0.8) return 4
    if (ratio >= 0.6) return 3
    if (ratio >= 0.4) return 2
    return 1
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

    switch (level) {
      case 4:
        return {
          bg: "bg-blue-50/90",
          border: "border-blue-200",
          text: "text-neutral-900",
          badge: "bg-blue-100 text-neutral-700",
        }
      case 3:
        return {
          bg: "bg-blue-50/60",
          border: "border-blue-100",
          text: "text-neutral-900",
          badge: "bg-blue-50 text-neutral-600",
        }
      case 2:
        return {
          bg: "bg-blue-50/30",
          border: "border-neutral-200",
          text: "text-neutral-800",
          badge: "bg-neutral-100 text-neutral-600",
        }
      default:
        return {
          bg: "bg-white",
          border: "border-neutral-200",
          text: "text-neutral-700",
          badge: "bg-neutral-50 text-neutral-500",
        }
    }
  }

  const filteredHowItFeels = useMemo(() => {
    return filterByRelationship(howItFeels, howItFeelsRelationshipFilter)
  }, [howItFeels, howItFeelsRelationshipFilter])

  const filteredVoiceContributions = useMemo(() => {
    return filterByRelationship(voiceContributions, voiceRelationshipFilter)
  }, [voiceContributions, voiceRelationshipFilter])

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Floating share cluster - Desktop only */}
      <div className="hidden sm:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-12 md:pb-16">
        {/* Owner anchor */}
        <div
          className={`mb-8 sm:mb-10 md:mb-12 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "0ms" }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-900 mb-2 tracking-tight leading-[1.1]">
            {profile.full_name}
          </h1>

          {profile.headline && (
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-3 leading-relaxed">{profile.headline}</p>
          )}

          <p className="text-sm text-neutral-500 uppercase tracking-wide">
            Nomee Profile · Based on feedback from {totalContributions} {totalContributions === 1 ? "person" : "people"}
            {totalUploads > 0 && ` · ${totalUploads} ${totalUploads === 1 ? "upload" : "uploads"}`}
          </p>

          <p className="text-xs text-neutral-500 mt-2">Each contributor can submit once.</p>

          {/* Mobile share buttons below header */}
          <div className="flex gap-3 mt-4 sm:hidden">
            <button
              onClick={handleShareProfile}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100 text-sm font-medium text-neutral-700 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100 text-sm font-medium text-neutral-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              {showCopied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        {/* Summary section */}
        {totalContributions > 0 && traits.length > 0 && (
          <div
            className={`mb-8 sm:mb-10 md:mb-12 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative max-w-full p-5 sm:p-8 md:p-10 rounded-xl border border-neutral-200 bg-gradient-to-br from-blue-50/30 to-transparent shadow-sm">
              <div className="absolute left-0 top-8 bottom-8 w-1 bg-blue-500/40 rounded-r-full" />

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 pb-4 border-b border-neutral-100">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-neutral-900 leading-tight">
                    Summary of working with {profile.full_name?.split(" ")[0] || "them"}
                  </h2>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="text-xs text-neutral-400 uppercase tracking-widest block">
                      Updated automatically
                    </span>
                    {totalContributions > 0 && (
                      <span className="text-xs text-neutral-500 block mt-1">
                        {totalContributions} {totalContributions === 1 ? "contribution" : "contributions"}
                        {voiceNotesCount > 0 && (
                          <>
                            {" "}
                            • {voiceNotesCount} {voiceNotesCount === 1 ? "voice note" : "voice notes"}
                          </>
                        )}
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

                <AiPatternSummary
                  contributions={rawContributions}
                  importedFeedback={rawImportedFeedback}
                  topTraits={traitsWithExamples.slice(0, 5).map((t) => ({ label: t.label, count: t.count }))}
                />

                <p className="text-xs text-neutral-500 pt-4 border-t border-neutral-100">
                  Generated from {totalContributions} {totalContributions === 1 ? "contribution" : "contributions"}
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

      {/* Reduce spacing between sections on mobile */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 md:space-y-10 py-2 sm:py-4">
        {/* Voice notes section */}
        {voiceNotesCount > 0 && (
          <section className="space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-10">
            <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">In Their Own Words</h3>
              <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-[65ch] mx-auto">
                Unedited voice notes from people who know {profile.full_name?.split(" ")[0]}
              </p>
            </div>

            <div className="flex justify-center">
              <RelationshipFilter
                contributions={voiceContributions}
                selectedCategory={voiceRelationshipFilter}
                onCategoryChange={setVoiceRelationshipFilter}
              />
            </div>

            {filteredVoiceContributions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVoiceContributions.slice(0, 3).map((contribution) => (
                  <VoiceCard
                    key={contribution.id}
                    contribution={contribution}
                    profileName={profile.full_name}
                    highlightPatterns={highlightPatterns}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-600">No perspectives yet from {voiceRelationshipFilter.toLowerCase()}.</p>
                <button
                  onClick={() => setVoiceRelationshipFilter("All")}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium min-h-[44px] px-4"
                >
                  View all perspectives
                </button>
              </div>
            )}
          </section>
        )}

        {voiceNotesCount > 0 && <div className="border-t border-neutral-100" />}

        {/* Pattern Recognition section */}
        {traits.length > 0 && (
          <section className="space-y-4 sm:space-y-6 pt-2 sm:pt-4 md:pt-6">
            <div className="space-y-2 max-w-3xl mx-auto text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">Pattern Recognition</h3>
              <p className="text-sm text-neutral-500">Not hand-picked — patterns emerge as more people contribute.</p>
              <p className="text-xs text-neutral-400 pt-1">Darker = mentioned more often</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {/* Left panel: Top signals */}
              <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white">
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
                  Top signals
                </h4>
                <div className="space-y-2">
                  {traitsWithExamples.slice(0, 5).map((trait) => {
                    const isSelected = selectedHeatmapTrait === trait.label
                    const styles = getFrequencyStyles(trait.count, isSelected)

                    return (
                      <button
                        key={trait.label}
                        onClick={() => handleTraitSelect(isSelected ? null : trait.label)}
                        className={`w-full flex items-center justify-between px-4 py-3 min-h-[44px] rounded-lg border transition-all hover:shadow-sm active:scale-[0.98] ${
                          styles.bg
                        } ${styles.border}`}
                      >
                        <span className={`font-semibold text-sm sm:text-base ${styles.text}`}>{trait.label}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.badge}`}>
                          ×{trait.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right panel: Emerging signals */}
              <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white">
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
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
                        className={`inline-flex items-center gap-2 px-3 py-2 min-h-[36px] rounded-full border transition-all hover:shadow-sm active:scale-95 ${
                          styles.bg
                        } ${styles.border}`}
                      >
                        <span className={`text-xs sm:text-sm font-semibold ${styles.text}`}>{trait.label}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge}`}>
                          ×{trait.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How it feels section */}
        {howItFeels.length > 0 && (
          <>
            <div className="border-t border-neutral-100" />
            <section className="space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-10">
              <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">How it feels</h3>
                <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed">
                  Day-to-day collaboration style and working patterns
                </p>
              </div>

              <div className="flex justify-center">
                <RelationshipFilter
                  contributions={howItFeels}
                  selectedCategory={howItFeelsRelationshipFilter}
                  onCategoryChange={setHowItFeelsRelationshipFilter}
                />
              </div>

              {filteredHowItFeels.length > 0 ? (
                <TestimonialGroup
                  title=""
                  contributions={filteredHowItFeels}
                  selectedTraits={selectedTraits}
                  hoveredTrait={hoveredTrait}
                  profileName={profile.full_name}
                  highlightPatterns={highlightPatterns}
                  isFirstGroup={true}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600">
                    No perspectives yet from {howItFeelsRelationshipFilter.toLowerCase()}.
                  </p>
                  <button
                    onClick={() => setHowItFeelsRelationshipFilter("All")}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium min-h-[44px] px-4"
                  >
                    View all perspectives
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {/* Screenshots and highlights section */}
        {importedFeedback.length > 0 && (
          <>
            <div className="border-t border-neutral-100" />
            <section className="space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-10">
              <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">
                  Screenshots and highlights
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed">
                  {profile.full_name?.split(" ")[0]} saved {importedFeedback.length}{" "}
                  {importedFeedback.length === 1 ? "piece" : "pieces"} of feedback
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {importedFeedback.slice(0, 6).map((feedback, idx) => {
                  const sourceType = feedback.source_type || "Upload"
                  const getSourcePillStyle = (type: string) => {
                    switch (type) {
                      case "LinkedIn":
                        return "bg-[#0077B5] text-white" // LinkedIn blue
                      case "Email":
                        return "bg-neutral-600 text-white" // Neutral grey
                      case "DM":
                        return "bg-neutral-800 text-white" // Dark grey
                      case "Review":
                        return "bg-blue-500 text-white" // Trust blue
                      default:
                        return "bg-neutral-400 text-white" // Light grey
                    }
                  }

                  return (
                    <div
                      key={feedback.id}
                      className="group p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white hover:shadow-xl hover:scale-[1.02] hover:border-neutral-300 transition-all duration-300 ease-out relative flex flex-col cursor-pointer"
                    >
                      {feedback.image_url && (
                        <div className="mb-4 rounded-lg overflow-hidden border border-neutral-200">
                          <img
                            src={feedback.image_url || "/placeholder.svg"}
                            alt={`Feedback screenshot ${idx + 1}`}
                            className="w-full h-auto group-hover:brightness-105 transition-all duration-300"
                          />
                        </div>
                      )}
                      {feedback.ai_extracted_excerpt && (
                        <p
                          className="text-base leading-relaxed text-neutral-700 mb-4 flex-1"
                          style={{ lineHeight: "1.65" }}
                        >
                          {feedback.ai_extracted_excerpt}
                        </p>
                      )}
                      <div className="flex items-end justify-between gap-4 mt-auto pt-4 border-t border-neutral-100">
                        <div className="text-xs text-neutral-500 flex-1">
                          {feedback.giver_name && (
                            <>
                              <span className="font-medium">{feedback.giver_name}</span>
                              {feedback.giver_role && <span> · {feedback.giver_role}</span>}
                              {feedback.giver_company && <span> · {feedback.giver_company}</span>}
                            </>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getSourcePillStyle(sourceType)}`}
                        >
                          {sourceType}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {/* Final CTA section */}
        <div className="border-t border-neutral-100" />
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">
              Build your own Nomee profile
            </h3>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-[60ch] mx-auto">
              Get feedback from people you've worked with. Create a profile that shows how you collaborate, solve
              problems, and make an impact.
            </p>
            <div className="pt-2 sm:pt-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white px-8 py-3 min-h-[48px] text-base sm:text-lg rounded-xl transition-colors touch-manipulation"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
