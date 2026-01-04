"use client"

import { useMemo } from "react"
import { TrendingUp, Users, Zap, MessageSquare, Upload } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Contribution {
  id: string
  written_note?: string | null
  traits_category1?: string[] | null
  traits_category2?: string[] | null
  traits_category3?: string[] | null
  traits_category4?: string[] | null
  contributor_id?: string | null
}

interface ImportedFeedback {
  id: string
  ai_extracted_excerpt?: string | null
  traits?: string[] | null
}

interface ProfileAnalysis {
  traitSignals: Array<{ label: string; count: number; sources: string[] }>
  vibeSignals: Array<{ label: string; count: number }>
  impactSignals: Array<{ label: string; count: number; phrases: string[] }>
  totalDataCount: number
}

interface PremierSignalBarProps {
  profileAnalysis: ProfileAnalysis
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  firstName?: string
}

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

function safeString(str: string | null | undefined): string {
  return typeof str === "string" ? str : ""
}

function safeNumber(num: number | null | undefined, fallback = 0): number {
  return typeof num === "number" && !isNaN(num) ? num : fallback
}

// Curated impact dictionary (~50 words/phrases)
const IMPACT_DICTIONARY = [
  "increased",
  "grew",
  "drove",
  "improved",
  "exceeded",
  "delivered",
  "launched",
  "saved",
  "reduced",
  "scaled",
  "led",
  "built",
  "created",
  "transformed",
  "streamlined",
  "optimized",
  "achieved",
  "generated",
  "boosted",
  "accelerated",
  "pioneered",
  "doubled",
  "tripled",
  "revenue",
  "conversion",
  "engagement",
  "shipped",
  "executed",
  "closed",
  "secured",
  "won",
  "earned",
  "surpassed",
  "outperformed",
  "promoted",
  "highest",
  "record",
  "breakthrough",
  "milestone",
  "elevated",
  "simplified",
  "resolved",
  "championed",
  "enabled",
  "empowered",
  "facilitated",
  "enhanced",
  "strengthened",
  "expanded",
]

const IMPACT_PHRASE_MAP: Record<string, string> = {
  created: "Created outcomes",
  drove: "Drove results",
  improved: "Improved performance",
  engagement: "Boosted engagement",
  highest: "Reached highest",
  increased: "Increased impact",
  grew: "Grew metrics",
  exceeded: "Exceeded goals",
  delivered: "Delivered value",
  launched: "Launched initiatives",
  saved: "Saved resources",
  reduced: "Reduced friction",
  scaled: "Scaled operations",
  led: "Led efforts",
  built: "Built solutions",
  transformed: "Transformed processes",
  streamlined: "Streamlined workflows",
  optimized: "Optimized systems",
  achieved: "Achieved targets",
  generated: "Generated results",
  boosted: "Boosted outcomes",
  accelerated: "Accelerated growth",
  pioneered: "Pioneered change",
  doubled: "Doubled metrics",
  tripled: "Tripled impact",
  revenue: "Grew revenue",
  conversion: "Improved conversion",
  shipped: "Shipped products",
  executed: "Executed strategy",
  closed: "Closed deals",
  secured: "Secured wins",
  won: "Won business",
  earned: "Earned recognition",
  surpassed: "Surpassed goals",
  outperformed: "Outperformed peers",
  promoted: "Got promoted",
  record: "Set records",
  breakthrough: "Achieved breakthrough",
  milestone: "Hit milestones",
  elevated: "Elevated standards",
  simplified: "Simplified complexity",
  resolved: "Resolved issues",
  championed: "Championed initiatives",
  enabled: "Enabled success",
  empowered: "Empowered teams",
  facilitated: "Facilitated progress",
  enhanced: "Enhanced outcomes",
  strengthened: "Strengthened relationships",
  expanded: "Expanded reach",
}

export function PremierSignalBar({
  profileAnalysis,
  contributions,
  importedFeedback,
  firstName,
}: PremierSignalBarProps) {
  const safeContributions = safeArray(contributions)
  const safeImportedFeedback = safeArray(importedFeedback)
  const safeFirstName = safeString(firstName) || "this person"

  const safeProfileAnalysis = {
    traitSignals: safeArray(profileAnalysis?.traitSignals),
    vibeSignals: safeArray(profileAnalysis?.vibeSignals),
    impactSignals: safeArray(profileAnalysis?.impactSignals),
    totalDataCount: safeNumber(profileAnalysis?.totalDataCount, 0),
  }

  // Build allCards from contributions + importedFeedback
  const allCards = useMemo(() => {
    const nomeeCards = safeContributions.map((c) => ({
      id: safeString(c?.id),
      excerpt: safeString(c?.written_note),
      traits: [
        ...safeArray(c?.traits_category1),
        ...safeArray(c?.traits_category2),
        ...safeArray(c?.traits_category3),
        ...safeArray(c?.traits_category4),
      ],
      type: "nomee" as const,
      contributorId: c?.contributor_id,
    }))

    const importedCards = safeImportedFeedback.map((f) => ({
      id: safeString(f?.id),
      excerpt: safeString(f?.ai_extracted_excerpt),
      traits: safeArray(f?.traits),
      type: "imported" as const,
      contributorId: undefined,
    }))

    return [...nomeeCards, ...importedCards]
  }, [safeContributions, safeImportedFeedback])

  // Top Signals - ranked by count
  const topSignals = useMemo(() => {
    const counts: Record<string, { count: number; sources: Set<"nomee" | "imported">; example?: string }> = {}

    allCards.forEach((card) => {
      if (!card) return
      const cardTraits = safeArray(card.traits)
      cardTraits.forEach((trait) => {
        const safeTrait = safeString(trait)
        if (!safeTrait) return
        if (!counts[safeTrait]) {
          counts[safeTrait] = { count: 0, sources: new Set(), example: undefined }
        }
        counts[safeTrait].count++
        if (card.type) counts[safeTrait].sources.add(card.type)
        if (!counts[safeTrait].example && card.excerpt) {
          counts[safeTrait].example = safeString(card.excerpt).slice(0, 80)
        }
      })
    })

    return Object.entries(counts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 6)
      .map(([label, data]) => ({
        label,
        count: data.count,
        sources: Array.from(data.sources),
        example: data.example,
        strength: data.count >= 3 ? "Core" : data.count >= 2 ? "Strong" : "Emerging",
      }))
  }, [allCards])

  // Most Consistent - traits that appear across multiple unique contributors
  const consistentSignals = useMemo(() => {
    const contributorTraits: Record<string, Set<string>> = {}

    allCards.forEach((card) => {
      if (!card) return
      const contributorKey = card.contributorId || card.id
      const cardTraits = safeArray(card.traits)
      cardTraits.forEach((trait) => {
        const safeTrait = safeString(trait)
        if (!safeTrait) return
        if (!contributorTraits[safeTrait]) {
          contributorTraits[safeTrait] = new Set()
        }
        contributorTraits[safeTrait].add(contributorKey)
      })
    })

    return Object.entries(contributorTraits)
      .map(([label, contributors]) => ({
        label,
        count: contributors.size,
        strength: contributors.size >= 3 ? "Core" : contributors.size >= 2 ? "Strong" : "Emerging",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }, [allCards])

  // Proof of Impact - extracted from text
  const impactSignals = useMemo(() => {
    const counts: Record<string, { count: number; phrases: string[] }> = {}

    allCards.forEach((card) => {
      if (!card) return
      const text = safeString(card.excerpt).toLowerCase()

      IMPACT_DICTIONARY.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi")
        const matches = text.match(regex)
        if (matches) {
          if (!counts[word]) {
            counts[word] = { count: 0, phrases: [] }
          }
          counts[word].count += matches.length

          // Extract a phrase around the word
          const idx = text.indexOf(word.toLowerCase())
          if (idx !== -1 && counts[word].phrases.length < 2) {
            const start = Math.max(0, idx - 20)
            const end = Math.min(text.length, idx + word.length + 30)
            const phrase = "..." + text.slice(start, end).trim() + "..."
            counts[word].phrases.push(phrase)
          }
        }
      })
    })

    return Object.entries(counts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 4)
      .map(([word, data]) => ({
        label: IMPACT_PHRASE_MAP[word] || word,
        count: data.count,
        phrases: data.phrases,
        strength: data.count >= 3 ? "Core" : data.count >= 2 ? "Strong" : "Emerging",
      }))
  }, [allCards])

  // Don't render if no data
  if (allCards.length === 0 && safeProfileAnalysis.traitSignals.length === 0) {
    return null
  }

  const getStrengthStyle = (strength: string) => {
    switch (strength) {
      case "Core":
        return "bg-emerald-600 text-white"
      case "Strong":
        return "bg-neutral-200 text-neutral-700"
      default:
        return "bg-neutral-100 text-neutral-500"
    }
  }

  const getSourceIcon = (sources: string[]) => {
    if (!sources || sources.length === 0) return null
    const hasNomee = sources.includes("nomee")
    const hasImported = sources.includes("imported")

    if (hasNomee && hasImported) {
      return (
        <span className="flex gap-0.5">
          <MessageSquare className="w-3 h-3 text-sky-500" />
          <Upload className="w-3 h-3 text-amber-500" />
        </span>
      )
    }
    if (hasNomee) return <MessageSquare className="w-3 h-3 text-sky-500" />
    if (hasImported) return <Upload className="w-3 h-3 text-amber-500" />
    return null
  }

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Top Signals */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neutral-700">
              <TrendingUp className="w-4 h-4" />
              <h3 className="font-semibold text-sm">Common themes</h3>
            </div>
            <div className="space-y-2">
              {topSignals.length > 0 ? (
                topSignals.map((signal) => (
                  <Tooltip key={signal.label}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-sm cursor-help">
                        {getSourceIcon(signal.sources)}
                        <span className="text-neutral-700">{signal.label}</span>
                        <span className="text-neutral-400">{signal.count}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStrengthStyle(signal.strength)}`}>
                          {signal.strength}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        Mentioned by {signal.count} {signal.count === 1 ? "person" : "people"}
                      </p>
                      {signal.example && <p className="text-xs text-neutral-400 mt-1 italic">"{signal.example}..."</p>}
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <p className="text-xs text-neutral-400">No signals yet</p>
              )}
            </div>
          </div>

          {/* Most Consistent */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neutral-700">
              <Users className="w-4 h-4" />
              <h3 className="font-semibold text-sm">Most Consistent</h3>
            </div>
            <div className="space-y-2">
              {consistentSignals.length > 0 ? (
                consistentSignals.map((signal) => (
                  <Tooltip key={signal.label}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-sm cursor-help">
                        <Users className="w-3 h-3 text-teal-500" />
                        <span className="text-neutral-700">{signal.label}</span>
                        <span className="text-neutral-400">{signal.count}p</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStrengthStyle(signal.strength)}`}>
                          {signal.strength}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">
                        Mentioned by {signal.count} different {signal.count === 1 ? "person" : "people"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <p className="text-xs text-neutral-400">No consistent signals yet</p>
              )}
            </div>
          </div>

          {/* Proof of Impact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <Zap className="w-4 h-4" />
              <h3 className="font-semibold text-sm">Proof of impact</h3>
            </div>
            <div className="space-y-2">
              {impactSignals.length > 0 ? (
                impactSignals.map((signal) => (
                  <Tooltip key={signal.label}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-sm cursor-help">
                        <MessageSquare className="w-3 h-3 text-amber-500" />
                        <span className="text-amber-700">{signal.label}</span>
                        <span className="text-amber-400">{signal.count}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStrengthStyle(signal.strength)}`}>
                          {signal.strength}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">Found {signal.count} times in feedback</p>
                      {signal.phrases && signal.phrases.length > 0 && (
                        <p className="text-xs text-neutral-400 mt-1 italic">{signal.phrases[0]}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <p className="text-xs text-neutral-400">No impact signals yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
