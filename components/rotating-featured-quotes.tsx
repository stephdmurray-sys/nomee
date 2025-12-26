"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Contribution {
  id: string
  written_note: string
  contributor_name: string
  relationship: string
  traits_category1?: string[]
  traits_category2?: string[]
  traits_category3?: string[]
  traits_category4?: string[]
}

interface RotatingFeaturedQuotesProps {
  contributions: Contribution[]
  heatmapTraits: string[]
  tier1Traits: string[] // Added Tier 1 traits for filtering
}

export function RotatingFeaturedQuotes({ contributions, heatmapTraits, tier1Traits }: RotatingFeaturedQuotesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const extractShortQuote = (text: string): string => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

    // Return just first sentence
    const firstSentence = sentences[0].trim()

    // If first sentence is too long, truncate it
    if (firstSentence.length > 120) {
      return firstSentence.substring(0, 120).trim() + "..."
    }

    return firstSentence
  }

  const selectFeaturedQuotes = () => {
    const validQuotes = contributions
      .filter((c) => {
        if (!c.written_note) return false

        const allTraits = [
          ...(c.traits_category1 || []),
          ...(c.traits_category2 || []),
          ...(c.traits_category3 || []),
          ...(c.traits_category4 || []),
        ]

        // Must contain at least one Tier 1 trait
        const hasTier1Match = tier1Traits.some((trait) => allTraits.includes(trait))

        return hasTier1Match
      })
      .map((c) => {
        const allTraits = [
          ...(c.traits_category1 || []),
          ...(c.traits_category2 || []),
          ...(c.traits_category3 || []),
          ...(c.traits_category4 || []),
        ]

        const tier1MatchCount = tier1Traits.filter((trait) => allTraits.includes(trait)).length

        return { ...c, tier1MatchCount }
      })
      .sort((a, b) => b.tier1MatchCount - a.tier1MatchCount)

    // Try to get diverse relationship types
    const selected: Contribution[] = []
    const usedRelationships = new Set<string>()

    for (const quote of validQuotes) {
      if (selected.length >= 3) break

      const relationship = quote.relationship?.toLowerCase() || ""
      if (!usedRelationships.has(relationship) || selected.length < 2) {
        selected.push(quote)
        usedRelationships.add(relationship)
      }
    }

    // If we don't have enough, add more
    if (selected.length < 2) {
      validQuotes.slice(0, 3).forEach((q) => {
        if (!selected.find((s) => s.id === q.id)) {
          selected.push(q)
        }
      })
    }

    return selected.slice(0, 3)
  }

  const featuredQuotes = selectFeaturedQuotes()

  useEffect(() => {
    if (isPaused || featuredQuotes.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredQuotes.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isPaused, featuredQuotes.length])

  if (featuredQuotes.length === 0) return null

  const currentQuote = featuredQuotes[currentIndex]
  const shortQuote = extractShortQuote(currentQuote.written_note)

  const highlightText = (text: string) => {
    const words = text.split(/(\s+)/)
    const matchedTier1Traits = tier1Traits
      .filter((trait) => text.toLowerCase().includes(trait.toLowerCase()))
      .slice(0, 2)

    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, "").toLowerCase()
      const isMatch = matchedTier1Traits.some((trait) => cleanWord === trait.toLowerCase())

      if (isMatch) {
        return (
          <span
            key={index}
            className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4"
          >
            {word}
          </span>
        )
      }
      return <span key={index}>{word}</span>
    })
  }

  const formatRelationship = (relationship: string) => {
    const rel = relationship?.toLowerCase() || ""
    if (rel.includes("client")) return "Client"
    if (rel.includes("peer") || rel.includes("together")) return "Peer"
    if (rel.includes("manager")) return "Manager"
    if (rel.includes("partner")) return "Partner"
    if (rel.includes("direct")) return "Direct Report"
    return "Collaborator"
  }

  const pastelColors = [
    "bg-neutral-50/80", // light grey
    "bg-blue-50/50", // light light blue
    "bg-purple-50/40", // light light purple
  ]

  const currentColor = pastelColors[currentIndex % pastelColors.length]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="min-h-[280px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`${currentColor} rounded-3xl p-8 md:p-12 transition-colors duration-700 ease-in-out max-w-3xl mx-auto border border-neutral-100/50`}
          >
            <blockquote className="text-lg leading-relaxed text-neutral-700 mb-6 font-normal md:text-xl lg:text-2xl text-center">
              {highlightText(shortQuote)}
            </blockquote>

            <div className="flex items-center justify-center gap-2 text-sm text-neutral-400 mb-6">
              <span>{currentQuote.contributor_name}</span>
              <span>·</span>
              <span>{formatRelationship(currentQuote.relationship)}</span>
            </div>

            {featuredQuotes.length > 1 && (
              <div className="flex items-center justify-center gap-1.5">
                {featuredQuotes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-neutral-400 w-4" : "bg-neutral-200 hover:bg-neutral-300"
                    }`}
                    aria-label={`Go to quote ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
