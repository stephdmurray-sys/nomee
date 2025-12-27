"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FloatingQuoteCards } from "./floating-quote-cards"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function RealNomeeSlice() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Sample data from Maya Torres' actual Nomee
  const contributions = [
    {
      id: "1",
      contributor_name: "Riley Parker",
      contributor_company: "AgileTech",
      relationship: "direct_report",
      written_note:
        "Maya's organizational skills are next level. She took our chaotic project and created a system that actually worked. Everyone knew what they were doing and why it mattered.",
      traits_category1: ["Thoughtful", "Strategic thinking"],
      traits_category2: ["Organized", "Systematic"],
      traits_category3: ["Clear communicator"],
      traits_category4: [],
      voice_url: null,
    },
    {
      id: "2",
      contributor_name: "Taylor Kim",
      contributor_company: "ConsultGroup",
      relationship: "other",
      written_note:
        "Maya has this gift for seeing both the forest and the trees. She caught details that would have derailed our launch while never losing sight of the bigger strategic picture. Truly impressive.",
      traits_category1: ["Strategic thinking"],
      traits_category2: ["Detail-oriented"],
      traits_category3: ["Thorough"],
      traits_category4: ["Proactive"],
      voice_url: null,
    },
    {
      id: "3",
      contributor_name: "Alex Rivera",
      contributor_company: "NutriTrack",
      relationship: "colleague",
      written_note:
        "In high-pressure situations, Maya is the person you want in the room. She stays calm, asks the right questions, and helps everyone think more clearly. Her presence elevates the whole team.",
      traits_category1: ["Calm under pressure"],
      traits_category2: ["Level-headed", "Clear communicator"],
      traits_category3: [],
      traits_category4: [],
      voice_url: null,
    },
  ]

  const topTraits = [
    { label: "Thoughtful", count: 5 },
    { label: "Strategic", count: 5 },
    { label: "Patient", count: 4 },
    { label: "Calm under pressure", count: 5 },
    { label: "Organized", count: 4 },
    { label: "Clear communicator", count: 4 },
  ]

  // Auto-rotate top card every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % contributions.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [contributions.length])

  const visibleContributions = [
    contributions[currentCardIndex],
    contributions[(currentCardIndex + 1) % contributions.length],
  ]

  return (
    <div className="relative">
      {/* Framed container with cropping */}
      <div
        className="relative rounded-2xl border border-neutral-200 shadow-xl overflow-hidden bg-white"
        style={{ maxHeight: "600px" }}
      >
        {/* Scrollable content area */}
        <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
          <div className="p-8 space-y-8">
            {/* A. Summary section (real component style) */}
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-medium text-neutral-600 leading-snug">
                What consistently shows up about working with Maya
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Thoughtful", "Strategic", "Patient"].map((trait, idx) => (
                  <span
                    key={trait}
                    className="inline-block text-2xl md:text-3xl font-bold text-neutral-900 px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor:
                        idx === 0
                          ? "rgba(59, 130, 246, 0.15)"
                          : idx === 1
                            ? "rgba(59, 130, 246, 0.10)"
                            : "rgba(59, 130, 246, 0.06)",
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* B. Trait pills (real component) */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-neutral-900">Pattern Recognition</h4>
              <div className="flex flex-wrap gap-2">
                {topTraits.slice(0, 6).map((trait) => (
                  <button
                    key={trait.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white hover:bg-blue-50/30 transition-all"
                  >
                    <span className="text-sm font-semibold text-neutral-800">{trait.label}</span>
                    <span className="text-xs font-semibold text-neutral-500">×{trait.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* C. Contributions feed (real component with auto-rotation) */}
            <div className="space-y-6">
              <motion.div
                key={currentCardIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                <FloatingQuoteCards contributions={visibleContributions} />
              </motion.div>
            </div>

            {/* Partial card cutoff (intentional cropping indicator) */}
            <div className="h-16 bg-gradient-to-b from-transparent to-white/80" />
          </div>
        </div>

        {/* Fade overlay at bottom to indicate cropping */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none" />
      </div>

      {/* CTA below preview */}
      <div className="mt-6 text-center">
        <Link
          href="/maya-torres"
          className="inline-flex items-center gap-2 text-base font-medium text-neutral-700 hover:text-neutral-900 transition-colors group"
        >
          View full Nomee
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
