"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, ChevronDown, ChevronUp, X, ChevronDownIcon } from "lucide-react"
import type React from "react"

import { useMemo, useEffect, useRef } from "react"
import { dedupeContributions } from "@/lib/dedupe-contributions"
import { usePinnedHighlights } from "@/components/pinned-highlights"
import { TooltipProvider } from "@/components/ui/tooltip"

import { cn } from "@/lib/utils" // Added for cn utility

type Contribution = {
  id: string
  contributor_name?: string | null
  contributor_company?: string | null
  contributor_title?: string | null
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
  voice_note_url?: string | null // Added for consistency with updates
  verified_email?: boolean | null // Added for consistency with updates
}

type ImportedFeedback = {
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

type TraitWithCount = {
  label: string
  count: number
  weightedCount: number
  category: "leadership" | "execution" | "collaboration" | "eq"
  examples: string[]
}

type ProfileAnalysis = {
  traitSignals: Array<{ label: string; count: number; sources: string[] }>
  vibeSignals: Array<{ label: string; count: number }>
  impactSignals: Array<{ label: string; count: number; phrases: string[] }>
  totalDataCount: number
}

interface PremierProfileClientProps {
  profile: {
    id: string
    slug: string
    full_name?: string | null
    title?: string | null
    avatar_url?: string | null
    tier?: string | null
    headline?: string | null
    location?: string | null // Added for consistency with updates
    linkedin_url?: string | null // Added for consistency with updates
  }
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
  const [activeTab, setActiveTab] = useState("summary")
  const [activeFilter, setActiveFilter] = useState("all")
  const [expandedTranscript, setExpandedTranscript] = useState<string | null>(null)
  const [viewingScreenshot, setViewingScreenshot] = useState<any>(null)

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

  const voiceNotes = contributions.filter((c) => c && (c.voice_url || c.audio_url || c.voice_note_url))
  const writtenContributions = contributions.filter((c) => c && safeString(c.written_note).trim())
  const uploads = safeRawImportedFeedback

  const stats = {
    total: totalContributions,
    clients: contributions.filter((c) => c.relationship_category === "client").length,
    collaborators: contributions.filter((c) => c.relationship_category === "collaborator").length,
    colleagues: contributions.filter((c) => c.relationship_category === "colleague").length,
    lastContribution:
      contributions.length > 0 && contributions[0]?.created_at
        ? new Date(contributions[0].created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "N/A",
  }

  // Top themes from traits
  const topThemes = safeTraits.slice(0, 7).map((t) => ({ name: t.label, count: t.count }))

  // Filter contributions
  const filteredContributions =
    activeFilter === "all"
      ? contributions
      : contributions.filter((c) => c.relationship_category?.toLowerCase() === activeFilter.toLowerCase())

  const safeContributions = useMemo(() => {
    return contributions.map((c) => ({
      ...c,
      contributor_name: safeString(c.contributor_name, "Anonymous"),
      contributor_title: safeString(c.contributor_title, "Professional"),
      contributor_company: safeString(c.contributor_company),
      written_note: safeString(c.written_note),
      relationship_category: safeString(c.relationship_category, "colleague"),
      created_at: safeString(c.created_at),
    }))
  }, [contributions])

  const filteredContributionsForDisplay =
    activeFilter === "all"
      ? safeContributions
      : safeContributions.filter((c) => c.relationship_category?.toLowerCase() === activeFilter.toLowerCase())

  const safeImportedFeedback = useMemo(() => {
    return uploads.map((f) => ({
      ...f,
      giver_name: safeString(f.giver_name, "Anonymous"),
      giver_company: safeString(f.giver_company),
      ai_extracted_excerpt: safeString(f.ai_extracted_excerpt),
      traits: safeArray(f.traits),
      source_type: safeString(f.source_type, "Upload"),
      giver_relationship: safeString(f.giver_relationship, "Colleague"),
    }))
  }, [uploads])

  const confidenceLevel = useMemo(() => {
    const nomeeCount = writtenContributions.length
    const importedCount = safeImportedFeedback.length
    const total = nomeeCount + importedCount

    if (total >= 10 || nomeeCount >= 7) return "High"
    if (total >= 5 || nomeeCount >= 3) return "Medium"
    return "Low"
  }, [writtenContributions.length, safeImportedFeedback.length])

  // Infer vibes from traits if not explicitly provided
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
    if (activeFilter === "all") return voiceNotes
    return voiceNotes.filter((c) => c?.relationship_category?.toLowerCase() === activeFilter.toLowerCase())
  }, [voiceNotes, activeFilter])

  const filteredWrittenContributions = useMemo(() => {
    let filtered = writtenContributions

    if (activeFilter !== "all") {
      filtered = filtered.filter((c) => c?.relationship_category?.toLowerCase() === activeFilter.toLowerCase())
    }

    return filtered
  }, [writtenContributions, activeFilter])

  const filteredImportedFeedback = useMemo(() => {
    return safeImportedFeedback
  }, [safeImportedFeedback])

  const handleTraitFilterSelect = (trait: string) => {
    setSelectedTraitFilters((prev) => {
      if (prev.includes(trait)) {
        return prev.filter((t) => t !== trait)
      }
      if (prev.length >= 2) return prev
      return [...prev, trait]
    })
  }

  const [selectedTraitFilters, setSelectedTraitFilters] = useState<string[]>([])

  const firstName = safeString(profile?.full_name).split(" ")[0] || "This person"

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/images/nomee-20logo-20transparent.png" alt="Nomee" className="h-7.5 w-auto" />
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Portable Partnership Proof</span>
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                Build Your Own
              </Link>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { key: "summary", label: "Summary" },
                { key: "voice", label: "Voice Notes" },
                { key: "patterns", label: "Patterns" },
                { key: "screenshots", label: "Screenshots" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "py-4 border-b-2 font-medium capitalize transition-colors duration-300",
                    activeTab === tab.key
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-600 hover:text-gray-900",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {profile.full_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "??"}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.full_name || "Anonymous"}</h1>
                  <p className="text-gray-600">{profile.headline || "Professional"}</p>
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                    {profile.location && (
                      <>
                        <span>📍 {profile.location}</span>
                        <span>·</span>
                      </>
                    )}
                    {profile.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  {/* Placeholder for star rating */}
                  <span className="text-2xl">⭐ ⭐ ⭐</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">Verified Reputation</div>
                <div className="text-xs text-gray-600">Based on {stats.total} contributions</div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "summary" && (
            <>
              {/* Stats Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Contributions</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {writtenContributions.length} Written · {voiceNotes.length} Voice · {safeImportedFeedback.length}{" "}
                    Uploads
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-sm font-semibold text-gray-900 mb-4">Relationship Breakdown</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{stats.clients} Clients</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{stats.collaborators} Collaborators</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{stats.colleagues} Colleagues</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-sm font-semibold text-gray-900 mb-2">{topThemes[0]?.name || "Top Theme"}</div>
                  <div className="text-xs text-gray-600">Mentioned {topThemes[0]?.count || 0}X</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Last Contribution</div>
                  <div className="text-lg font-semibold text-gray-900">{stats.lastContribution}</div>
                </div>
              </div>

              {/* What it's like section */}
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What it's like to work with {profile.full_name?.split(" ")[0] || "them"}
                </h2>
                <p className="text-gray-600 mb-6">
                  Based on {stats.total} contributions from clients, collaborators, and colleagues,{" "}
                  {profile.full_name?.split(" ")[0] || "they"}{" "}
                  {topThemes.length > 0 ? "is consistently described as" : ""}
                  {topThemes.slice(0, 3).map((theme, i) => (
                    <span key={theme.name}>
                      {i > 0 && (i === topThemes.slice(0, 3).length - 1 ? ", and " : ", ")}
                      <strong>{theme.name.toLowerCase()}</strong>
                    </span>
                  ))}
                  .
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {topThemes.map((theme) => (
                    <span
                      key={theme.name}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {theme.name} · {theme.count}
                    </span>
                  ))}
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                  <div className="text-sm font-semibold text-indigo-900 mb-1">
                    High Confidence · Updated automatically
                  </div>
                  <div className="text-xs text-indigo-700">
                    Generated from {stats.total} contributions. Updates as more people contribute.
                  </div>
                </div>
              </div>

              {/* All Contributions */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">All Contributions ({contributions.length})</h2>
                  <div className="relative">
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All ({contributions.length})</option>
                      <option value="client">Clients ({stats.clients})</option>
                      <option value="collaborator">Collaborators ({stats.collaborators})</option>
                      <option value="colleague">Colleagues ({stats.colleagues})</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-6">
                  {filteredContributionsForDisplay.map((contribution) => {
                    const allTraits = [
                      ...safeArray(contribution.traits_category1),
                      ...safeArray(contribution.traits_category2),
                    ].slice(0, 5)

                    return (
                      <div key={contribution.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-indigo-600">
                                {contribution.contributor_name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "??"}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {contribution.contributor_name || "Anonymous"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {contribution.contributor_title || "Professional"}
                                {contribution.contributor_company && ` | ${contribution.contributor_company}`}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 capitalize">
                                {contribution.relationship_category?.replace("_", " ") || "Colleague"} · Contributed{" "}
                                {contribution.created_at &&
                                  new Date(contribution.created_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  })}
                              </div>
                            </div>
                          </div>
                          {contribution.verified_email && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium flex items-center">
                              <span className="mr-1">✓</span> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{contribution.written_note}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {allTraits.map((trait, idx) => (
                            <span
                              key={`${trait}-${idx}`}
                              className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Voice Notes Tab */}
          {activeTab === "voice" && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Voice Notes ({voiceNotes.length})</h2>
              <div className="space-y-6">
                {voiceNotes.map((note) => {
                  const allTraits = [...safeArray(note.traits_category1), ...safeArray(note.traits_category2)].slice(
                    0,
                    5,
                  )

                  return (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-indigo-600">
                              {note.contributor_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "??"}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{note.contributor_name || "Anonymous"}</div>
                            <div className="text-sm text-gray-600">
                              {note.contributor_title || "Professional"}
                              {note.contributor_company && ` · ${note.contributor_company}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700">
                            <Play className="w-4 h-4 text-white fill-current" />
                          </button>
                        </div>
                      </div>
                      {note.written_note && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed italic">
                            {expandedTranscript === note.id
                              ? note.written_note
                              : note.written_note.substring(0, 150) + "..."}
                          </p>
                          <button
                            onClick={() => setExpandedTranscript(expandedTranscript === note.id ? null : note.id)}
                            className="text-indigo-600 text-sm mt-2 hover:text-indigo-700 flex items-center"
                          >
                            {expandedTranscript === note.id ? (
                              <>
                                Show less <ChevronUp className="w-4 h-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Read full transcript <ChevronDownIcon className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {allTraits.map((trait, idx) => (
                          <span
                            key={`${trait}-${idx}`}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Patterns Tab */}
          {activeTab === "patterns" && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pattern Analysis</h2>
              <p className="text-gray-600 mb-8">
                Based on {stats.total} contributions, these themes appear most frequently:
              </p>
              <div className="space-y-4">
                {topThemes.map((theme) => (
                  <div key={theme.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{theme.name}</span>
                      <span className="text-sm text-gray-600">{theme.count} mentions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full"
                        style={{ width: `${Math.min((theme.count / stats.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots Tab */}
          {activeTab === "screenshots" && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Screenshots ({safeImportedFeedback.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImportedFeedback.map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setViewingScreenshot(screenshot)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {screenshot.source_type || "Upload"}
                      </span>
                      <span className="text-xs text-gray-500">from {screenshot.giver_name || "Someone"}</span>
                    </div>
                    <p className="text-gray-700">{screenshot.ai_extracted_excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Screenshot Modal */}
        {viewingScreenshot && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setViewingScreenshot(null)}
          >
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    {viewingScreenshot.source_type || "Upload"}
                  </span>
                  <div className="text-sm text-gray-600 mt-2">from {viewingScreenshot.giver_name || "Someone"}</div>
                </div>
                <button onClick={() => setViewingScreenshot(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-lg text-gray-900">{viewingScreenshot.ai_extracted_excerpt}</p>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
