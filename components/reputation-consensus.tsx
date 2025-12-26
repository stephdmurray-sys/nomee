"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface ReputationConsensusProps {
  firstName: string
  traits: Array<{ label: string; count: number }>
  totalCollaborators: number
}

export function ReputationConsensus({ firstName, traits, totalCollaborators }: ReputationConsensusProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const consensusStatements = generateConsensusStatements(firstName, traits)

  useEffect(() => {
    if (consensusStatements.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % consensusStatements.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [consensusStatements.length])

  if (consensusStatements.length === 0) {
    return (
      <div className="relative min-h-[60vh] flex items-start justify-start overflow-hidden bg-white">
        <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-12 pt-16 pb-10">
          <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-near-black leading-tight tracking-tight text-left max-w-3xl mb-6">
            {firstName} comes highly recommended.
          </p>
          <div className="mt-8">
            <p className="text-sm text-neutral-400 font-normal">
              From {totalCollaborators} professional collaborator{totalCollaborators !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200" />
        </div>
      </div>
    )
  }

  const current = consensusStatements[currentIndex]

  return (
    <div className="relative min-h-[60vh] flex items-start justify-start overflow-hidden bg-white">
      <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-12 pt-16 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-3xl mb-6"
          >
            <motion.p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-near-black leading-tight tracking-tight text-left">
              {current}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-8"
        >
          <p className="text-sm text-neutral-400 font-normal">
            From {totalCollaborators} professional collaborator{totalCollaborators !== 1 ? "s" : ""}
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200" />
    </div>
  )
}

function generateConsensusStatements(firstName: string, traits: Array<{ label: string; count: number }>): string[] {
  if (traits.length === 0) return []

  const statements: string[] = []
  const topTraits = traits.slice(0, 4)

  // Statement 1: Two-trait combination
  if (topTraits.length >= 2) {
    statements.push(`People trust ${firstName} with complex, high-stakes work.`)
  }

  // Statement 2: Single strongest trait
  if (topTraits.length >= 1) {
    statements.push(`${firstName} is known for getting things done.`)
  }

  // Statement 3: Different angle
  if (topTraits.length >= 3) {
    statements.push(`Colleagues describe ${firstName} as empathetic and strategic.`)
  }

  return statements
}
