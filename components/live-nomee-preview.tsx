"use client"

import { useState, useEffect } from "react"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"
import { Play, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const contributions = [
  {
    quote:
      "Maya asks questions that make you think differently about the problem. Her thoughtful approach to complex challenges helped us uncover insights we never would have found otherwise.",
    name: "Quinn Davis",
    company: "ResearchLab",
    relationship: "Other",
    hasVoice: false,
    traits: ["Thoughtful", "Curious", "Analytical"],
  },
  {
    quote:
      "In high-pressure situations, Maya is the person you want in the room. She stays calm, asks the right questions, and helps everyone think more clearly.",
    name: "Morgan Lee",
    company: "Enterprise Inc",
    relationship: "Manager",
    hasVoice: true,
    voiceDuration: "0:38",
    traits: ["Calm under pressure", "Level-headed", "Clear communicator"],
  },
  {
    quote:
      "Maya creates such a safe space for creative exploration. She encouraged us to think bigger while keeping us grounded in what was actually possible.",
    name: "Casey Wong",
    company: "Creative Co",
    relationship: "Client",
    hasVoice: false,
    traits: ["Encouraging", "Supportive", "Collaborative"],
  },
  {
    quote:
      "Maya's organizational skills are next level. She took our chaotic project and created a system that actually worked.",
    name: "Riley Parker",
    company: "AgileTech",
    relationship: "Direct Report",
    hasVoice: true,
    voiceDuration: "0:42",
    traits: ["Organized", "Systematic", "Clear communicator"],
  },
  {
    quote:
      "Maya has this gift for seeing both the forest and the trees. She caught details that would have derailed our launch.",
    name: "Taylor Kim",
    company: "ConsultGroup",
    relationship: "Other",
    hasVoice: true,
    voiceDuration: "0:48",
    traits: ["Detail-oriented", "Strategic", "Thorough"],
  },
]

const allTraits = [
  { trait: "Thoughtful", count: 5 },
  { trait: "Strategic", count: 5 },
  { trait: "Patient", count: 4 },
  { trait: "Calm under pressure", count: 5 },
  { trait: "Organized", count: 4 },
  { trait: "Clear communicator", count: 4 },
  { trait: "Proactive", count: 3 },
  { trait: "Analytical", count: 3 },
  { trait: "Detail-oriented", count: 3 },
  { trait: "Collaborative", count: 3 },
  { trait: "Empathetic", count: 3 },
  { trait: "Reliable", count: 2 },
]

export function LiveNomeePreview() {
  const [visibleContributions, setVisibleContributions] = useState([0, 1, 2])
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredTrait, setHoveredTrait] = useState<number | null>(null)

  // Auto-rotate contributions
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleContributions((prev) => {
        const nextIndex = (prev[0] + 3) % contributions.length
        return [nextIndex, (nextIndex + 1) % contributions.length, (nextIndex + 2) % contributions.length]
      })
    }, 5500)

    return () => clearInterval(interval)
  }, [])

  const summaryText =
    "Those who've worked with Maya Torres often mention her thoughtful approach, strategic mindset, and calm presence under pressure. She brings deep analytical thinking while creating space for collaboration and creative exploration."
  const summaryPreview = summaryText.slice(0, 140) + "..."

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">Live Nomee Preview</h3>
        <p className="text-xs text-slate-500">12 contributions • 7 voice notes • updated today</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Summary block */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">How it feels to work with Maya</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {isExpanded ? summaryText : summaryPreview}{" "}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          </p>
        </div>

        {/* Scrolling trait pills */}
        <div className="relative overflow-hidden">
          <div className="flex gap-2 animate-scroll-slow hover:pause-animation">
            {[...allTraits, ...allTraits].map((item, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setHoveredTrait(idx)}
                onMouseLeave={() => setHoveredTrait(null)}
                className={`px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium whitespace-nowrap transition-transform ${
                  hoveredTrait === idx ? "scale-110" : "scale-100"
                }`}
              >
                {item.trait} ×{item.count}
              </button>
            ))}
          </div>
        </div>

        {/* Contributions feed */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {visibleContributions.map((index) => {
              const contribution = contributions[index]
              const keywords = extractKeywordsFromText(contribution.quote, contribution.traits)
              const highlightPatterns = keywords
                .filter((keyword) => typeof keyword === "string" && keyword.trim().length > 0)
                .slice(0, 3)
                .map((keyword) => ({
                  phrase: keyword,
                  tier: "theme" as const,
                  frequency: 1,
                }))

              return (
                <motion.div
                  key={`${contribution.name}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-3"
                >
                  {/* Contribution header with voice chip */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-slate-900">{contribution.name}</p>
                      <p className="text-xs text-slate-500">
                        {contribution.relationship} · {contribution.company}
                      </p>
                    </div>
                    {contribution.hasVoice && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full">
                        <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
                        <span className="text-xs font-medium text-blue-600">{contribution.voiceDuration}</span>
                      </div>
                    )}
                  </div>

                  {/* Quote with highlights (2 lines max) */}
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
                    {highlightQuote(contribution.quote, highlightPatterns, 3)}
                  </p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Voice strip */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-medium text-slate-600">Voice notes:</span>
          {[
            { duration: "0:38", id: 1 },
            { duration: "0:42", id: 2 },
            { duration: "0:48", id: 3 },
          ].map((voice) => (
            <div
              key={voice.id}
              className="group flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-slate-400 group-hover:bg-blue-500 rounded-full transition-colors"
                    style={{
                      height: `${Math.random() * 8 + 4}px`,
                      animation: "none",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-slate-600">{voice.duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        <Link
          href="/maya-torres"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
        >
          See full Nomee
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
