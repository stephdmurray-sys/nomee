"use client"

import type React from "react"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, ChevronDown } from "lucide-react"
import { VoiceCard } from "@/components/voice-card"
import { AiPatternSummary } from "@/components/ai-pattern-summary"
import { RelationshipFilter } from "@/components/relationship-filter"
import type { RelationshipFilterCategory } from "@/lib/relationship-filter"
import { dedupeContributions } from "@/lib/dedupe-contributions"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"
import { usePinnedHighlights, PinButton } from "@/components/pinned-highlights"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HeatPill, getStrengthTier } from "@/components/heat-pill"
import Link from "next/link"
import { cn } from "@/lib/utils" // Added for cn utility

// Design system components
import { SectionHeading } from "@/components/design-system/section-heading"
import { CardShell } from "@/components/design-system/card-shell"
import { Pill } from "@/components/design-system/pill"

function safeArray<T>(value: T[] | null | undefined): T[] {
  if (!value) return []
  if (!Array.isArray(value)) return []
  return value.filter((item) => item != null)
}

function safeString(value: string | null | undefined, fallback = ""): string {
  if (value == null) return fallback
  if (typeof value !== "string") return fallback
  return value
}

function safeNumber(value: number | null | undefined, fallback = 0): number {
  if (value == null) return fallback
  if (typeof value !== "number") return fallback
  if (isNaN(value)) return fallback
  return value
}

function isEmptyOrZero(value: string | number | null | undefined): boolean {
  if (value == null) return true
  if (value === "") return true
  if (value === "0") return true
  if (value === 0) return true
  if (typeof value === "string" && value.trim() === "") return true
  return false
}

interface Profile {
  id: string
  slug: string
  full_name?: string | null
  title?: string | null
  avatar_url?: string | null
  tier?: string | null
  headline?: string | null
}

interface Contribution {
  id: string
  contributor_name?: string | null
  contributor_company?: string | null
  written_note?: string | null
  voice_url?: string | null
  audio_url?: string | null
  traits_category1?: string[] | null
  traits_category2?: string[] | null
  traits_category3?: string[] | null
  traits_category4?: string[] | null
  relationship?: string | null
  relationship_category?: string | null
  contributor_id?: string | null
  created_at?: string | null
}

interface ImportedFeedback {
  id: string
  giver_name?: string | null
  giver_company?: string | null
  ai_extracted_excerpt?: string | null
  traits?: string[] | null
  source_type?: string | null
  confidence_score?: number | null
  included_in_analysis?: boolean | null
  ocr_text?: string | null
  approved_by_owner?: boolean | null
  visibility?: string | null
  giver_relationship?: string | null // Added for consistency with updates
}

interface TraitWithCount {
  label: string
  count: number
  weightedCount: number
  category: "leadership" | "execution" | "collaboration" | "eq"
  examples: string[]
}

interface ProfileAnalysis {
  traitSignals: Array<{ label: string; count: number; sources: string[] }>
  vibeSignals: Array<{ label: string; count: number }>
  impactSignals: Array<{ label: string; count: number; phrases: string[] }>
  totalDataCount: number
}

interface PremierProfileClientProps {
  profile: Profile
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  traits: TraitWithCount[]
  totalContributions: number
  uniqueCompanies: number
  interpretationSentence: string
  vibeLabels: string[]
  anchorQuote: string
  profileAnalysis: ProfileAnalysis
  isOwner?: boolean
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
  profileAnalysis,
  isOwner = false,
}: PremierProfileClientProps) {
  const safeRawContributions = safeArray(rawContributions)
  const safeRawImportedFeedback = safeArray(rawImportedFeedback)
  const safeTraits = safeArray(traits)
  const safeVibeLabels = safeArray(vibeLabels)

  const safeProfileAnalysis = useMemo(
    () => ({
      traitSignals: safeArray(profileAnalysis?.traitSignals),
      vibeSignals: safeArray(profileAnalysis?.vibeSignals),
      impactSignals: safeArray(profileAnalysis?.impactSignals),
      totalDataCount: safeNumber(profileAnalysis?.totalDataCount, 0),
    }),
    [profileAnalysis],
  )

  // Dedupe contributions safely
  const contributions = useMemo(() => {
    try {
      return dedupeContributions(safeRawContributions)
    } catch (e) {
      console.error("[v0] dedupeContributions failed:", e)
      return safeRawContributions
    }
  }, [safeRawContributions])

  const voiceContributions = useMemo(() => {
    return contributions.filter((c) => c && (c.voice_url || c.audio_url))
  }, [contributions])

  const voiceNotesCount = voiceContributions.length

  const importedFeedback = useMemo(() => {
    const dedupedMap = new Map<string, ImportedFeedback>()
    safeRawImportedFeedback.forEach((feedback) => {
      if (!feedback) return
      const key = `${safeString(feedback.giver_name)}|${safeString(feedback.giver_company)}|${safeString(feedback.ai_extracted_excerpt)}`
      if (!dedupedMap.has(key)) {
        dedupedMap.set(key, feedback)
      }
    })
    return Array.from(dedupedMap.values())
  }, [safeRawImportedFeedback])

  const totalUploads = importedFeedback.length

  // State
  const [selectedTraitFilters, setSelectedTraitFilters] = useState<string[]>([])
  const [heroVisible, setHeroVisible] = useState(false)
  const [howItFeelsRelationshipFilter, setHowItFeelsRelationshipFilter] = useState<RelationshipFilterCategory>("All")
  const [voiceRelationshipFilter, setVoiceRelationshipFilter] = useState<RelationshipFilterCategory>("All")
  const [showAllTraits, setShowAllTraits] = useState(false)

  const summaryRef = useRef<HTMLElement>(null)
  const voiceRef = useRef<HTMLElement>(null)
  const patternsRef = useRef<HTMLElement>(null)
  const howItFeelsRef = useRef<HTMLElement>(null)
  const screenshotsRef = useRef<HTMLElement>(null)

  const [activeSection, setActiveSection] = useState<string>("")

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    if (sectionRef.current) {
      const offset = 80 // Account for sticky toolbar height
      const elementPosition = sectionRef.current.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { ref: summaryRef, name: "summary" },
        { ref: voiceRef, name: "voice" },
        { ref: patternsRef, name: "patterns" },
        { ref: howItFeelsRef, name: "how-it-feels" },
        { ref: screenshotsRef, name: "screenshots" },
      ]

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section.name)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const { pinnedItems, pinQuote, pinVoice, pinTrait, unpin, isPinned } = usePinnedHighlights(safeString(profile?.slug))

  const topSignals = useMemo(() => {
    try {
      return safeProfileAnalysis.traitSignals.slice(0, 6).map((s) => safeString(s?.label))
    } catch (e) {
      return []
    }
  }, [safeProfileAnalysis.traitSignals])

  const filteredVoiceContributions = useMemo(() => {
    if (voiceRelationshipFilter === "All") return voiceContributions
    return voiceContributions.filter((c) => c?.relationship_category === voiceRelationshipFilter)
  }, [voiceContributions, voiceRelationshipFilter])

  const writtenContributions = useMemo(() => {
    return contributions.filter((c) => c && safeString(c.written_note).trim())
  }, [contributions])

  const filteredWrittenContributions = useMemo(() => {
    let filtered = writtenContributions

    if (howItFeelsRelationshipFilter !== "All") {
      filtered = filtered.filter((c) => c?.relationship_category === howItFeelsRelationshipFilter)
    }

    if (selectedTraitFilters.length > 0) {
      filtered = filtered.filter((c) => {
        const allTraits = [
          ...safeArray(c?.traits_category1),
          ...safeArray(c?.traits_category2),
          ...safeArray(c?.traits_category3),
          ...safeArray(c?.traits_category4),
        ]
        return selectedTraitFilters.some((t) => allTraits.includes(t))
      })
    }

    return filtered
  }, [writtenContributions, howItFeelsRelationshipFilter, selectedTraitFilters])

  const filteredImportedFeedback = useMemo(() => {
    if (selectedTraitFilters.length === 0) return importedFeedback
    return importedFeedback.filter((f) => {
      return selectedTraitFilters.some((t) => safeArray(f?.traits).includes(t))
    })
  }, [importedFeedback, selectedTraitFilters])

  const handleTraitFilterSelect = (trait: string) => {
    setSelectedTraitFilters((prev) => {
      if (prev.includes(trait)) {
        return prev.filter((t) => t !== trait)
      }
      if (prev.length >= 2) return prev
      return [...prev, trait]
    })
  }

  useEffect(() => {
    setHeroVisible(true)
  }, [])

  const firstName = safeString(profile?.full_name).split(" ")[0] || "This person"

  const VIBE_OPTIONS = [
    "Energized",
    "Focused",
    "Aligned",
    "Inspired",
    "Empowered",
    "Calm",
    "Supported",
    "Seen",
    "Safe",
    "Elevated",
    "Unstuck",
    "Grounded",
  ]

  // Infer vibes from traits if not explicitly provided
  const TRAIT_TO_VIBE_MAP: Record<string, string> = {
    strategic: "Focused",
    thoughtful: "Calm",
    proactive: "Energized",
    collaborative: "Aligned",
    empowering: "Empowered",
    supportive: "Supported",
    "detail-oriented": "Focused",
    organized: "Focused",
    creative: "Inspired",
    authentic: "Seen",
    reliable: "Grounded",
    patient: "Calm",
  }

  // Build top 3 vibes with counts
  const computedVibes = useMemo(() => {
    const vibeFrequency: Record<string, number> = {}

    // First, count explicitly provided vibes
    safeVibeLabels.forEach((vibe) => {
      if (VIBE_OPTIONS.includes(vibe)) {
        vibeFrequency[vibe] = (vibeFrequency[vibe] || 0) + 1
      }
    })

    // If we have fewer than 3 vibes, infer from traits
    if (Object.keys(vibeFrequency).length < 3) {
      safeTraits.forEach((trait) => {
        const traitLabel = safeString(trait?.label).toLowerCase()
        const mappedVibe = TRAIT_TO_VIBE_MAP[traitLabel]
        if (mappedVibe) {
          const weight = Math.ceil((trait?.count || 1) / 2)
          vibeFrequency[mappedVibe] = (vibeFrequency[mappedVibe] || 0) + weight
        }
      })
    }

    // Sort and return top 3
    return Object.entries(vibeFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }))
  }, [safeVibeLabels, safeTraits])

  const confidenceLevel = useMemo(() => {
    const nomeeCount = writtenContributions.length
    const importedCount = importedFeedback.length
    const total = nomeeCount + importedCount

    if (total >= 10 || nomeeCount >= 7) return "High"
    if (total >= 5 || nomeeCount >= 3) return "Medium"
    return "Low"
  }, [writtenContributions.length, importedFeedback.length])

  // Calculate max count for heat shading
  const maxTraitCount = Math.max(...safeTraits.map((t) => t?.count || 0), 1)

  const topTraits = safeTraits
    .filter((t) => t && t.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
  const emergingTraits = safeTraits
    .filter((t) => (t && t.count < 2) || !topTraits.includes(t))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // Early return if no profile
  if (!profile || !profile.id || !profile.slug) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-sans font-semibold text-neutral-900 mb-2 leading-tight">
            {safeString(profile.full_name, "Anonymous")}
          </h1>
          {!isEmptyOrZero(profile.headline) && (
            <p className="text-[var(--text-subhead)] text-neutral-600 mb-4">{profile.headline}</p>
          )}

          {/* Stats row - smaller, muted */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3 flex-wrap">
            <span className="font-medium text-neutral-600 uppercase tracking-wide text-xs">NOMEE PROFILE</span>
            <span className="text-neutral-300">·</span>
            <span className="uppercase tracking-wide text-xs">
              BASED ON FEEDBACK FROM {safeNumber(totalContributions, 0)} PEOPLE
            </span>
            {totalUploads > 0 && (
              <>
                <span className="text-neutral-300">·</span>
                <span className="uppercase tracking-wide text-xs">{totalUploads} UPLOADS</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mb-2">
            <Pill variant="direct">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  confidenceLevel === "High"
                    ? "bg-[var(--nomee-green)]"
                    : confidenceLevel === "Medium"
                      ? "bg-[var(--nomee-amber)]"
                      : "bg-neutral-400"
                }`}
              />
              {confidenceLevel} confidence
            </Pill>
          </div>

          <p className="text-xs text-neutral-400">Each contributor can submit once.</p>
        </div>
      </div>
    )
  }

  // Filtered contributions for "How it feels" section
  const howItFeelsContributions = writtenContributions.filter(
    (c) =>
      (howItFeelsRelationshipFilter === "All" || c?.relationship_category === howItFeelsRelationshipFilter) &&
      (selectedTraitFilters.length === 0 ||
        selectedTraitFilters.some((t) =>
          [
            ...safeArray(c?.traits_category1),
            ...safeArray(c?.traits_category2),
            ...safeArray(c?.traits_category3),
            ...safeArray(c?.traits_category4),
          ].includes(t),
        )),
  )

  return (
    <TooltipProvider>
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 overflow-x-auto">
            {(safeProfileAnalysis.totalDataCount >= 1 || safeTraits.length > 0) && (
              <button
                onClick={() => scrollToSection(summaryRef)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeSection === "summary" ? "bg-blue-100 text-blue-900" : "text-neutral-600 hover:bg-neutral-100",
                )}
              >
                Summary
              </button>
            )}

            {voiceContributions.length > 0 && (
              <button
                onClick={() => scrollToSection(voiceRef)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeSection === "voice" ? "bg-blue-100 text-blue-900" : "text-neutral-600 hover:bg-neutral-100",
                )}
              >
                Voice Notes
              </button>
            )}

            {safeTraits.length > 0 && (
              <button
                onClick={() => scrollToSection(patternsRef)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeSection === "patterns" ? "bg-blue-100 text-blue-900" : "text-neutral-600 hover:bg-neutral-100",
                )}
              >
                Patterns
              </button>
            )}

            {writtenContributions.length > 0 && (
              <button
                onClick={() => scrollToSection(howItFeelsRef)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeSection === "how-it-feels"
                    ? "bg-blue-100 text-blue-900"
                    : "text-neutral-600 hover:bg-neutral-100",
                )}
              >
                How it feels
              </button>
            )}

            {importedFeedback.length > 0 && (
              <button
                onClick={() => scrollToSection(screenshotsRef)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeSection === "screenshots"
                    ? "bg-blue-100 text-blue-900"
                    : "text-neutral-600 hover:bg-neutral-100",
                )}
              >
                Screenshots
              </button>
            )}
          </nav>
        </div>
      </div>

      <main className="relative min-h-screen bg-[var(--nomee-neutral-bg)]">
        {" "}
        {/* Changed to relative */}
        {/* ============================================ */}
        {/* SECTION 1: HERO / HEADER */}
        {/* ============================================ */}
        <section
          className={`pt-12 pb-[var(--space-section)] px-4 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-7xl font-sans font-semibold text-[var(--nomee-near-black)] mb-3 leading-tight">
              {safeString(profile.full_name, "Anonymous")}
            </h1>
            <p className="text-[var(--text-body)] text-neutral-700 font-medium mb-6 tracking-tighter">
              This is a Proof Link — showing what it's actually like to work with {firstName}, based on real
              experiences.
            </p>
            {!isEmptyOrZero(profile.headline) && (
              <p className="text-[var(--text-subhead)] text-neutral-600 mb-4">{profile.headline}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3 flex-wrap opacity-60">
              <span className="font-medium text-neutral-600 uppercase tracking-wide text-xs">NOMEE PROFILE</span>

              <span className="text-neutral-300">·</span>
              <span className="uppercase tracking-wide text-xs">
                BASED ON FEEDBACK FROM {safeNumber(totalContributions, 0)} PEOPLE
              </span>
              {totalUploads > 0 && (
                <>
                  <span className="text-neutral-300">·</span>
                  <span className="uppercase tracking-wide text-xs">{totalUploads} UPLOADS</span>
                </>
              )}
            </div>

            <div className="flex justify-center mt-4 mb-8 opacity-60">
              <Pill variant="direct">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    confidenceLevel === "High"
                      ? "bg-[var(--nomee-green)]"
                      : confidenceLevel === "Medium"
                        ? "bg-[var(--nomee-amber)]"
                        : "bg-neutral-400"
                  }`}
                />
                {confidenceLevel} confidence
              </Pill>
            </div>

            <p className="text-xs text-neutral-400 opacity-60">Each contributor can submit once.</p>
            {/* </CHANGE> */}
          </div>
        </section>
        {/* ============================================ */}
        {/* SECTION 2: SUMMARY - with teal left border */}
        {/* ============================================ */}
        {(safeProfileAnalysis.totalDataCount >= 1 || safeTraits.length > 0) && (
          <section ref={summaryRef} className="pb-[var(--space-section)] px-4">
            {" "}
            {/* Added ref */}
            <div className="max-w-4xl mx-auto">
              <CardShell>
                <AiPatternSummary
                  traits={safeTraits}
                  totalContributions={safeNumber(totalContributions, 0)}
                  uniqueCompanies={safeNumber(uniqueCompanies, 0)}
                  interpretationSentence={safeString(interpretationSentence)}
                  vibeLabels={safeVibeLabels}
                  uploadsCount={totalUploads}
                  voiceNotesCount={voiceNotesCount}
                  firstName={firstName}
                />
              </CardShell>

              {computedVibes.length > 0 && (
                <CardShell className="mt-6 bg-white border border-neutral-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[1.75rem] font-sans font-semibold text-[var(--nomee-near-black)]">Vibe</h3>
                    <p className="text-sm text-neutral-500">How it feels to work together</p>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    {computedVibes.map((vibe) => (
                      <div
                        key={vibe.label}
                        className="group px-6 py-4 rounded-2xl bg-blue-50/70 text-[var(--nomee-near-black)] shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold">{vibe.label}</span>
                          <span className="text-sm opacity-70">·</span>
                          <span className="text-lg font-semibold text-blue-600">{vibe.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[var(--text-micro)] text-neutral-500 pt-4 border-t border-neutral-200">
                    Based on patterns across {totalContributions}{" "}
                    {totalContributions === 1 ? "perspective" : "perspectives"}
                    {totalUploads > 0 && ` + ${totalUploads} upload${totalUploads === 1 ? "" : "s"}`}
                  </p>
                </CardShell>
              )}
            </div>
          </section>
        )}
        {/* ============================================ */}
        {/* SECTION 3: IN THEIR OWN WORDS (Voice Notes) */}
        {/* ============================================ */}
        {voiceContributions.length > 0 && (
          <section ref={voiceRef} className="py-[var(--space-section)] px-4 w-full">
            {" "}
            {/* Added ref */}
            <div className="w-full">
              <div className="mx-auto w-full max-w-6xl px-6">
                <p className="text-sm text-neutral-500 mb-3 text-center">One contribution per person. Never edited.</p>
                {/* </CHANGE> */}
                <SectionHeading
                  title="In Their Own Words"
                  subtitle={`Unedited voice notes from people who know ${firstName}`}
                />

                <div className="flex justify-center mb-6 opacity-70">
                  <RelationshipFilter
                    selectedCategory={voiceRelationshipFilter}
                    onCategoryChange={setVoiceRelationshipFilter}
                    contributions={voiceContributions}
                  />
                </div>
                {/* </CHANGE> */}

                <div className="mt-10 columns-1 md:columns-2 lg:columns-3 [column-gap:2rem]">
                  {filteredVoiceContributions.map((contribution) => {
                    if (!contribution?.id) return null
                    const audioUrl = safeString(contribution.voice_url) || safeString(contribution.audio_url)
                    if (!audioUrl) return null

                    const allTraits = [
                      ...safeArray(contribution.traits_category1),
                      ...safeArray(contribution.traits_category2),
                    ].slice(0, 5)

                    const keywords = extractKeywordsFromText(
                      safeString(contribution.written_note),
                      allTraits,
                      topSignals,
                    )

                    return (
                      <div key={contribution.id} className="mb-8 break-inside-avoid">
                        <div className="relative group">
                          <CardShell variant="direct" className="w-full">
                            <div className="mb-4">
                              <VoiceCard
                                audioUrl={audioUrl}
                                contributorName={safeString(contribution.contributor_name, "Anonymous")}
                                relationship={safeString(contribution.relationship, "Colleague")}
                                traits={[]}
                                compact
                              />
                            </div>

                            {/* Written note with highlights */}
                            {safeString(contribution.written_note).trim() && (
                              <p className="text-neutral-700 text-[var(--text-small)] leading-relaxed mb-4">
                                {highlightQuote(safeString(contribution.written_note), keywords)}
                              </p>
                            )}

                            {/* Trait pills */}
                            {allTraits.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {allTraits.slice(0, 5).map((trait, idx) => {
                                  const traitData = safeTraits.find(
                                    (t) => t?.label?.toLowerCase() === trait.toLowerCase(),
                                  )
                                  const count = traitData?.count || 1
                                  const tier = getStrengthTier(count, maxTraitCount)

                                  return (
                                    <Pill key={`${trait}-${idx}`} variant="trait" tier={tier}>
                                      {trait}
                                    </Pill>
                                  )
                                })}
                              </div>
                            )}

                            <div className="pt-3 border-t border-neutral-100">
                              <p className="font-medium text-[var(--nomee-near-black)] text-[var(--text-small)]">
                                {safeString(contribution.contributor_name, "Anonymous")}
                              </p>
                              <p className="text-[var(--text-micro)] text-neutral-500 capitalize">
                                {safeString(contribution.relationship, "Colleague").replace(/_/g, " ")}
                              </p>
                              {!isEmptyOrZero(contribution.contributor_company) && (
                                <p className="text-[var(--text-micro)] text-neutral-400">
                                  {contribution.contributor_company}
                                </p>
                              )}
                            </div>
                          </CardShell>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
        {/* ============================================ */}
        {/* SECTION 4: PATTERN RECOGNITION */}
        {/* ============================================ */}
        {safeTraits.length > 0 && (
          <section ref={patternsRef} className="py-[var(--space-section)] px-4">
            {" "}
            {/* Added ref */}
            <div className="max-w-4xl mx-auto">
              <SectionHeading
                title={`How it feels to work with ${firstName}`}
                subtitle="Based on recurring themes across contributions."
              />
              {/* </CHANGE> */}

              <div className="flex justify-center mt-4 mb-8 opacity-60">
                <Pill variant="direct">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      confidenceLevel === "High"
                        ? "bg-[var(--nomee-green)]"
                        : confidenceLevel === "Medium"
                          ? "bg-[var(--nomee-amber)]"
                          : "bg-neutral-400"
                    }`}
                  />
                  {confidenceLevel} confidence
                </Pill>
              </div>
              {/* </CHANGE> */}

              <CardShell>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-[var(--text-micro)] font-semibold text-neutral-500 uppercase tracking-wider mb-4 opacity-75">
                      TOP SIGNALS
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {topTraits.map((trait) => {
                        if (!trait?.label) return null
                        const tier = getStrengthTier(trait.count, maxTraitCount)
                        const bgOpacity = 0.05 + (trait.count / maxTraitCount) * 0.15
                        const borderOpacity = 0.1 + (trait.count / maxTraitCount) * 0.3
                        const pillSize = trait.count >= 5 ? "lg" : trait.count >= 4 ? "md" : "sm"

                        return (
                          <Pill
                            key={trait.label}
                            variant="topSignal"
                            tier={tier}
                            count={trait.count}
                            size={pillSize}
                            onClick={() => handleTraitFilterSelect(trait.label)}
                            isSelected={selectedTraitFilters.includes(trait.label)}
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${bgOpacity})`,
                              borderColor: `rgba(59, 130, 246, ${borderOpacity})`,
                            }}
                          >
                            {trait.label}
                          </Pill>
                        )
                      })}
                    </div>
                    {/* </CHANGE> */}
                  </div>

                  {/* EMERGING SIGNALS */}
                  <div>
                    <h3 className="text-[var(--text-micro)] font-semibold text-neutral-500 uppercase tracking-wider mb-4 opacity-75">
                      EMERGING SIGNALS
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {emergingTraits.map((trait) => {
                        if (!trait?.label) return null
                        const tier = getStrengthTier(trait.count, maxTraitCount)

                        return (
                          <Pill
                            key={trait.label}
                            variant="trait"
                            tier={tier}
                            count={trait.count}
                            onClick={() => handleTraitFilterSelect(trait.label)}
                            isSelected={selectedTraitFilters.includes(trait.label)}
                          >
                            {trait.label}
                          </Pill>
                        )
                      })}
                    </div>
                    {/* </CHANGE> */}
                  </div>
                </div>
              </CardShell>

              {/* View all traits */}
              {safeTraits.length > topTraits.length + emergingTraits.length && (
                <div className="text-center mt-6 pt-6 border-t border-neutral-100">
                  <button
                    onClick={() => setShowAllTraits(!showAllTraits)}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showAllTraits ? "Show less" : `View all ${safeTraits.length} traits`}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAllTraits ? "rotate-180" : ""}`} />
                  </button>
                </div>
              )}

              {/* Expanded traits */}
              {showAllTraits && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <div className="flex flex-wrap gap-2">
                    {safeTraits.slice(topTraits.length + emergingTraits.length).map((trait) => {
                      if (!trait?.label) return null
                      const tier = getStrengthTier(trait.count, maxTraitCount)

                      return (
                        <HeatPill
                          key={trait.label}
                          label={trait.label}
                          count={trait.count}
                          tier={tier}
                          isSelected={selectedTraitFilters.includes(trait.label)}
                          onClick={() => handleTraitFilterSelect(trait.label)}
                          size="sm"
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
        {/* ============================================ */}
        {/* SECTION 5: HOW IT FEELS (Direct text submissions only - NO voice) */}
        {/* ============================================ */}
        {writtenContributions.length > 0 && (
          <section
            ref={howItFeelsRef}
            className="py-[var(--space-section)] px-4 bg-white border-t border-[var(--nomee-neutral-border)]"
          >
            {" "}
            {/* Added ref */}
            <div className="w-full">
              <div className="mx-auto w-full max-w-6xl px-6">
                <SectionHeading title="How it feels" subtitle="Day-to-day collaboration style and working patterns" />

                {/* Relationship Filter */}
                <div className="flex justify-center mb-6">
                  <RelationshipFilter
                    selectedCategory={howItFeelsRelationshipFilter}
                    onCategoryChange={setHowItFeelsRelationshipFilter}
                    contributions={writtenContributions}
                  />
                </div>

                <div className="mt-10 columns-1 md:columns-2 lg:columns-3 [column-gap:2rem]">
                  {filteredWrittenContributions
                    .filter((c) => !c.voice_url && !c.audio_url)
                    .map((contribution) => {
                      if (!contribution?.id) return null

                      const allTraits = [
                        ...safeArray(contribution.traits_category1),
                        ...safeArray(contribution.traits_category2),
                        ...safeArray(contribution.traits_category3),
                        ...safeArray(contribution.traits_category4),
                      ]
                      const keywords = extractKeywordsFromText(
                        safeString(contribution.written_note),
                        allTraits,
                        topSignals,
                      )

                      return (
                        <div key={contribution.id} className="mb-8 break-inside-avoid">
                          <div className="relative group">
                            <CardShell variant="direct" className="w-full">
                              <div className="mb-6">
                                <Pill variant="direct" className="text-xs px-2 py-1">
                                  <MessageSquare className="w-2.5 h-2.5" />
                                  Nomee Submission
                                </Pill>
                              </div>

                              {isOwner && (
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <PinButton
                                    isPinned={isPinned("quote", contribution.id)}
                                    onPin={() => pinQuote(contribution.id, safeString(contribution.written_note))}
                                    onUnpin={() => unpin("quote", contribution.id)}
                                  />
                                </div>
                              )}

                              {/* Written note */}
                              {safeString(contribution.written_note).trim() && (
                                <p className="text-neutral-700 text-[var(--text-small)] leading-relaxed mb-4">
                                  {highlightQuote(safeString(contribution.written_note), keywords)}
                                </p>
                              )}

                              {/* Trait Pills */}
                              {allTraits.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {allTraits.slice(0, 5).map((trait, idx) => {
                                    const traitData = safeTraits.find(
                                      (t) => t?.label?.toLowerCase() === trait.toLowerCase(),
                                    )
                                    const count = traitData?.count || 1
                                    const tier = getStrengthTier(count, maxTraitCount)

                                    return (
                                      <Pill
                                        key={`${trait}-${idx}`}
                                        variant="trait"
                                        tier={tier}
                                        onClick={() => handleTraitFilterSelect(trait)}
                                        isSelected={selectedTraitFilters.includes(trait)}
                                      >
                                        {trait}
                                      </Pill>
                                    )
                                  })}
                                </div>
                              )}

                              {/* Contributor Info */}
                              <div className="pt-3 border-t border-neutral-100">
                                <p className="font-medium text-[var(--nomee-near-black)] text-[var(--text-small)]">
                                  {safeString(contribution.contributor_name, "Anonymous")}
                                </p>
                                <p className="text-[var(--text-micro)] text-neutral-500 capitalize">
                                  {safeString(contribution.relationship, "Colleague").replace(/_/g, " ")}
                                </p>
                                {!isEmptyOrZero(contribution.contributor_company) && (
                                  <p className="text-[var(--text-micro)] text-neutral-400">
                                    {contribution.contributor_company}
                                  </p>
                                )}
                              </div>
                            </CardShell>
                          </div>
                        </div>
                      )
                    })}
                </div>

                {/* Empty State */}
                {filteredWrittenContributions.filter((c) => !c.voice_url && !c.audio_url).length === 0 && (
                  <div className="text-center py-12 text-neutral-500">
                    <p>No feedback matches the current filters.</p>
                    {selectedTraitFilters.length > 0 && (
                      <button
                        onClick={() => setSelectedTraitFilters([])}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {/* ============================================ */}
        {/* SECTION 6: SCREENSHOTS AND HIGHLIGHTS (Imported only) */}
        {/* ============================================ */}
        {importedFeedback.length > 0 && (
          <section
            ref={screenshotsRef}
            className="py-[var(--space-section)] px-4 bg-white border-t border-[var(--nomee-neutral-border)]"
          >
            {" "}
            {/* Added ref */}
            <div className="max-w-6xl mx-auto">
              <SectionHeading
                title="Screenshots and highlights"
                subtitle={`${firstName} saved ${importedFeedback.length} pieces of feedback`}
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredImportedFeedback.map((feedback) => {
                  if (!feedback?.id) return null

                  const feedbackTraits = safeArray(feedback.traits)
                  const keywords = extractKeywordsFromText(
                    safeString(feedback.ai_extracted_excerpt),
                    feedbackTraits,
                    topSignals,
                  )

                  const sourceType = safeString(feedback.source_type, "upload").toLowerCase()
                  const isLinkedIn = sourceType.includes("linkedin")
                  const isEmail = sourceType.includes("email")
                  const sourceLabel = isLinkedIn ? "LinkedIn" : isEmail ? "Email" : "Upload"

                  return (
                    <CardShell key={feedback.id} variant="imported">
                      {/* Source pill at top - EVERY card has one */}
                      <div className="mb-4">
                        <Pill variant="imported" className="text-xs">
                          {sourceLabel}
                        </Pill>
                      </div>

                      {/* Quote text */}
                      <p className="text-neutral-700 text-[var(--text-small)] leading-relaxed mb-4">
                        {highlightQuote(safeString(feedback.ai_extracted_excerpt), keywords)}
                      </p>

                      <div className="pt-3 border-t border-neutral-100">
                        <p className="font-medium text-[var(--nomee-near-black)] text-[var(--text-small)]">
                          {safeString(feedback.giver_name, "Anonymous")}
                        </p>
                        {!isEmptyOrZero(feedback.giver_relationship) && (
                          <p className="text-[var(--text-micro)] text-neutral-500 capitalize">
                            {safeString(feedback.giver_relationship, "Colleague").replace(/_/g, " ")}
                          </p>
                        )}
                        {!isEmptyOrZero(feedback.giver_company) && (
                          <p className="text-[var(--text-micro)] text-neutral-400">{feedback.giver_company}</p>
                        )}
                      </div>
                    </CardShell>
                  )
                })}
              </div>

              {/* Empty state for filtered */}
              {filteredImportedFeedback.length === 0 && selectedTraitFilters.length > 0 && (
                <div className="text-center py-12 text-neutral-500">
                  <p>No imported feedback matches the selected traits.</p>
                  <button
                    onClick={() => setSelectedTraitFilters([])}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
        {/* ============================================ */}
        {/* SECTION 7: BUILD YOUR OWN NOMEE CTA (BLACK BG) */}
        {/* ============================================ */}
        <section className="py-16 px-4 bg-[var(--nomee-near-black)]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-[var(--text-section)] md:text-[2.5rem] font-sans text-white mb-4">
              Build your own Nomee profile
            </h2>
            <p className="text-neutral-400 text-[var(--text-body)] mb-8 leading-relaxed">
              Get feedback from people you've worked with. Create a profile that shows how you collaborate, solve
              problems, and make an impact.
            </p>
            <Button asChild size="lg" className="bg-white text-[var(--nomee-near-black)] hover:bg-neutral-100 px-8">
              <Link href="/auth/signup">Get started for free</Link>
            </Button>
          </div>
        </section>
      </main>
    </TooltipProvider>
  )
}
