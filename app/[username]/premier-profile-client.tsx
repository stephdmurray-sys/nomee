"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { VoiceCard } from "@/components/voice-card"
import { AiPatternSummary } from "@/components/ai-pattern-summary"
import { RelationshipFilter } from "@/components/relationship-filter"
import { FloatingQuoteCards } from "@/components/floating-quote-cards" // Assuming FloatingQuoteCards is imported
import type { RelationshipFilterCategory } from "@/lib/relationship-filter"
import { categorizeTestimonials } from "@/lib/categorize-testimonials"
import { extractRepeatedPhrases } from "@/lib/extract-repeated-phrases"
import { dedupeContributions } from "@/lib/dedupe-contributions"
import { extractHighlightPatterns } from "@/lib/extract-highlight-patterns"
import Link from "next/link"
import type { Profile, Contribution, ImportedFeedback } from "@/lib/types"
import { TRAIT_CATEGORIES } from "@/lib/trait-categories" // Assuming TRAIT_CATEGORIES is imported
import { filterByRelationship } from "@/lib/filter-by-relationship" // Declare the variable before using it

interface PremierProfileClientProps {
  profile: Profile
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  traits: any // Assuming 'traits' is a new prop, adjust type as needed
  totalContributions: number // Assuming 'totalContributions' is a new prop
  uniqueCompanies: string[] // Assuming 'uniqueCompanies' is a new prop
  interpretationSentence: string // Assuming 'interpretationSentence' is a new prop
  vibeLabels: string[] // Assuming 'vibeLabels' is a new prop
  anchorQuote: string // Assuming 'anchorQuote' is a new prop
}

// Helper function to determine if a trait label is a vibe
const isVibeTrait = (label: string): boolean => {
  return (
    ["positive", "negative", "neutral"].includes(label.toLowerCase()) ||
    ["energetic", "calm", "focused", "creative", "supportive", "ambitious"].includes(label.toLowerCase()) ||
    ["enthusiastic", "passionate", "driven", "innovative", "collaborative", "reliable"].includes(label.toLowerCase())
  )
}

export function PremierProfileClient({
  profile,
  contributions: rawContributions,
  importedFeedback: rawImportedFeedback,
  traits, // Destructure new props
  totalContributions, // Destructure new props
  uniqueCompanies, // Destructure new props
  interpretationSentence, // Destructure new props
  vibeLabels, // Destructure new props
  anchorQuote, // Destructure new props
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
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
  const [snapshotVibeFilter, setSnapshotVibeFilter] = useState<string | null>(null)
  const [snapshotTraitFilter, setSnapshotTraitFilter] = useState<string | null>(null)
  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipFilterCategory | null>(null) // New state for relationship filter in VibeHighlightBar

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

  const handleClearVibeFilter = () => {
    setSelectedVibe(null)
  }

  const handleSnapshotVibeClick = (vibe: string) => {
    setSnapshotVibeFilter((prev) => (prev === vibe ? null : vibe))
    setSnapshotTraitFilter(null) // Clear trait filter when vibe is selected
    setSelectedVibe(null) // Clear old vibe filter
  }

  const handleSnapshotTraitClick = (trait: string) => {
    setSnapshotTraitFilter((prev) => (prev === trait ? null : trait))
    setSnapshotVibeFilter(null) // Clear vibe filter when trait is selected
    setSelectedHeatmapTrait(null) // Clear heatmap trait filter
  }

  const handleClearAllFilters = () => {
    setSnapshotVibeFilter(null)
    setSnapshotTraitFilter(null)
    setSelectedVibe(null)
    setSelectedHeatmapTrait(null)
    setSelectedRelationship(null) // Clear the new relationship filter state
  }

  const traitSignals = useMemo(() => {
    const traitCounts: Record<string, number> = {}

    rawContributions.forEach((contribution) => {
      // Collect trait IDs from category1, category2, category3 (NOT category4 which is vibes)
      const traitIds = [
        ...(contribution.traits_category1 || []),
        ...(contribution.traits_category2 || []),
        ...(contribution.traits_category3 || []),
      ]

      traitIds.forEach((traitId: string) => {
        // Find the trait label from TRAIT_CATEGORIES
        for (const [categoryKey, category] of Object.entries(TRAIT_CATEGORIES)) {
          // Skip the vibe category
          if (categoryKey === "the_vibe") continue

          const trait = category.traits.find((t) => t.id === traitId)
          if (trait) {
            traitCounts[trait.label] = (traitCounts[trait.label] || 0) + 1
            break
          }
        }
      })
    })

    // Return sorted array of traits with counts
    return Object.entries(traitCounts)
      .filter(([label]) => label && label.trim().length > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([label, count]) => ({ label, count }))
  }, [rawContributions])

  console.log("[v0] traitSignals computed, length:", traitSignals.length)
  console.log("[v0] traitSignals data:", traitSignals)

  const traitsWithExamples = traitSignals.map((trait) => ({
    label: trait.label,
    count: trait.count,
    category: "leadership" as const,
    examples: [],
  }))

  const { howItFeels } = categorizeTestimonials(rawContributions)
  const repeatedPhrases = extractRepeatedPhrases(rawContributions)
  const topTraits = traitSignals.slice(0, 5).map((t) => t.label)

  const highlightPatterns = extractHighlightPatterns(rawContributions, importedFeedback, rawContributions)

  const getFrequencyLevel = (count: number): number => {
    if (traitsWithExamples.length === 0) return 1
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

  const filteredContributionsByVibe = useMemo(() => {
    if (!selectedVibe) return filteredHowItFeels

    return filteredHowItFeels.filter((contribution) => {
      if (!contribution.traits_json) return false // Fallback if traits_json still exists

      let traitsData: any = {}
      try {
        traitsData =
          typeof contribution.traits_json === "string" ? JSON.parse(contribution.traits_json) : contribution.traits_json
      } catch (e) {
        return false
      }

      const vibeTraits = [...(traitsData.the_vibe || []), ...(traitsData.how_it_felt || [])]

      return vibeTraits.some((traitId: string) => {
        const vibeTrait = TRAIT_CATEGORIES.the_vibe?.traits.find((t) => t.id === traitId)
        return vibeTrait?.label === selectedVibe
      })
    })
  }, [filteredHowItFeels, selectedVibe])

  const knownForTraits = useMemo(() => {
    const traitCounts: Record<string, number> = {}

    rawContributions.forEach((contribution) => {
      // Collect all traits from the category columns
      const allTraitIds = [
        ...(contribution.traits_category1 || []),
        ...(contribution.traits_category2 || []),
        ...(contribution.traits_category3 || []),
        // ...(contribution.traits_category4 || []),
      ]

      allTraitIds.forEach((traitId: string) => {
        // Find trait label, excluding vibes
        let traitLabel: string | undefined
        let isVibe = false

        Object.entries(TRAIT_CATEGORIES).forEach(([categoryKey, category]) => {
          if (categoryKey === "the_vibe") return

          const trait = category.traits.find((t) => t.id === traitId)
          if (trait) {
            traitLabel = trait.label
            if (categoryKey === "the_vibe" || isVibeTrait(trait.label)) {
              isVibe = true
            }
          }
        })

        if (traitLabel && !isVibe) {
          traitCounts[traitLabel] = (traitCounts[traitLabel] || 0) + 1
        }
      })
    })

    return Object.entries(traitCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([label, count]) => ({ label, count }))
  }, [rawContributions])

  const filteredBySnapshotFilters = useMemo(() => {
    let filtered = filteredHowItFeels

    // Apply vibe filter
    if (snapshotVibeFilter) {
      filtered = filtered.filter((contribution) => {
        // Collect all traits from the category columns
        const allTraitIds = [
          ...(contribution.traits_category1 || []),
          ...(contribution.traits_category2 || []),
          ...(contribution.traits_category3 || []),
          // ...(contribution.traits_category4 || []),
        ]

        return allTraitIds.some((traitId: string) => {
          const trait = Object.values(TRAIT_CATEGORIES)
            .flatMap((cat) => cat.traits)
            .find((t) => t.id === traitId)
          return trait && isVibeTrait(trait.label) && trait.label === snapshotVibeFilter
        })
      })
    }

    // Apply trait filter
    if (snapshotTraitFilter) {
      filtered = filtered.filter((contribution) => {
        // Collect all traits from the category columns
        const allTraitIds = [
          ...(contribution.traits_category1 || []),
          ...(contribution.traits_category2 || []),
          ...(contribution.traits_category3 || []),
          // ...(contribution.traits_category4 || []),
        ]

        return allTraitIds.some((traitId: string) => {
          let traitLabel: string | undefined
          let isVibe = false
          Object.entries(TRAIT_CATEGORIES).forEach(([categoryKey, category]) => {
            if (categoryKey === "the_vibe") return

            const trait = category.traits.find((t) => t.id === traitId)
            if (trait) {
              traitLabel = trait.label
              if (categoryKey === "the_vibe" || isVibeTrait(trait.label)) {
                isVibe = true
              }
            }
          })
          return traitLabel === snapshotTraitFilter && !isVibe
        })
      })
    }

    return filtered
  }, [filteredHowItFeels, snapshotVibeFilter, snapshotTraitFilter])

  const finalFilteredContributions = useMemo(() => {
    if (selectedVibe) {
      return filteredContributionsByVibe
    }
    return filteredBySnapshotFilters
  }, [selectedVibe, filteredContributionsByVibe, filteredBySnapshotFilters])

  const getConfidenceLevel = (count: number) => {
    if (count <= 2)
      return {
        label: "Early signal",
        description: "This updates as more people contribute. Invite 2 more to strengthen patterns.",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      }
    if (count <= 4)
      return {
        label: "Directional",
        description: "Patterns are starting to stabilize as more people contribute.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      }
    return {
      label: "High confidence",
      description: "Patterns are consistent across contributors.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    }
  }

  const confidenceLevel = getConfidenceLevel(totalContributions)

  const hasActiveFilters =
    snapshotVibeFilter || snapshotTraitFilter || selectedVibe || selectedHeatmapTrait || selectedRelationship

  return (
    <div className="min-h-screen bg-neutral-50">
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-12 md:pb-16">
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

          <div
            className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full border ${confidenceLevel.bgColor} ${confidenceLevel.borderColor}`}
          >
            <div className={`w-2 h-2 rounded-full ${confidenceLevel.color.replace("text-", "bg-")}`}></div>
            <span className={`text-xs font-semibold ${confidenceLevel.color}`}>{confidenceLevel.label}</span>
          </div>

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
      </section>

      {totalContributions >= 3 && (
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="mb-6 sm:mb-7 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">
                  Summary of working with {profile.full_name?.split(" ")[0] || "this person"}
                </h3>

                <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-500">
                  <span className="uppercase tracking-wide font-medium text-neutral-400">Updated automatically</span>
                  {(totalContributions > 0 || voiceNotesCount > 0 || totalUploads > 0) && (
                    <div className="flex items-center gap-2 text-neutral-600">
                      {totalContributions > 0 && (
                        <span>
                          {totalContributions} {totalContributions === 1 ? "contribution" : "contributions"}
                        </span>
                      )}
                      {voiceNotesCount > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {voiceNotesCount} voice {voiceNotesCount === 1 ? "note" : "notes"}
                          </span>
                        </>
                      )}
                      {totalUploads > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {totalUploads} {totalUploads === 1 ? "upload" : "uploads"}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <AiPatternSummary
                contributions={contributions}
                importedFeedback={rawImportedFeedback}
                topTraits={traitSignals.slice(0, 5)}
                firstName={profile.full_name?.split(" ")[0] || "this person"}
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

      {traitSignals.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 bg-white">
          <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4 md:pt-6">
            <div className="space-y-2 max-w-3xl mx-auto text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">Pattern Recognition</h3>
              <p className="text-sm text-neutral-500">Not hand-picked — patterns emerge as more people contribute.</p>

              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${confidenceLevel.bgColor} ${confidenceLevel.borderColor} mt-3`}
              >
                <div className={`w-2 h-2 rounded-full ${confidenceLevel.color.replace("text-", "bg-")}`}></div>
                <span className={`text-xs font-semibold ${confidenceLevel.color}`}>{confidenceLevel.label}</span>
              </div>

              <p className="text-xs text-neutral-500 pt-2 max-w-md mx-auto">{confidenceLevel.description}</p>

              {totalContributions >= 3 && (
                <p className="text-xs text-neutral-400 pt-1">Darker = mentioned more often</p>
              )}
            </div>

            {totalContributions < 3 ? (
              <div className="max-w-2xl mx-auto">
                <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white">
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
                    Top signals
                  </h4>
                  <div className="space-y-2">
                    {traitSignals.slice(0, 5).map((trait) => (
                      <div
                        key={trait.label}
                        className="flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50"
                      >
                        <span className="font-semibold text-sm sm:text-base text-neutral-900">{trait.label}</span>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-neutral-200 text-neutral-700">
                          ×{trait.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
                {/* Left panel: Top signals */}
                <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white">
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
                    Top signals
                  </h4>
                  <div className="space-y-2">
                    {traitSignals.slice(0, 5).map((trait) => {
                      const isSelected = selectedHeatmapTrait === trait.label
                      const maxCount = Math.max(...traitSignals.map((t) => t.count))
                      const opacity = 0.3 + (trait.count / maxCount) * 0.7

                      return (
                        <button
                          key={trait.label}
                          onClick={() => {
                            if (selectedHeatmapTrait === trait.label) {
                              setSelectedHeatmapTrait(null)
                            } else {
                              setSelectedHeatmapTrait(trait.label)
                            }
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-white"
                          }`}
                          style={{ opacity: isSelected ? 1 : opacity }}
                        >
                          <span
                            className={`font-semibold text-sm sm:text-base ${isSelected ? "text-blue-900" : "text-neutral-900"}`}
                          >
                            {trait.label}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              isSelected ? "bg-blue-200 text-blue-800" : "bg-neutral-200 text-neutral-700"
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
                <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white">
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-4">
                    Emerging signals
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {traitSignals.slice(5, 15).map((trait) => {
                      const isSelected = selectedHeatmapTrait === trait.label

                      return (
                        <button
                          key={trait.label}
                          onClick={() => {
                            if (selectedHeatmapTrait === trait.label) {
                              setSelectedHeatmapTrait(null)
                            } else {
                              setSelectedHeatmapTrait(trait.label)
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-white"
                          }`}
                        >
                          {trait.label}
                          <span
                            className={`text-xs font-semibold ${isSelected ? "text-blue-700" : "text-neutral-500"}`}
                          >
                            ×{trait.count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
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

            <FloatingQuoteCards
              contributions={finalFilteredContributions}
              highlightPatterns={highlightPatterns}
              profileName={profile.full_name}
            />
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
  )
}
