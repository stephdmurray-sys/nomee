"use client"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface TraitWithCount {
  label: string
  count: number
  category: string
  examples: string[]
}

export function LanguageHeatmap({
  traits,
  totalCount,
  selectedTraits,
  selectedRelationship,
  onTraitSelect,
  onTraitHover,
}: {
  traits: TraitWithCount[]
  totalCount: number
  selectedTraits: string[]
  selectedRelationship?: string | null
  onTraitSelect: (trait: string | null) => void
  onTraitHover?: (trait: string | null) => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const sortedTraits = [...traits].sort((a, b) => b.count - a.count).slice(0, 12)
  const maxCount = sortedTraits[0]?.count || 1

  const getTier = (index: number): 1 | 2 | 3 => {
    if (index < 3) return 1
    if (index < 8) return 2
    return 3
  }

  const getTierStyles = (tier: 1 | 2 | 3, isSelected: boolean) => {
    if (isSelected) {
      return {
        size: "text-4xl md:text-5xl",
        weight: "font-bold",
        color: "text-neutral-950",
        borderWidth: "border-2",
        borderColor: "border-neutral-900",
      }
    }

    switch (tier) {
      case 1:
        return {
          size: "text-5xl md:text-6xl lg:text-7xl",
          weight: "font-bold",
          color: "text-neutral-950",
          borderWidth: "border-2",
          borderColor: "border-neutral-300",
        }
      case 2:
        return {
          size: "text-3xl md:text-4xl",
          weight: "font-semibold",
          color: "text-neutral-500",
          borderWidth: "border",
          borderColor: "border-neutral-250",
        }
      case 3:
        return {
          size: "text-2xl md:text-2xl",
          weight: "font-normal",
          color: "text-neutral-350",
          borderWidth: "border",
          borderColor: "border-neutral-200",
        }
    }
  }

  const baseDelay = isVisible ? 0.1 : 0

  const getPastelAccent = (index: number) => {
    if (index >= 3) return null

    const accents = ["rgba(250, 247, 243, 0.08)", "rgba(244, 247, 251, 0.08)", "rgba(246, 250, 247, 0.08)"]
    return accents[index]
  }

  return (
    <section className="w-full bg-white" ref={sectionRef}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap gap-x-8 gap-y-6 items-center justify-center leading-tight">
          {sortedTraits.map((trait, index) => {
            const tier = getTier(index)
            const isSelected = selectedTraits.includes(trait.label)
            const hasOtherSelected = selectedTraits.length > 0 && !isSelected
            const styles = getTierStyles(tier, isSelected)

            const revealDelay =
              tier === 1
                ? baseDelay + index * 0.12
                : tier === 2
                  ? baseDelay + 0.4 + (index - 3) * 0.08
                  : baseDelay + 0.8 + (index - 8) * 0.06

            const pastelAccent = getPastelAccent(index)

            return (
              <motion.button
                key={trait.label}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{
                  opacity: isVisible ? (hasOtherSelected ? 0.2 : 1) : 0,
                  y: isVisible ? 0 : 8,
                  scale: isVisible ? 1 : 0.95,
                }}
                transition={{
                  duration: 0.5,
                  delay: revealDelay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => onTraitSelect(isSelected ? null : trait.label)}
                onMouseEnter={() => onTraitHover?.(trait.label)}
                onMouseLeave={() => onTraitHover?.(null)}
                className={`
                  ${styles.size}
                  ${styles.weight}
                  ${styles.color}
                  ${styles.borderWidth}
                  ${styles.borderColor}
                  px-6 py-3
                  rounded-full
                  bg-white
                  transition-all duration-300
                  hover:border-neutral-600
                  hover:scale-[1.02]
                  cursor-pointer
                  leading-none
                  whitespace-nowrap
                `}
                style={{
                  marginLeft: index % 3 === 1 ? "1rem" : index % 3 === 2 ? "-0.75rem" : "0",
                  backgroundColor: pastelAccent || "white",
                }}
                aria-label={`${trait.label} - mentioned ${trait.count} times`}
              >
                {trait.label}
              </motion.button>
            )
          })}
        </div>

        {selectedTraits.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 text-center">
            <button
              onClick={() => onTraitSelect(null)}
              className="text-xs text-neutral-400 hover:text-neutral-600 font-normal transition-colors underline underline-offset-4"
            >
              Clear
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
