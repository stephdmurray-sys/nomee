"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Contribution {
  id: string
  written_note: string
  relationship: string
  traits_category1?: string[]
  traits_category2?: string[]
  traits_category3?: string[]
  traits_category4?: string[]
}

interface FinalResolutionProps {
  contributions: Contribution[]
  topTraits: { label: string; count: number }[]
  profileName: string
}

export function FinalResolution({ contributions, topTraits, profileName }: FinalResolutionProps) {
  const [resolution, setResolution] = useState<string | null>(null)

  useEffect(() => {
    generateResolution()
  }, [contributions, topTraits])

  const generateResolution = () => {
    if (contributions.length === 0 || topTraits.length === 0) return

    // Extract Tier 1 traits (top 3)
    const tier1Traits = topTraits.slice(0, 3).map((t) => t.label.toLowerCase())

    // Find repeated phrases by analyzing testimonials
    const phrasePatterns: Record<string, number> = {}

    contributions.forEach((c) => {
      const text = c.written_note.toLowerCase()

      // Extract meaningful action patterns
      const patterns = [
        /brings [\w\s]{4,25}/g,
        /makes [\w\s]{4,25}/g,
        /shows up [\w\s]{4,25}/g,
        /keeps [\w\s]{4,25}/g,
        /creates [\w\s]{4,25}/g,
        /helps [\w\s]{4,25}/g,
        /delivers [\w\s]{4,25}/g,
      ]

      patterns.forEach((pattern) => {
        const matches = text.match(pattern)
        if (matches) {
          matches.forEach((match) => {
            const cleaned = match.trim().slice(0, 50)
            phrasePatterns[cleaned] = (phrasePatterns[cleaned] || 0) + 1
          })
        }
      })
    })

    // Get the most repeated phrases (mentioned 2+ times)
    const repeatedPhrases = Object.entries(phrasePatterns)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([phrase]) => phrase)

    // Analyze relationship patterns
    const clientContributions = contributions.filter((c) => c.relationship?.toLowerCase().includes("client"))
    const peerContributions = contributions.filter(
      (c) => c.relationship?.toLowerCase().includes("peer") || c.relationship?.toLowerCase().includes("together"),
    )

    // Build resolution sentences
    const sentences: string[] = []

    // Sentence 1: Overall experience
    if (tier1Traits.length >= 2) {
      const firstName = profileName.split(" ")[0]
      sentences.push(
        `Working with ${firstName} tends to be described as ${tier1Traits[0]} and ${tier1Traits[1]}, with a consistent thread of ${tier1Traits[2] || "reliability"}.`,
      )
    }

    // Sentence 2: How it shows up in practice
    if (repeatedPhrases.length > 0) {
      sentences.push(
        `In practice, people note that they ${repeatedPhrases[0].replace(/^(brings|makes|shows up|keeps|creates|helps|delivers)\s/, "")}.`,
      )
    } else if (tier1Traits.length > 0) {
      sentences.push(
        `This shows up most clearly in their ability to maintain ${tier1Traits[0]} across different projects and teams.`,
      )
    }

    // Sentence 3: Optional relationship nuance
    if (clientContributions.length >= 2 && peerContributions.length >= 2) {
      const totalClients = clientContributions.length
      const totalPeers = peerContributions.length

      if (totalClients > totalPeers * 1.5) {
        sentences.push(`Clients particularly emphasize these patterns.`)
      } else if (totalPeers > totalClients * 1.5) {
        sentences.push(`Peers particularly emphasize these patterns.`)
      } else {
        sentences.push(`The patterns hold across both client and peer relationships.`)
      }
    }

    setResolution(sentences.slice(0, 3).join(" "))
  }

  if (!resolution) return null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full py-16 px-6"
    >
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">What this adds up to</h2>
          <p className="text-xs text-neutral-400">AI-synthesized from recurring themes across collaborators</p>
        </div>

        <p className="text-base md:text-lg text-neutral-700 leading-relaxed text-center">{resolution}</p>
      </div>
    </motion.section>
  )
}
