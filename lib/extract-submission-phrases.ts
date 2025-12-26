import type { Contribution } from "@/types"

export interface SubmissionPhrase {
  phrase: string
  count: number
}

/**
 * Extract 1-2 key phrases from a single submission's traits
 */
export function extractSubmissionPhrases(contribution: Contribution): string[] {
  const allTraits = [
    ...(contribution.traits_category1 || []),
    ...(contribution.traits_category2 || []),
    ...(contribution.traits_category3 || []),
    ...(contribution.traits_category4 || []),
  ]

  return allTraits.slice(0, 2)
}

/**
 * Calculate how many times each phrase appears across all submissions
 */
export function calculatePhraseFrequencies(contributions: Contribution[]): Map<string, number> {
  const frequencyMap = new Map<string, number>()

  contributions.forEach((contribution) => {
    const allTraits = [
      ...(contribution.traits_category1 || []),
      ...(contribution.traits_category2 || []),
      ...(contribution.traits_category3 || []),
      ...(contribution.traits_category4 || []),
    ]

    const uniqueTraits = new Set(allTraits)
    uniqueTraits.forEach((trait) => {
      frequencyMap.set(trait, (frequencyMap.get(trait) || 0) + 1)
    })
  })

  return frequencyMap
}

/**
 * Get top 3 most frequent phrases for summary display
 */
export function getTopPhrases(contributions: Contribution[]): SubmissionPhrase[] {
  const frequencyMap = calculatePhraseFrequencies(contributions)

  const phrases: SubmissionPhrase[] = []
  frequencyMap.forEach((count, phrase) => {
    if (count >= 2) {
      phrases.push({ phrase, count })
    }
  })

  return phrases.sort((a, b) => b.count - a.count).slice(0, 3)
}
