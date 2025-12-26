"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface ScrollingHighlightPhrasesProps {
  contributions: any[]
  onPhraseClick?: (phrase: string) => void
  selectedPhrase?: string | null
}

export function ScrollingHighlightPhrases({
  contributions,
  onPhraseClick,
  selectedPhrase,
}: ScrollingHighlightPhrasesProps) {
  const [isPaused, setIsPaused] = useState(false)

  const extractPhrases = () => {
    const phraseCount: Record<string, number> = {}
    const allText = contributions
      .map((c) => c.written_note || "")
      .join(" ")
      .toLowerCase()

    // Extract all trait mentions
    contributions.forEach((contribution) => {
      const allTraits = [
        ...(contribution.traits_category1 || []),
        ...(contribution.traits_category2 || []),
        ...(contribution.traits_category3 || []),
        ...(contribution.traits_category4 || []),
      ]

      allTraits.forEach((trait) => {
        const normalizedTrait = trait.toLowerCase()
        phraseCount[normalizedTrait] = (phraseCount[normalizedTrait] || 0) + 1
      })
    })

    // Also look for common descriptive phrases in text
    const commonPhrases = [
      "easy to work with",
      "highly reliable",
      "goes above and beyond",
      "excellent communicator",
      "team player",
      "problem solver",
      "detail oriented",
      "responsive",
      "collaborative",
      "professional",
      "creative thinker",
      "strategic partner",
      "trusted advisor",
      "clear direction",
      "organized",
      "proactive",
      "thoughtful",
      "results driven",
    ]

    commonPhrases.forEach((phrase) => {
      const regex = new RegExp(phrase.replace(/\s+/g, "\\s+"), "gi")
      const matches = allText.match(regex)
      if (matches && matches.length >= 2) {
        phraseCount[phrase] = matches.length
      }
    })

    return Object.entries(phraseCount)
      .filter(([, count]) => count >= 2)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12)
      .map(([phrase, count]) => ({ phrase, count }))
  }

  const phrases = extractPhrases()

  if (phrases.length === 0) return null

  const duplicatedPhrases = [...phrases, ...phrases, ...phrases]

  return (
    <div className="w-full overflow-hidden bg-white border-y border-neutral-200 py-6">
      <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <motion.div
          className="flex gap-3"
          animate={{
            x: isPaused ? undefined : [0, -1200],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {duplicatedPhrases.map((item, idx) => {
            const opacity = Math.min(0.6 + item.count * 0.1, 1)
            const fontSize = item.count >= 5 ? "text-lg" : item.count >= 3 ? "text-base" : "text-sm"
            const fontWeight = item.count >= 5 ? "font-semibold" : item.count >= 3 ? "font-medium" : "font-normal"
            const isSelected = selectedPhrase === item.phrase

            return (
              <button
                key={`${item.phrase}-${idx}`}
                onClick={() => onPhraseClick?.(item.phrase)}
                className={`
                  whitespace-nowrap px-5 py-2.5 rounded-full transition-all ${fontSize} ${fontWeight}
                  ${isSelected ? "bg-neutral-900 text-white shadow-md scale-105" : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:shadow-sm"}
                  border border-neutral-200
                `}
                style={{
                  opacity: isSelected ? 1 : opacity,
                }}
              >
                {item.phrase}
              </button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
