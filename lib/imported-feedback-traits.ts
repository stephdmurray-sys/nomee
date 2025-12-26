// Locked trait ontology for imported feedback
// AI extraction must ONLY use these traits

export const LOCKED_TRAITS = [
  "Reliable",
  "Clear Communicator",
  "Strategic Thinker",
  "Fast Executor",
  "Trustworthy",
  "Collaborative",
  "Calm Under Pressure",
  "Supportive",
  "Detail-Oriented",
  "Creative",
  "Results-Driven",
  "Inspirational",
  "Ownership Mentality",
  "Adaptable",
  "Strong Follow-Through",
] as const

export type LockedTrait = (typeof LOCKED_TRAITS)[number]

export const SOURCE_TYPES = ["Email", "LinkedIn", "DM", "Review", "Other"] as const

export type SourceType = (typeof SOURCE_TYPES)[number]

export interface ImportedFeedback {
  id: string
  profile_id: string
  raw_image_url: string
  ocr_text: string | null
  ai_extracted_excerpt: string | null
  giver_name: string
  giver_company: string | null
  giver_role: string | null
  source_type: SourceType | null
  approx_date: string | null
  traits: string[]
  confidence_score: number | null
  approved_by_owner: boolean
  visibility: "public" | "private"
  label: string
  created_at: string
  updated_at: string
  approved_at: string | null
}

export function getImportedFeedbackWeight(confidenceScore: number | null): number {
  if (!confidenceScore) return 0.3
  return confidenceScore < 0.7 ? 0.3 : 0.5
}

export const NOMEE_WEIGHT = 1.0 // Verified Nomees have full weight
export const IMPORTED_FEEDBACK_BASE_WEIGHT = 0.5 // Base weight for imported feedback
export const LOW_CONFIDENCE_WEIGHT = 0.3 // Reduced weight for low confidence extractions

/**
 * Calculate the contribution weight for insights aggregation
 * Verified Nomee = 1.0
 * Imported feedback = 0.5 (or 0.3 if confidence < 0.7)
 */
export function calculateInsightWeight(sourceType: "nomee" | "imported", confidenceScore?: number | null): number {
  if (sourceType === "nomee") {
    return NOMEE_WEIGHT
  }

  return getImportedFeedbackWeight(confidenceScore || null)
}
