import type { Contribution } from "@/types"

export interface RepeatedPhrase {
  label: string
  count: number
  contributors: string[]
}

export function extractRepeatedPhrases(contributions: Contribution[]): RepeatedPhrase[] {
  const phraseMap = new Map<string, Set<string>>()

  contributions.forEach((contribution) => {
    const contributorId = contribution.contributor_email || contribution.contributor_name

    const allTraits = [
      ...(contribution.traits_category1 || []),
      ...(contribution.traits_category2 || []),
      ...(contribution.traits_category3 || []),
      ...(contribution.traits_category4 || []),
    ]

    allTraits.forEach((trait) => {
      if (!phraseMap.has(trait)) {
        phraseMap.set(trait, new Set())
      }
      phraseMap.get(trait)!.add(contributorId)
    })
  })

  const phrases: RepeatedPhrase[] = []
  phraseMap.forEach((contributors, label) => {
    if (contributors.size >= 2) {
      phrases.push({
        label,
        count: contributors.size,
        contributors: Array.from(contributors),
      })
    }
  })

  return phrases.sort((a, b) => b.count - a.count)
}
