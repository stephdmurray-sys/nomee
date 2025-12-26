"use client"

import { useState, useEffect } from "react"

interface Contribution {
  id: string
  message: string
  contributor_name: string
  relationship: string
  company_or_org: string
  contributor_role?: string
}

interface RotatingHeroHighlightProps {
  contributions: Contribution[]
  firstName: string
}

function extractHighlight(message: string): string | null {
  if (!message) return null

  // Remove quotes and normalize whitespace
  const cleanMessage = message
    .replace(/^["']|["']$/g, "")
    .trim()
    .replace(/\s+/g, " ")

  // System text blocklist
  const systemTerms = [
    "signal set",
    "motion should",
    "hover",
    "scroll",
    "heatmap",
    "pick the top",
    "these are the qualities",
    "page loads",
    "examples",
    "clicking a trait",
  ]

  const isSystemText = (text: string): boolean => {
    const lower = text.toLowerCase()
    return systemTerms.some((term) => lower.includes(term))
  }

  // Generate candidate phrases
  const candidates: string[] = []

  // Strategy 1: Split by sentence punctuation
  if (/[.!?;]/.test(cleanMessage)) {
    const sentences = cleanMessage
      .split(/[.!?;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    candidates.push(...sentences)
  }

  // Strategy 2: Split by commas
  if (cleanMessage.includes(",")) {
    const commaParts = cleanMessage
      .split(/,/)
      .map((s) => s.trim())
      .filter(Boolean)
    candidates.push(...commaParts)
  }

  // Strategy 3: Split by coordinating conjunctions
  const conjunctionPattern = /\s+(and|but|so|because)\s+/i
  if (conjunctionPattern.test(cleanMessage)) {
    const conjParts = cleanMessage.split(conjunctionPattern).filter((s) => !/^(and|but|so|because)$/i.test(s.trim()))
    candidates.push(...conjParts.map((s) => s.trim()).filter(Boolean))
  }

  // Strategy 4: Sliding window (12-word chunks, step 6)
  const words = cleanMessage.split(/\s+/)
  if (words.length > 12) {
    for (let i = 0; i <= words.length - 12; i += 6) {
      const chunk = words.slice(i, i + 12).join(" ")
      candidates.push(chunk)
    }
  }

  // Score each candidate
  interface ScoredCandidate {
    text: string
    score: number
  }

  const actionVerbs = [
    "takes",
    "delivers",
    "follows",
    "leads",
    "handles",
    "clarifies",
    "supports",
    "brings",
    "ensures",
    "manages",
    "communicates",
    "solves",
    "builds",
    "creates",
    "drives",
    "maintains",
    "provides",
    "coordinates",
    "facilitates",
    "achieves",
  ]

  const genericPraise = ["great", "amazing", "best", "nice", "awesome", "wonderful", "excellent"]

  const scoredCandidates: ScoredCandidate[] = candidates
    .map((text) => {
      // Filter system text
      if (isSystemText(text)) return null

      const wordCount = text.split(/\s+/).length

      // Reject if too short or too long
      if (wordCount < 6 || wordCount > 20) return null

      // Reject incomplete thoughts
      const lower = text.toLowerCase()
      if (/\s+(and|but|so|because|with|for|in|at|to)$/.test(lower)) return null

      let score = 0

      // Length scoring (8-16 words ideal)
      if (wordCount >= 8 && wordCount <= 16) {
        score += 3
      } else if (wordCount >= 6 && wordCount <= 20) {
        score += 1
      }

      // Action verb bonus
      if (actionVerbs.some((verb) => lower.includes(verb))) {
        score += 2
      }

      // Generic praise penalty (unless paired with behavior)
      const hasGenericPraise = genericPraise.some((praise) => lower.includes(praise))
      const hasBehavior = actionVerbs.some((verb) => lower.includes(verb))
      if (hasGenericPraise && !hasBehavior) {
        score -= 2
      }

      // Complete sentence bonus (starts with capital, has subject-verb)
      if (/^[A-Z]/.test(text) && wordCount >= 8) {
        score += 1
      }

      return { text, score }
    })
    .filter((c): c is ScoredCandidate => c !== null && c.score > 0)

  if (scoredCandidates.length === 0) return null

  // Select best candidate
  scoredCandidates.sort((a, b) => b.score - a.score)
  let bestText = scoredCandidates[0].text

  // Remove leading "Stephanie is/was" if it helps readability
  bestText = bestText.replace(/^(Stephanie|stephanie)\s+(is|was)\s+/i, "").trim()

  // Ensure it starts with a capital letter
  bestText = bestText.charAt(0).toUpperCase() + bestText.slice(1)

  // Ensure it ends with proper punctuation
  if (!/[.!?]$/.test(bestText)) {
    bestText += "."
  }

  return bestText
}

export function RotatingHeroHighlight({ contributions, firstName }: RotatingHeroHighlightProps) {
  const highlights = contributions
    .map((c) => {
      const sentence = extractHighlight(c.message)
      console.log("[v0] Contribution from", c.contributor_name, "extracted highlight:", sentence)
      if (!sentence) return null

      const wordCount = sentence.split(/\s+/).length
      let strength = 0

      if (wordCount >= 10 && wordCount <= 16) strength += 3
      else if (wordCount >= 8) strength += 2

      const actionVerbs = ["takes", "delivers", "follows", "leads", "handles", "brings", "ensures", "manages"]
      if (actionVerbs.some((v) => sentence.toLowerCase().includes(v))) strength += 2

      return { sentence, contributor: c, strength }
    })
    .filter((h): h is { sentence: string; contributor: Contribution; strength: number } => h !== null)
    .sort((a, b) => b.strength - a.strength)

  console.log("[v0] Total highlights generated:", highlights.length, "from", contributions.length)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (highlights.length <= 1 || isPaused || isInitialLoad) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % highlights.length)
    }, 9000)

    return () => clearInterval(interval)
  }, [highlights.length, isPaused, isInitialLoad])

  if (highlights.length === 0) return null

  const current = highlights[currentIndex]
  const contributor = current.contributor

  const displayRole = contributor.contributor_role || "Professional collaborator"
  const displayCompany = contributor.company_or_org || "Client"
  const displayRelationship = contributor.relationship || "Colleague"

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div key={current.contributor.id} className="transition-opacity duration-900">
        <blockquote className="mb-12">
          <p className="text-4xl md:text-5xl leading-[1.4] font-medium text-[var(--near-black)] text-balance">
            {current.sentence}
          </p>
        </blockquote>

        <footer className="text-sm text-[var(--soft-gray-text)] border-l-2 border-[var(--quiet-indigo)] pl-5 space-y-1.5">
          <p className="font-semibold text-[var(--near-black)]">— {contributor.contributor_name}</p>
          <p>
            {displayRole} · {displayCompany}
          </p>
          <p className="text-xs uppercase tracking-wider opacity-70">{displayRelationship}</p>
        </footer>
      </div>
    </div>
  )
}
