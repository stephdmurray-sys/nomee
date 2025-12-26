"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface PatternInMotionProps {
  contributions: any[]
  tier1Traits: string[]
  tier2Traits: string[]
}

export function PatternInMotion({ contributions, tier1Traits, tier2Traits }: PatternInMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [phrases, setPhrases] = useState<{ text: string; frequency: number; tier: 1 | 2 }[]>([])

  useEffect(() => {
    // Extract repeated phrases (4-8 words) from contributions
    const extractRepeatedPhrases = () => {
      const phraseMap = new Map<string, { count: number; tier: 1 | 2 }>()
      const tierTraits = [...tier1Traits, ...tier2Traits]

      for (const contribution of contributions) {
        if (!contribution.written_note) continue

        const text = contribution.written_note.toLowerCase()
        const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10)

        for (const sentence of sentences) {
          // Extract 4-8 word phrases
          const words = sentence.trim().split(/\s+/)

          for (let i = 0; i <= words.length - 4; i++) {
            for (let len = 4; len <= Math.min(8, words.length - i); len++) {
              const phrase = words
                .slice(i, i + len)
                .join(" ")
                .trim()

              // Only include if phrase contains a tier trait
              const containsTier1 = tier1Traits.some((t) => phrase.includes(t.toLowerCase()))
              const containsTier2 = tier2Traits.some((t) => phrase.includes(t.toLowerCase()))

              if (containsTier1 || containsTier2) {
                const tier = containsTier1 ? 1 : 2
                const existing = phraseMap.get(phrase)

                if (existing) {
                  phraseMap.set(phrase, { count: existing.count + 1, tier: Math.min(existing.tier, tier) as 1 | 2 })
                } else {
                  phraseMap.set(phrase, { count: 1, tier })
                }
              }
            }
          }
        }
      }

      // Filter to only repeated phrases (count > 1) and sort by frequency
      const repeatedPhrases = Array.from(phraseMap.entries())
        .filter(([_, data]) => data.count > 1)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 12)
        .map(([text, data]) => ({
          text,
          frequency: data.count,
          tier: data.tier,
        }))

      // Duplicate phrases based on frequency for repetition in the rail
      const expandedPhrases: typeof repeatedPhrases = []
      for (const phrase of repeatedPhrases) {
        const repetitions = Math.min(phrase.frequency, 3) // Repeat high-frequency phrases
        for (let i = 0; i < repetitions; i++) {
          expandedPhrases.push(phrase)
        }
      }

      // Shuffle to avoid back-to-back repetition
      for (let i = expandedPhrases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[expandedPhrases[i], expandedPhrases[j]] = [expandedPhrases[j], expandedPhrases[i]]
      }

      return expandedPhrases
    }

    setPhrases(extractRepeatedPhrases())
  }, [contributions, tier1Traits, tier2Traits])

  if (phrases.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden bg-white py-6 border-y border-neutral-100">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling rail */}
      <motion.div
        ref={containerRef}
        className="flex gap-8 items-center"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 60,
            ease: "linear",
          },
        }}
        whileHover="paused"
        style={{ willChange: "transform" }}
      >
        {/* Duplicate phrases for seamless loop */}
        {[...phrases, ...phrases, ...phrases].map((phrase, index) => {
          const opacity = phrase.tier === 1 ? 0.5 : 0.35
          const weight = phrase.tier === 1 ? "font-medium" : "font-normal"

          return (
            <span
              key={`${phrase.text}-${index}`}
              className={`text-sm md:text-base text-neutral-400 ${weight} whitespace-nowrap relative`}
              style={{
                opacity,
              }}
            >
              {phrase.text}
              {phrase.tier === 1 && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(200,200,200,0.15), transparent)",
                  }}
                />
              )}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}
