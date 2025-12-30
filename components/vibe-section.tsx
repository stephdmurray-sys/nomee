"use client"

import { useState, useMemo } from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

// Safe utility functions
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

interface VibeSignal {
  label: string
  count: number
  category?: "work-style" | "impact"
}

interface VibeSectionProps {
  firstName: string
  vibeLabels: string[]
  traitSignals: Array<{ label: string; count: number }>
  totalContributions: number
  totalUploads: number
}

// Work Style vibes taxonomy
const WORK_STYLE_VIBES = [
  "Team-Builder",
  "Calm Presence",
  "Strategic Partner",
  "Grounded",
  "Empowering",
  "Coaching",
  "Open And Collaborative",
  "Supportive",
  "Focused",
  "Thoughtful",
  "Organized",
  "Detail-oriented",
  "Creative",
  "Reliable",
  "Patient",
  "Clear communicator",
  "Analytical",
  "Authentic",
]

// Impact vibes taxonomy
const IMPACT_VIBES = [
  "Proactive",
  "Results-driven",
  "Transformative",
  "Strategic",
  "Innovative",
  "Problem solver",
  "Accountable",
  "Calm under pressure",
  "Level-headed",
  "Empathetic",
  "Visionary",
  "Collaborative",
]

// Get strength tier based on count
function getStrengthTier(count: number, maxCount: number): "Core" | "Strong" | "Emerging" {
  if (count >= 3 || count >= maxCount * 0.8) return "Core"
  if (count >= 2) return "Strong"
  return "Emerging"
}

// Get pill styles based on strength tier
function getPillStyles(tier: "Core" | "Strong" | "Emerging", isSelected: boolean) {
  if (isSelected) {
    return "bg-blue-100 border-blue-300 text-blue-800 font-medium"
  }

  switch (tier) {
    case "Core":
      return "bg-neutral-100 border-neutral-300 text-neutral-900 font-medium"
    case "Strong":
      return "bg-neutral-50 border-neutral-200 text-neutral-700 font-medium"
    case "Emerging":
      return "bg-white border-neutral-200 text-neutral-500"
  }
}

export function VibeSection({
  firstName,
  vibeLabels,
  traitSignals,
  totalContributions,
  totalUploads,
}: VibeSectionProps) {
  const [activeTab, setActiveTab] = useState<"work-style" | "impact">("work-style")

  // Combine vibeLabels and traitSignals into categorized vibes
  const vibeSignals = useMemo(() => {
    const signals: VibeSignal[] = []
    const seen = new Set<string>()

    // Add from traitSignals first (these have counts)
    safeArray(traitSignals).forEach((signal) => {
      if (!signal?.label || seen.has(signal.label.toLowerCase())) return
      seen.add(signal.label.toLowerCase())

      const isWorkStyle = WORK_STYLE_VIBES.some((v) => v.toLowerCase() === signal.label.toLowerCase())
      const isImpact = IMPACT_VIBES.some((v) => v.toLowerCase() === signal.label.toLowerCase())

      if (isWorkStyle || isImpact) {
        signals.push({
          label: signal.label,
          count: signal.count,
          category: isWorkStyle ? "work-style" : "impact",
        })
      }
    })

    // Add from vibeLabels (default count of 1 if not already added)
    safeArray(vibeLabels).forEach((label) => {
      if (!label || seen.has(label.toLowerCase())) return
      seen.add(label.toLowerCase())

      const isWorkStyle = WORK_STYLE_VIBES.some((v) => v.toLowerCase() === label.toLowerCase())
      const isImpact = IMPACT_VIBES.some((v) => v.toLowerCase() === label.toLowerCase())

      if (isWorkStyle || isImpact) {
        signals.push({
          label,
          count: 1,
          category: isWorkStyle ? "work-style" : "impact",
        })
      }
    })

    return signals.sort((a, b) => b.count - a.count)
  }, [traitSignals, vibeLabels])

  const workStyleVibes = vibeSignals.filter((v) => v.category === "work-style").slice(0, 10)
  const impactVibes = vibeSignals.filter((v) => v.category === "impact").slice(0, 10)

  const currentVibes = activeTab === "work-style" ? workStyleVibes : impactVibes
  const maxCount = Math.max(...currentVibes.map((v) => v.count), 1)

  // Don't render if no vibes
  if (vibeSignals.length === 0) return null

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-serif text-neutral-900 mb-1">Vibe</h2>
          <p className="text-sm text-neutral-500">A quick read on what it's like to work with {firstName}.</p>
        </div>

        {/* Segmented Control */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-neutral-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab("work-style")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === "work-style"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Work Style
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === "impact"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Impact
            </button>
          </div>
        </div>

        {/* Vibe Pills */}
        <TooltipProvider>
          <div className="flex flex-wrap justify-center gap-2">
            {currentVibes.map((vibe) => {
              const tier = getStrengthTier(vibe.count, maxCount)
              const styles = getPillStyles(tier, false)

              return (
                <Tooltip key={vibe.label}>
                  <TooltipTrigger asChild>
                    <span className={`px-3 py-1.5 rounded-full text-sm border cursor-default transition-all ${styles}`}>
                      {vibe.label} <span className="text-neutral-400 ml-0.5">{vibe.count}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{tier}</p>
                    <p className="text-xs text-neutral-400">Mentioned by {vibe.count} people</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}

            {currentVibes.length === 0 && (
              <p className="text-neutral-400 text-sm">
                No {activeTab === "work-style" ? "work style" : "impact"} signals yet.
              </p>
            )}
          </div>
        </TooltipProvider>
      </div>
    </section>
  )
}
