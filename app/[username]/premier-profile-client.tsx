"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { VoiceCard } from "@/components/voice-card"
import { AiPatternSummary } from "@/components/ai-pattern-summary"
import { RelationshipFilter } from "@/components/relationship-filter"
import type { RelationshipFilterCategory } from "@/lib/relationship-filter"
import { dedupeContributions } from "@/lib/dedupe-contributions"
import type { Profile, Contribution, ImportedFeedback } from "@/lib/types"
import type { ProfileAnalysis } from "@/lib/build-profile-analysis"

interface PremierProfileClientProps {
  profile: Profile
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  totalContributions: number
  uniqueCompanies: string[]
  interpretationSentence: string
  vibeLabels: string[]
  anchorQuote: string
  profileAnalysis: ProfileAnalysis
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
}: PremierProfileClientProps) {
  const contributions = dedupeContributions(rawContributions)
  const voiceContributions = contributions.filter((c) => c.voice_url)
  const voiceNotesCount = useMemo(() => {
    return rawContributions.filter((c) => c.voice_url).length
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

  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)
  const [selectedHeatmapTrait, setSelectedHeatmapTrait] = useState<string | null>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [howItFeelsRelationshipFilter, setHowItFeelsRelationshipFilter] = useState<RelationshipFilterCategory>("All")
  const [voiceRelationshipFilter, setVoiceRelationshipFilter] = useState<RelationshipFilterCategory>("All")

  const filteredVoiceContributions = useMemo(() => {
    if (voiceRelationshipFilter === "All") return voiceContributions
    return voiceContributions.filter((c) => c.relationship_category === voiceRelationshipFilter)
  }, [voiceContributions, voiceRelationshipFilter])

  const howItFeelsContributions = useMemo(() => {
    return contributions.filter((c) => c.written_note?.trim())
  }, [contributions])

  const filteredHowItFeels = useMemo(() => {
    if (howItFeelsRelationshipFilter === "All") return howItFeelsContributions
    return howItFeelsContributions.filter((c) => c.relationship_category === howItFeelsRelationshipFilter)
  }, [howItFeelsContributions, howItFeelsRelationshipFilter])

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
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

          <p className="text-sm text-neutral-500 uppercase tracking-wide">
            Nomee Profile · Based on feedback from {profileAnalysis.counts.contributions}{" "}
            {profileAnalysis.counts.contributions === 1 ? "person" : "people"}
            {profileAnalysis.counts.uploads > 0 &&
              ` · ${profileAnalysis.counts.uploads} ${profileAnalysis.counts.uploads === 1 ? "upload" : "uploads"}`}
          </p>

          <div
            className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full border ${confidenceLevel.bgColor} ${confidenceLevel.borderColor}`}
          >
            <div className={`w-2 h-2 rounded-full ${confidenceLevel.color.replace("text-", "bg-")}`}></div>
            <span className={`text-xs font-semibold ${confidenceLevel.color}`}>{confidenceLevel.label}</span>
          </div>

          <p className="text-xs text-neutral-500 mt-2">Each contributor can submit once.</p>

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

      {/* Summary Section - Always show */}
      <section className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="border-l-4 border-blue-500 pl-6 sm:pl-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 leading-tight">
                  Summary of working with {firstName}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-500">
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
                          {profileAnalysis.counts.uploads} {profileAnalysis.counts.uploads === 1 ? "upload" : "uploads"}
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
        </div>
      </section>

      {profileAnalysis.counts.contributions >= 2 && profileAnalysis.vibeSignals.length > 0 && (
        <section className="w-full bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4">{firstName}'s vibe</h3>
                <div className="flex flex-wrap gap-3">
                  {profileAnalysis.vibeSignals.map((vibe, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100 transition-all duration-200 ease-out cursor-default hover:scale-105 hover:shadow-md hover:shadow-purple-100/50 hover:bg-purple-100 hover:border-purple-200"
                    >
                      {vibe.label}
                      {vibe.count > 1 && (
                        <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-200 text-purple-800">
                          ×{vibe.count}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {profileAnalysis.counts.contributions >= 2 && profileAnalysis.vibeSignals.length === 0 && (
        <section className="w-full bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">{firstName}'s vibe</h3>
                <p className="text-sm text-neutral-500">Vibe appears once 2+ people contribute.</p>
              </div>
            </div>
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
                  {filteredVoiceContributions.slice(0, 3).map((contribution) => (
                    <VoiceCard key={contribution.id} contribution={contribution} profileName={profile.full_name} />
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
            </div>
          </div>
        </section>
      )}

      {/* Pattern Recognition Section */}
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
                      {profileAnalysis.traitSignals.slice(0, 5).map((trait) => (
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
                      {profileAnalysis.traitSignals.slice(0, 5).map((trait) => {
                        const isSelected = selectedHeatmapTrait === trait.label
                        const maxCount = Math.max(...profileAnalysis.traitSignals.map((t) => t.count))
                        const opacity = 0.3 + (trait.count / maxCount) * 0.7

                        return (
                          <button
                            key={trait.label}
                            onClick={() =>
                              setSelectedHeatmapTrait(selectedHeatmapTrait === trait.label ? null : trait.label)
                            }
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
                              className={`text-xs font-semibold ${isSelected ? "text-blue-700" : "text-neutral-500"}`}
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
                      {profileAnalysis.traitSignals.slice(5, 15).map((trait) => {
                        const isSelected = selectedHeatmapTrait === trait.label

                        return (
                          <button
                            key={trait.label}
                            onClick={() =>
                              setSelectedHeatmapTrait(selectedHeatmapTrait === trait.label ? null : trait.label)
                            }
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
          </div>
        </section>
      )}

      {/* How it feels Section */}
      {howItFeelsContributions.length > 0 && (
        <section className="w-full bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="space-y-6">
              <div className="space-y-3 max-w-2xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">How it feels</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Day-to-day collaboration style and working patterns
                </p>
              </div>

              <div className="flex justify-center">
                <RelationshipFilter
                  contributions={howItFeelsContributions}
                  selectedCategory={howItFeelsRelationshipFilter}
                  onCategoryChange={setHowItFeelsRelationshipFilter}
                />
              </div>

              {filteredHowItFeels.length > 0 ? (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {filteredHowItFeels.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="break-inside-avoid bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
                        {contribution.written_note}
                      </p>

                      {contribution.combined_traits && contribution.combined_traits.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {contribution.combined_traits.slice(0, 6).map((trait, idx) => (
                            <span
                              key={idx}
                              className="inline-flex px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-3 border-t border-neutral-100">
                        <p className="text-xs font-semibold text-neutral-900">{contribution.giver_name}</p>
                        {contribution.giver_role && (
                          <p className="text-xs text-neutral-500">{contribution.giver_role}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
            </div>
          </div>
        </section>
      )}

      {/* Screenshots and highlights Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 bg-white">
        <div className="space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-10">
          <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">
              Screenshots and highlights
            </h3>
            {importedFeedback.length > 0 ? (
              <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed">
                {firstName} saved {importedFeedback.length} {importedFeedback.length === 1 ? "piece" : "pieces"} of
                feedback
              </p>
            ) : (
              <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                Saved moments that add context—screenshots, DMs, and written praise.
              </p>
            )}
          </div>

          {importedFeedback.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {importedFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors"
                >
                  <p className="text-sm text-neutral-700 leading-relaxed mb-4 line-clamp-3">
                    {feedback.ai_extracted_excerpt || feedback.ocr_text?.slice(0, 200)}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {feedback.giver_name}
                        {feedback.giver_title && (
                          <span className="text-neutral-500 font-normal"> · {feedback.giver_title}</span>
                        )}
                      </p>
                      {feedback.giver_company && <p className="text-xs text-neutral-500">{feedback.giver_company}</p>}
                    </div>
                    {feedback.source_type && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 capitalize">
                        {feedback.source_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500">No highlights added yet.</p>
            </div>
          )}
        </div>
      </section>

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
