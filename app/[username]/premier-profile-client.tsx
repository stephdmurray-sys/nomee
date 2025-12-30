"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy, MessageSquare, Upload, Info } from "lucide-react"
import { VoiceCard } from "@/components/voice-card"
import { AiPatternSummary } from "@/components/ai-pattern-summary"
import { RelationshipFilter } from "@/components/relationship-filter"
import type { RelationshipFilterCategory } from "@/lib/relationship-filter"
import { dedupeContributions } from "@/lib/dedupe-contributions"
import type { Profile, Contribution, ImportedFeedback } from "@/lib/types"
import type { ProfileAnalysis } from "@/lib/build-profile-analysis"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"
import { PremierTraitBar } from "@/components/premier-trait-bar"
import { ProofSnapshot } from "@/components/proof-snapshot"
import { PremierSignalBar } from "@/components/premier-signal-bar"
import { usePinnedHighlights, PinnedHighlightsDisplay, PinButton } from "@/components/pinned-highlights"
import { SmartVibePills } from "@/components/smart-vibe-pills"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PremierProfileClientProps {
  profile: Profile
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  totalContributions: number
  uniqueCompanies: string[]
  interpretationSentence: string
  anchorQuote: string
  profileAnalysis: ProfileAnalysis
  isOwner: boolean
}

export function PremierProfileClient({
  profile,
  contributions: rawContributions,
  importedFeedback: rawImportedFeedback,
  totalContributions,
  uniqueCompanies,
  interpretationSentence,
  anchorQuote,
  profileAnalysis,
  isOwner,
}: PremierProfileClientProps) {
  const contributions = dedupeContributions(rawContributions)
  const voiceContributions = contributions.filter((c) => c.voice_url)
  const voiceNotesCount = useMemo(() => {
    const count = rawContributions.filter((c) => c.voice_url).length
    console.log("[VOICE] Profile: Voice contributions detected", {
      totalContributions: rawContributions.length,
      voiceCount: count,
      voiceContributionIds: rawContributions.filter((c) => c.voice_url).map((c) => c.id),
    })
    return count
  }, [rawContributions])

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

  const [selectedTraitFilters, setSelectedTraitFilters] = useState<string[]>([])
  const [sourceFilter, setSourceFilter] = useState<"all" | "nomee" | "imported">("all")
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)
  const [selectedHeatmapTrait, setSelectedHeatmapTrait] = useState<string | null>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [howItFeelsRelationshipFilter, setHowItFeelsRelationshipFilter] = useState<RelationshipFilterCategory>("All")
  const [voiceRelationshipFilter, setVoiceRelationshipFilter] = useState<RelationshipFilterCategory>("All")

  const { pinnedItems, pinQuote, pinVoice, pinTrait, unpin, isPinned } = usePinnedHighlights(profile.slug)

  const [selectedVibeFilters, setSelectedVibeFilters] = useState<string[]>([])
  const [snapshotFilter, setSnapshotFilter] = useState<{ type: "trait" | "vibe" | "outcome"; value: string } | null>(
    null,
  )

  const topSignals = useMemo(() => {
    return profileAnalysis.traitSignals.slice(0, 6).map((s) => s.label)
  }, [profileAnalysis.traitSignals])

  const filteredVoiceContributions = useMemo(() => {
    if (voiceRelationshipFilter === "All") return voiceContributions
    return voiceContributions.filter((c) => c.relationship_category === voiceRelationshipFilter)
  }, [voiceContributions, voiceRelationshipFilter])

  const howItFeelsContributions = useMemo(() => {
    return contributions.filter((c) => c.written_note?.trim())
  }, [contributions])

  const allCards = useMemo(() => {
    const nomeeCards = howItFeelsContributions.map((c) => ({
      id: c.id,
      excerpt: c.written_note || "",
      traits: [...(c.traits_category1 || []), ...(c.traits_category2 || []), ...(c.traits_category3 || [])],
      type: "nomee" as const,
    }))

    const importedCards = importedFeedback.map((f) => ({
      id: f.id,
      excerpt: f.ai_extracted_excerpt || "",
      traits: f.traits || [],
      type: "imported" as const,
    }))

    return [...nomeeCards, ...importedCards]
  }, [howItFeelsContributions, importedFeedback])

  const getFilteredCards = (cards: typeof allCards) => {
    if (!snapshotFilter) return cards

    return cards.filter((card) => {
      const text = (card.excerpt || "").toLowerCase()
      const traits = card.traits || []

      if (snapshotFilter.type === "trait") {
        return traits.some((t) => t.toLowerCase().includes(snapshotFilter.value.toLowerCase()))
      } else if (snapshotFilter.type === "vibe") {
        // Check if vibe word appears in text or traits
        return (
          text.includes(snapshotFilter.value.toLowerCase()) ||
          traits.some((t) => t.toLowerCase().includes(snapshotFilter.value.toLowerCase()))
        )
      } else if (snapshotFilter.type === "outcome") {
        return text.includes(snapshotFilter.value.toLowerCase())
      }
      return true
    })
  }

  const filteredHowItFeels = useMemo(() => {
    let filtered = howItFeelsContributions

    if (howItFeelsRelationshipFilter !== "All") {
      filtered = filtered.filter((c) => c.relationship_category === howItFeelsRelationshipFilter)
    }

    if (selectedTraitFilters.length > 0) {
      filtered = filtered.filter((c) => {
        const allTraits = [...(c.traits_category1 || []), ...(c.traits_category2 || []), ...(c.traits_category3 || [])]
        return selectedTraitFilters.some((t) => allTraits.includes(t))
      })
    }

    return filtered
  }, [howItFeelsContributions, howItFeelsRelationshipFilter, selectedTraitFilters])

  const filteredImportedFeedback = useMemo(() => {
    if (selectedTraitFilters.length === 0) return importedFeedback
    return importedFeedback.filter((f) => {
      return selectedTraitFilters.some((t) => f.traits?.includes(t))
    })
  }, [importedFeedback, selectedTraitFilters])

  const handleTraitFilterSelect = (trait: string) => {
    setSelectedTraitFilters((prev) => {
      if (prev.includes(trait)) {
        return prev.filter((t) => t !== trait)
      }
      if (prev.length >= 2) return prev // Block 3rd selection
      return [...prev, trait]
    })
  }

  const handleVibeSelect = (vibe: string) => {
    setSelectedVibeFilters((prev) => {
      if (prev.includes(vibe)) {
        return prev.filter((v) => v !== vibe)
      }
      return [...prev, vibe]
    })
  }

  const handleClearFilters = () => {
    setSelectedTraitFilters([])
  }

  // Clear vibe filters
  const handleClearVibes = () => {
    setSelectedVibeFilters([])
  }

  const vibeFilteredHowItFeels = useMemo(() => {
    if (selectedVibeFilters.length === 0) return filteredHowItFeels

    return filteredHowItFeels.filter((c) => {
      const allTraits = [
        ...(c.traits_category1 || []),
        ...(c.traits_category2 || []),
        ...(c.traits_category3 || []),
        ...(c.traits_category4 || []),
      ]
      const textLower = (c.written_note || "").toLowerCase()

      return selectedVibeFilters.some((vibe) => {
        if (allTraits.some((t) => t.toLowerCase() === vibe.toLowerCase())) return true
        return textLower.includes(vibe.toLowerCase())
      })
    })
  }, [filteredHowItFeels, selectedVibeFilters])

  const vibeFilteredImported = useMemo(() => {
    if (selectedVibeFilters.length === 0) return filteredImportedFeedback

    return filteredImportedFeedback.filter((f) => {
      const textLower = (f.ai_extracted_excerpt || "").toLowerCase()
      return selectedVibeFilters.some((vibe) => {
        if (f.traits?.some((t) => t.toLowerCase() === vibe.toLowerCase())) return true
        return textLower.includes(vibe.toLowerCase())
      })
    })
  }, [filteredImportedFeedback, selectedVibeFilters])

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

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

  const confidenceLevel = profileAnalysis.confidenceLevel
  const firstName = profile.full_name?.split(" ")[0] || "this person"

  // Combine filtered 'how it feels' and 'imported' for snapshot filtering
  const combinedFeedback = useMemo(() => {
    const nomeeFeedback = vibeFilteredHowItFeels.map((c) => ({
      id: c.id,
      excerpt: c.written_note || "",
      traits: [...(c.traits_category1 || []), ...(c.traits_category2 || []), ...(c.traits_category3 || [])],
      type: "nomee" as const,
    }))

    const importedFeedbackMapped = vibeFilteredImported.map((f) => ({
      id: f.id,
      excerpt: f.ai_extracted_excerpt || "",
      traits: f.traits || [],
      type: "imported" as const,
    }))

    return [...nomeeFeedback, ...importedFeedbackMapped]
  }, [vibeFilteredHowItFeels, vibeFilteredImported])

  // In the "How it feels" section, use filtered cards
  // Around line 650 where filteredRecognitions is used, add snapshot filtering
  const displayCards = snapshotFilter ? getFilteredCards(combinedFeedback) : combinedFeedback

  return (
    <div className="min-h-screen bg-warm-sand">
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

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div
          className={`mb-8 sm:mb-10 md:mb-12 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-900 mb-2 tracking-tight leading-[1.1]">
            {profile.full_name}
          </h1>

          {profile.headline && (
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-3 leading-relaxed">{profile.headline}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 py-3">
            <p className="text-sm text-neutral-500 uppercase tracking-wide font-medium">Nomee Profile</p>
            <span className="text-neutral-300">·</span>
            <p className="text-sm text-neutral-700 font-medium">
              {profileAnalysis.counts.contributions} {profileAnalysis.counts.contributions === 1 ? "person" : "people"}
            </p>
            {profileAnalysis.counts.voiceNotes > 0 && (
              <>
                <span className="text-neutral-300">·</span>
                <p className="text-sm text-neutral-700 font-medium">
                  {profileAnalysis.counts.voiceNotes} voice {profileAnalysis.counts.voiceNotes === 1 ? "note" : "notes"}
                </p>
              </>
            )}
            {profileAnalysis.counts.uploads > 0 && (
              <>
                <span className="text-neutral-300">·</span>
                <p className="text-sm text-neutral-700 font-medium">
                  {profileAnalysis.counts.uploads} {profileAnalysis.counts.uploads === 1 ? "screenshot" : "screenshots"}
                </p>
              </>
            )}
            <span className="text-neutral-300">·</span>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${confidenceLevel.bgColor} ${confidenceLevel.borderColor}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${confidenceLevel.color.replace("text-", "bg-")}`}></div>
              <span className={`text-xs font-semibold ${confidenceLevel.color}`}>{confidenceLevel.label}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 mt-1">Each contributor can submit once.</p>

          {/* Mobile share buttons */}
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
      </section>

      {/* The section that was here (lines ~370-383) has been removed */}

      {pinnedItems.length > 0 && (
        <section className="w-full bg-amber-50/30 border-b border-amber-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PinnedHighlightsDisplay pinnedItems={pinnedItems} onUnpin={unpin} isOwner={isOwner} />
          </div>
        </section>
      )}

      {/* Hero section with Summary + Vibe side-by-side */}
      <section className="w-full bg-white border-y border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left: AI Summary (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="border-l-4 border-blue-500 pl-6 sm:pl-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-900 leading-tight">
                    Summary of working with {firstName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    <span className="uppercase tracking-wide font-medium text-neutral-400">Updated automatically</span>
                    <div className="flex flex-wrap items-center gap-2 text-neutral-600">
                      <span>
                        {profileAnalysis.counts.contributions}{" "}
                        {profileAnalysis.counts.contributions === 1 ? "contribution" : "contributions"}
                      </span>
                      {profileAnalysis.counts.voiceNotes > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {profileAnalysis.counts.voiceNotes} voice{" "}
                            {profileAnalysis.counts.voiceNotes === 1 ? "note" : "notes"}
                          </span>
                        </>
                      )}
                      {profileAnalysis.counts.uploads > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {profileAnalysis.counts.uploads}{" "}
                            {profileAnalysis.counts.uploads === 1 ? "upload" : "uploads"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <AiPatternSummary
                  analysisText={profileAnalysis.analysisText}
                  traitSignals={profileAnalysis.traitSignals}
                  vibeSignals={profileAnalysis.vibeSignals}
                  firstName={firstName}
                  contributionsCount={profileAnalysis.counts.contributions}
                  uploadsCount={profileAnalysis.counts.uploads}
                />

                <p className="text-xs text-neutral-500 pt-4 border-t border-neutral-100">
                  Generated from {profileAnalysis.counts.contributions}{" "}
                  {profileAnalysis.counts.contributions === 1 ? "contribution" : "contributions"}
                  {profileAnalysis.counts.uploads > 0 &&
                    ` and ${profileAnalysis.counts.uploads} ${profileAnalysis.counts.uploads === 1 ? "upload" : "uploads"}`}
                  {" • "}Updates as more people contribute
                </p>
              </div>
            </div>

            {/* Right: Vibe Card (1/3 width) - ALWAYS VISIBLE */}
            <div className="lg:col-span-1">
              <div className="h-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">{firstName}'s vibe</h3>
                {(() => {
                  if (profileAnalysis.counts.contributions < 2 || profileAnalysis.vibeSignals.length === 0) {
                    return (
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        Vibe appears once 2+ people contribute.
                      </p>
                    )
                  }

                  const totalVibeMentions = profileAnalysis.vibeSignals.reduce((sum, v) => sum + v.count, 0)

                  return (
                    <div className="space-y-3">
                      {profileAnalysis.vibeSignals.slice(0, 6).map((vibe, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-white border border-purple-100 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                        >
                          <span className="text-sm font-semibold text-purple-900">{vibe.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-purple-700">{vibe.count}</span>
                            <span className="text-xs text-purple-500">
                              ({Math.round((vibe.count / totalVibeMentions) * 100)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {(profileAnalysis.traitSignals.length > 0 || profileAnalysis.vibeSignals.length > 0) && (
        <section className="w-full bg-neutral-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProofSnapshot
              traitSignals={profileAnalysis.traitSignals}
              vibeSignals={profileAnalysis.vibeSignals}
              analysisText={profileAnalysis.analysisText}
              firstName={firstName}
              onFilterChange={setSnapshotFilter}
            />

            {snapshotFilter && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="text-sm text-neutral-600">
                  Showing {getFilteredCards(combinedFeedback).length} matches for "{snapshotFilter.value}"
                </span>
                <button
                  onClick={() => setSnapshotFilter(null)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Voice Notes Section */}
      {voiceContributions.length > 0 && (
        <section className="w-full bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="space-y-6">
              <div className="space-y-3 max-w-2xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">In Their Own Words</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Unedited voice notes from people who know {firstName}
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
                  {filteredVoiceContributions.slice(0, 3).map((contribution) => {
                    console.log("[VOICE] Profile: Rendering voice card", {
                      contributionId: contribution.id,
                      hasVoiceUrl: !!contribution.voice_url,
                      voiceUrl: contribution.voice_url,
                    })
                    return (
                      <VoiceCard key={contribution.id} contribution={contribution} profileName={profile.full_name} />
                    )
                  })}
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
            </div>
          </div>
        </section>
      )}

      {/* Pattern Recognition Section - Enhanced with trust-blue transparency WOW factor */}
      {profileAnalysis.traitSignals.length > 0 && (
        <section className="w-full bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="space-y-6">
              <div className="space-y-3 max-w-3xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">Pattern Recognition</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Not hand-picked — patterns emerge as more people contribute.
                </p>

                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${confidenceLevel.bgColor} ${confidenceLevel.borderColor} mt-3`}
                >
                  <div className={`w-2 h-2 rounded-full ${confidenceLevel.color.replace("text-", "bg-")}`}></div>
                  <span className={`text-xs font-semibold ${confidenceLevel.color}`}>{confidenceLevel.label}</span>
                </div>

                <p className="text-xs text-neutral-500 pt-2 max-w-md mx-auto leading-relaxed">
                  {confidenceLevel.description}
                </p>

                {profileAnalysis.counts.contributions >= 3 && (
                  <p className="text-xs text-neutral-400 pt-1">Darker = mentioned more often</p>
                )}
              </div>

              {profileAnalysis.counts.contributions < 3 ? (
                <div className="max-w-2xl mx-auto">
                  <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white">
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
                      Top signals
                    </h4>
                    <div className="space-y-2">
                      {profileAnalysis.traitSignals.slice(0, 5).map((trait) => {
                        const maxCount = Math.max(...profileAnalysis.traitSignals.map((t) => t.count))
                        const bgOpacity = 0.4 + (trait.count / maxCount) * 0.3

                        return (
                          <div
                            key={trait.label}
                            className="flex items-center justify-between px-4 py-3 rounded-lg border border-blue-100 transition-all hover:border-blue-200 hover:shadow-sm"
                            style={{ backgroundColor: `rgba(219, 234, 254, ${bgOpacity})` }}
                          >
                            <span className="font-semibold text-sm sm:text-base text-neutral-900">{trait.label}</span>
                            <span className="text-xs font-semibold text-neutral-700">×{trait.count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
                  <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white">
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
                      Top signals
                    </h4>
                    <div className="space-y-2">
                      {profileAnalysis.traitSignals.slice(0, 5).map((trait) => {
                        const isSelected = selectedHeatmapTrait === trait.label
                        const maxCount = Math.max(...profileAnalysis.traitSignals.map((t) => t.count))
                        const bgOpacity = 0.4 + (trait.count / maxCount) * 0.3

                        return (
                          <button
                            key={trait.label}
                            onClick={() =>
                              setSelectedHeatmapTrait(selectedHeatmapTrait === trait.label ? null : trait.label)
                            }
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                              isSelected
                                ? "border-blue-400 shadow-md scale-[1.02] bg-blue-100"
                                : "border-blue-100 hover:border-blue-200 hover:shadow-sm hover:scale-[1.01]"
                            }`}
                            style={{
                              backgroundColor: isSelected ? undefined : `rgba(219, 234, 254, ${bgOpacity})`,
                            }}
                          >
                            <span className="font-semibold text-sm sm:text-base text-neutral-900">{trait.label}</span>
                            <span className="text-xs font-semibold text-neutral-700">×{trait.count}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white">
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
                      Emerging signals
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileAnalysis.traitSignals.slice(5, 15).map((trait) => {
                        const isSelected = selectedHeatmapTrait === trait.label
                        const maxCount = Math.max(...profileAnalysis.traitSignals.slice(5, 15).map((t) => t.count))
                        const bgOpacity = 0.3 + (trait.count / maxCount) * 0.25

                        return (
                          <button
                            key={trait.label}
                            onClick={() =>
                              setSelectedHeatmapTrait(selectedHeatmapTrait === trait.label ? null : trait.label)
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              isSelected
                                ? "border-blue-400 shadow-md scale-105 bg-blue-100"
                                : "border-blue-100/70 hover:border-blue-200 hover:shadow-sm hover:scale-105"
                            }`}
                            style={{
                              backgroundColor: isSelected ? undefined : `rgba(239, 246, 255, ${bgOpacity})`,
                            }}
                          >
                            <span className="text-neutral-800">{trait.label}</span>
                            <span className="text-xs font-semibold text-neutral-600">×{trait.count}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* How it feels Section */}
      {(howItFeelsContributions.length > 0 || importedFeedback.length > 0) && (
        <section className="w-full bg-neutral-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="space-y-8">
              <div className="space-y-3 max-w-2xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-900">How it feels</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Day-to-day collaboration style and working patterns
                </p>
                <div className="w-16 h-0.5 bg-neutral-200 mx-auto mt-4"></div>
              </div>

              <SmartVibePills
                vibeSignals={profileAnalysis.vibeSignals}
                traitSignals={profileAnalysis.traitSignals}
                allCards={allCards}
                selectedVibes={selectedVibeFilters}
                onVibeSelect={handleVibeSelect}
                onClearVibes={handleClearVibes}
              />

              {/* Existing trait bar - kept exactly as-is */}
              <PremierTraitBar
                allCards={allCards}
                selectedTraits={selectedTraitFilters}
                onTraitSelect={handleTraitFilterSelect}
                onClearFilters={handleClearFilters}
                sourceFilter={sourceFilter}
                totalPeople={profileAnalysis.counts.contributions}
                totalUploads={profileAnalysis.counts.uploads}
              />

              {/* Existing source filter toggles - KEPT EXACTLY AS-IS */}
              <div className="flex justify-center gap-2">
                {(["all", "nomee", "imported"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSourceFilter(filter)}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-full border transition-all
                      ${
                        sourceFilter === filter
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                      }
                    `}
                  >
                    {filter === "all" && `All (${allCards.length})`}
                    {filter === "nomee" && `Direct (${howItFeelsContributions.length})`}
                    {filter === "imported" && `Imported (${importedFeedback.length})`}
                  </button>
                ))}
              </div>

              {/* Cards Grid - Direct submissions */}
              {(sourceFilter === "all" || sourceFilter === "nomee") &&
                displayCards.filter((card) => card.type === "nomee").length > 0 && (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {displayCards
                      .filter((card) => card.type === "nomee")
                      .map((contribution) => {
                        const allTraits = [
                          ...(contribution.traits_category1 || []),
                          ...(contribution.traits_category2 || []),
                          ...(contribution.traits_category3 || []),
                        ]
                        const keywords = extractKeywordsFromText(contribution.excerpt || "", allTraits)
                        const highlightedText = highlightQuote(
                          contribution.excerpt || "",
                          keywords,
                          8,
                          true,
                          true,
                          selectedVibeFilters,
                          topSignals,
                        )

                        return (
                          <div
                            key={contribution.id}
                            className="break-inside-avoid rounded-xl p-6 bg-gradient-to-br from-sky-50/50 to-white border border-sky-100 hover:border-sky-200 hover:shadow-sm transition-all relative group"
                          >
                            {isOwner && (
                              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <PinButton
                                  id={contribution.id}
                                  isPinned={isPinned(contribution.id)}
                                  onPin={() =>
                                    pinQuote(
                                      contribution.id,
                                      contribution.excerpt || "",
                                      contribution.contributor_name || "Anonymous",
                                    )
                                  }
                                  onUnpin={() => unpin(contribution.id)}
                                />
                              </div>
                            )}

                            <div className="absolute top-3 left-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-100 text-sky-700 border border-sky-200">
                                <MessageSquare className="w-2.5 h-2.5" />
                                Direct
                              </span>
                            </div>

                            <div className="pt-6">
                              <p className="text-sm leading-relaxed text-neutral-700 mb-4">{highlightedText}</p>

                              {allTraits.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {allTraits.slice(0, 5).map((trait, idx) => {
                                    const traitCount =
                                      profileAnalysis.traitSignals.find(
                                        (s) => s.label.toLowerCase() === trait.toLowerCase(),
                                      )?.count || 1
                                    return (
                                      <TooltipProvider key={idx} delayDuration={200}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span
                                              className={`
                                                px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer
                                                shadow-sm hover:shadow
                                                ${
                                                  selectedTraitFilters.includes(trait)
                                                    ? "bg-blue-100 text-blue-800 border-blue-300 shadow-blue-100"
                                                    : "bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-200 hover:bg-blue-100"
                                                }
                                              `}
                                              onClick={() => handleTraitFilterSelect(trait)}
                                            >
                                              {trait}
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent side="top" className="max-w-xs p-2">
                                            <p className="text-xs">
                                              Appears in {traitCount} contribution{traitCount !== 1 ? "s" : ""}
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )
                                  })}
                                </div>
                              )}

                              <div className="border-t border-neutral-100 pt-3">
                                <div className="text-sm font-semibold text-neutral-900">
                                  {contribution.contributor_name || "Anonymous"}
                                </div>
                                {contribution.relationship && contribution.relationship !== "0" && (
                                  <div className="text-xs text-neutral-600 capitalize mt-0.5">
                                    {contribution.relationship.replace(/_/g, " ")}
                                  </div>
                                )}
                                {contribution.contributor_company &&
                                contribution.contributor_company !== "0" &&
                                contribution.contributor_company.trim() !== "" ? (
                                  <div className="text-xs text-neutral-500 mt-0.5">
                                    {contribution.contributor_company}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}

              {/* Imported Feedback Grid */}
              {(sourceFilter === "all" || sourceFilter === "imported") &&
                displayCards.filter((card) => card.type === "imported").length > 0 && (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {displayCards
                      .filter((card) => card.type === "imported")
                      .map((feedback) => {
                        const keywords = extractKeywordsFromText(feedback.excerpt || "", feedback.traits || [])
                        const highlightedText = highlightQuote(
                          feedback.excerpt || "",
                          keywords,
                          8,
                          true,
                          true,
                          selectedVibeFilters,
                          topSignals,
                        )

                        return (
                          <div
                            key={feedback.id}
                            className="break-inside-avoid rounded-xl p-6 bg-gradient-to-br from-amber-50/50 to-white border border-amber-100 hover:border-amber-200 hover:shadow-sm transition-all relative group"
                          >
                            {isOwner && (
                              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <PinButton
                                  id={feedback.id}
                                  isPinned={isPinned(feedback.id)}
                                  onPin={() =>
                                    pinQuote(feedback.id, feedback.excerpt || "", feedback.giver_name || "Unknown")
                                  }
                                  onUnpin={() => unpin(feedback.id)}
                                />
                              </div>
                            )}

                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                <Upload className="w-2.5 h-2.5" />
                                Imported
                              </span>
                              {feedback.source_type && feedback.source_type !== "0" && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                    feedback.source_type === "LinkedIn"
                                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                                      : feedback.source_type === "Email"
                                        ? "bg-neutral-800 text-white border border-neutral-800"
                                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                                  }`}
                                >
                                  {feedback.source_type}
                                </span>
                              )}
                            </div>

                            <div className="pt-8">
                              <p className="text-sm leading-relaxed text-neutral-700 mb-4">{highlightedText}</p>

                              {feedback.traits && feedback.traits.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {feedback.traits.slice(0, 4).map((trait, idx) => {
                                    const traitCount =
                                      profileAnalysis.traitSignals.find(
                                        (s) => s.label.toLowerCase() === trait.toLowerCase(),
                                      )?.count || 1
                                    return (
                                      <TooltipProvider key={idx} delayDuration={200}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span
                                              className={`
                                                px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer
                                                shadow-sm hover:shadow
                                                ${
                                                  selectedTraitFilters.includes(trait)
                                                    ? "bg-amber-100 text-amber-800 border-amber-300 shadow-amber-100"
                                                    : "bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-200 hover:bg-amber-100"
                                                }
                                              `}
                                              onClick={() => handleTraitFilterSelect(trait)}
                                            >
                                              {trait}
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent side="top" className="max-w-xs p-2">
                                            <p className="text-xs">
                                              Appears in {traitCount} contribution{traitCount !== 1 ? "s" : ""}
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )
                                  })}
                                </div>
                              )}

                              <div className="border-t border-neutral-100 pt-3">
                                {feedback.giver_name && feedback.giver_name !== "0" && (
                                  <div className="text-sm font-semibold text-neutral-900">{feedback.giver_name}</div>
                                )}
                                {feedback.giver_title &&
                                  feedback.giver_title !== "0" &&
                                  feedback.giver_title.trim() !== "" && (
                                    <div className="text-xs text-neutral-600 mt-0.5">{feedback.giver_title}</div>
                                  )}
                                {feedback.giver_company &&
                                feedback.giver_company !== "0" &&
                                feedback.giver_company.trim() !== "" ? (
                                  <div className="text-xs text-neutral-500 mt-0.5">{feedback.giver_company}</div>
                                ) : null}
                                {feedback.extraction_confidence && feedback.extraction_confidence > 0 && (
                                  <div className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1.5">
                                    <TooltipProvider delayDuration={200}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="inline-flex items-center gap-1 cursor-help">
                                            <span className="inline-block w-1 h-1 bg-amber-400 rounded-full"></span>
                                            Extraction confidence: {Math.round(feedback.extraction_confidence * 100)}%
                                            <Info className="w-3 h-3 text-neutral-400" />
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs p-2">
                                          <p className="text-xs">
                                            How confident we are that the screenshot text was read correctly (OCR +
                                            parsing).
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}

              {/* Empty state */}
              {displayCards.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-neutral-600">No perspectives match the selected filters.</p>
                  <button
                    onClick={() => {
                      handleClearFilters()
                      handleClearVibes()
                      setSnapshotFilter(null)
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Screenshots & Highlights - Always render when data exists */}
      {importedFeedback.length > 0 && (
        <section className="w-full bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="space-y-6">
              <div className="space-y-2 max-w-2xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-900">Past Praise</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {profile.full_name?.split(" ")[0]} saved {importedFeedback.length} piece
                  {importedFeedback.length === 1 ? "" : "s"} of feedback
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {importedFeedback.map((feedback) => {
                  const feedbackTraits = feedback.traits || []
                  const keywords = extractKeywordsFromText(feedback.ai_extracted_excerpt || "", feedbackTraits)
                  const highlightedText = highlightQuote(feedback.ai_extracted_excerpt || "", keywords, 4)

                  return (
                    <div
                      key={feedback.id}
                      className="rounded-xl p-6 bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all relative"
                    >
                      <p className="text-sm leading-relaxed text-neutral-700 mb-4">{highlightedText}</p>

                      {feedbackTraits.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {feedbackTraits.slice(0, 4).map((trait, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-neutral-100 pt-3">
                        <div className="text-sm font-semibold text-neutral-900">{feedback.giver_name}</div>
                        {feedback.giver_title && (
                          <div className="text-xs text-neutral-600 mt-0.5">{feedback.giver_title}</div>
                        )}
                        {feedback.giver_company ? (
                          <div className="text-xs text-neutral-500 mt-0.5">{feedback.giver_company}</div>
                        ) : (
                          <div className="text-xs text-neutral-400 italic mt-0.5">Company not provided</div>
                        )}
                      </div>

                      {feedback.source_type && (
                        <div className="absolute bottom-4 right-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                              feedback.source_type === "Email"
                                ? "bg-neutral-900 text-white border-neutral-900"
                                : feedback.source_type === "LinkedIn"
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : feedback.source_type === "DM"
                                    ? "bg-black text-white border-black"
                                    : "bg-neutral-100 text-neutral-700 border-neutral-200"
                            }`}
                          >
                            {feedback.source_type}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PremierSignalBar moved to bottom */}
      {profileAnalysis.counts.contributions + profileAnalysis.counts.uploads >= 3 && (
        <section className="w-full bg-neutral-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PremierSignalBar
              allCards={allCards}
              traitSignals={profileAnalysis.traitSignals}
              totalContributions={profileAnalysis.counts.contributions + profileAnalysis.counts.uploads}
            />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-900">Build your own Nomee profile</h3>
          <p className="text-neutral-600 max-w-md mx-auto">
            Get feedback from people you've worked with. Create a profile that shows how you collaborate, solve
            problems, and make an impact.
          </p>
          <Button asChild className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-full">
            <a href="/signup">Get started for free</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
