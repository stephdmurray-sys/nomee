"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface TraitWithCount {
  label: string
  count: number
}

export function LivingProofStream({ traits }: { traits: TraitWithCount[] }) {
  const [isPaused, setIsPaused] = useState(false)

  const sortedTraits = [...traits].sort((a, b) => b.count - a.count)
  const maxCount = sortedTraits[0]?.count || 1

  const displayTraits = [...sortedTraits, ...sortedTraits, ...sortedTraits]

  const getTraitSize = (count: number): string => {
    const percentage = (count / maxCount) * 100
    if (percentage >= 60) return "text-7xl md:text-9xl font-black"
    if (percentage >= 40) return "text-6xl md:text-8xl font-bold"
    if (percentage >= 25) return "text-5xl md:text-7xl font-semibold"
    return "text-4xl md:text-6xl font-medium"
  }

  const getOpacity = (count: number): string => {
    const percentage = (count / maxCount) * 100
    if (percentage >= 60) return "opacity-100"
    if (percentage >= 40) return "opacity-90"
    if (percentage >= 25) return "opacity-75"
    return "opacity-60"
  }

  return (
    <div className="relative overflow-hidden py-32 md:py-48">
      <motion.div
        className="flex gap-16 md:gap-24"
        animate={{
          x: isPaused ? undefined : [0, "-33.33%"],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 60,
            ease: "linear",
          },
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {displayTraits.map((trait, index) => (
          <motion.div
            key={`${trait.label}-${index}`}
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              scale: 1.12,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <div
              className={`
              ${getTraitSize(trait.count)}
              ${getOpacity(trait.count)}
              text-near-black tracking-tight whitespace-nowrap
              transition-all duration-300
              hover:text-quiet-indigo cursor-default
            `}
            >
              {trait.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  )
}
