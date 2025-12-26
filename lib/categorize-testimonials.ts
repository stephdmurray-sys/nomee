import type { Contribution } from "@/types"

export interface CategorizedTestimonials {
  mostRepeated: Contribution[]
  proofOfImpact: Contribution[]
  howItFeels: Contribution[]
}

const PROOF_OF_IMPACT_KEYWORDS = [
  "results",
  "outcomes",
  "deliverables",
  "growth",
  "execution",
  "conversions",
  "timelines",
  "leadership",
  "problem-solving",
  "strategy",
  "increase",
  "improved",
  "achieved",
  "delivered",
  "performance",
  "growth",
  "engagement",
  "success",
  "solve",
  "triple",
  "drive",
  "revenue",
  "scale",
]

const HOW_IT_FEELS_KEYWORDS = [
  "reliability",
  "calm",
  "supportive",
  "collaborative",
  "trust",
  "clarity",
  "generosity",
  "communication",
  "presence",
  "kindness",
  "leadership tone",
  "authentic",
  "genuine",
  "transparent",
  "easy",
  "smooth",
  "clear",
  "open",
  "welcoming",
  "grounded",
  "centered",
  "steady",
]

export function categorizeTestimonials(contributions: Contribution[]): CategorizedTestimonials {
  const mostRepeated: Contribution[] = []
  const proofOfImpact: Contribution[] = [] // Keep empty for backwards compatibility
  const howItFeels: Contribution[] = []

  contributions.forEach((contribution) => {
    // This makes Nomee universally applicable - trust, style, outcomes all in one place
    howItFeels.push(contribution)
  })

  return { mostRepeated, proofOfImpact, howItFeels }
}
