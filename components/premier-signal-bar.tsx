"use client"

import { useMemo } from "react"
import { TrendingUp, Users, Zap } from "lucide-react"

interface PremierSignalBarProps {
  allCards: Array<{
    id: string
    excerpt: string
    traits: string[]
    type: "nomee" | "imported"
    contributorId?: string
  }>
  traitSignals: Array<{ label: string; count: number }>
  totalContributions: number
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

export function PremierSignalBar({ allCards, traitSignals, totalContributions }: PremierSignalBarProps) {
  // Compute signals from cards
  const signals = useMemo(() => {
    // Top Signals: most frequently mentioned traits (3-6)
    const topSignals = traitSignals.slice(0, 6).map((s) => ({
      label: s.label,
      count: s.count,
    }))

    // Most Consistent: traits appearing across the most unique contributors
    const traitByContributor: Record<string, Set<string>> = {}
    allCards.forEach((card) => {
      const contributorKey = card.contributorId || card.id
      card.traits.forEach((trait) => {
        if (!traitByContributor[trait]) {
          traitByContributor[trait] = new Set()
        }
        traitByContributor[trait].add(contributorKey)
      })
    })

    const consistentSignals = Object.entries(traitByContributor)
      .map(([trait, contributors]) => ({ label: trait, contributors: contributors.size }))
      .sort((a, b) => b.contributors - a.contributors)
      .slice(0, 4)
      .filter((s) => s.contributors >= 2)

    // Impact Signals: verbs/outcomes from excerpts
    const impactCounts: Record<string, number> = {}
    allCards.forEach((card) => {
      const textLower = card.excerpt.toLowerCase()
      IMPACT_DICTIONARY.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi")
        const matches = textLower.match(regex)
        if (matches) {
          impactCounts[word] = (impactCounts[word] || 0) + matches.length
        }
      })
    })

    const impactSignals = Object.entries(impactCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([word, count]) => ({ label: word, count }))

    return { topSignals, consistentSignals, impactSignals }
  }, [allCards, traitSignals])

  // Fallback if not enough data
  if (totalContributions < 3 || signals.topSignals.length === 0) {
    return (
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center">
        <p className="text-sm text-neutral-500">Signals will appear after 3+ contributions.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
        {/* Top Signals */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-semibold text-neutral-900">Top Signals</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {signals.topSignals.map((signal) => (
              <span
                key={signal.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {signal.label}
                <span className="text-blue-500">{signal.count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Most Consistent */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-semibold text-neutral-900">Most Consistent</h4>
          </div>
          {signals.consistentSignals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {signals.consistentSignals.map((signal) => (
                <span
                  key={signal.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  {signal.label}
                  <span className="text-emerald-500">{signal.contributors}p</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500">Need 2+ contributors per signal</p>
          )}
        </div>

        {/* Impact Signals */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-neutral-900">Impact Signals</h4>
          </div>
          {signals.impactSignals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {signals.impactSignals.map((signal) => (
                <span
                  key={signal.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100"
                >
                  {signal.label}
                  <span className="text-amber-500">{signal.count}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500">No impact verbs detected</p>
          )}
        </div>
      </div>
    </div>
  )
}
