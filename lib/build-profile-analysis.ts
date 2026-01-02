import { createClient } from "@/lib/supabase/server"
import { TRAIT_CATEGORIES } from "@/lib/trait-categories"

export type TraitSignal = { label: string; count: number }
export type VibeSignal = { label: string; count: number }

export interface ConfidenceLevel {
  label: string
  description: string
  color: string
  bgColor: string
  borderColor: string
}

export interface ProfileAnalysis {
  analysisText: string
  traitSignals: TraitSignal[]
  vibeSignals: VibeSignal[]
  counts: {
    contributions: number
    voiceNotes: number
    uploads: number
  }
  confidenceLevel: ConfidenceLevel
}

function getConfidenceLevel(contributionCount: number, uploadCount: number): ConfidenceLevel {
  const totalCount = contributionCount + uploadCount

  if (totalCount >= 5) {
    return {
      label: "High confidence",
      description: "Patterns are consistent across contributors.",
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    }
  } else if (totalCount >= 2) {
    return {
      label: "Medium confidence",
      description: "Early patterns emerging—more data will refine this.",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    }
  } else {
    return {
      label: "Low confidence",
      description: "Limited data—initial impressions only.",
      color: "text-neutral-600",
      bgColor: "bg-neutral-50",
      borderColor: "border-neutral-200",
    }
  }
}

export async function buildProfileAnalysis(profileId: string): Promise<ProfileAnalysis> {
  const supabase = await createClient()

  const { data: contributions } = await supabase
    .from("contributions")
    .select("*")
    .eq("owner_id", profileId)
    .eq("status", "confirmed")
    .order("created_at", { ascending: false })

  const { data: importedFeedback } = await supabase
    .from("imported_feedback")
    .select("*")
    .eq("profile_id", profileId)
    .eq("approved_by_owner", true)
    .eq("visibility", "public")

  // Collect all text for analysis
  const textParts: string[] = []

  contributions?.forEach((c) => {
    if (c.written_note?.trim()) {
      textParts.push(c.written_note.trim())
    }
  })

  importedFeedback?.forEach((f) => {
    const text = f.ai_extracted_excerpt || f.ocr_text
    if (text?.trim()) {
      textParts.push(text.trim())
    }
  })

  const analysisText = textParts.join(" ").replace(/\s+/g, " ").trim()

  // Database stores labels directly ("Strategic", "Analytical", etc.)
  const traitCounts: Record<string, number> = {}

  contributions?.forEach((c) => {
    // Only categories 1-3 are traits for Pattern Recognition + Summary
    const traitArrays = [c.traits_category1 || [], c.traits_category2 || [], c.traits_category3 || []]

    traitArrays.forEach((traitArray) => {
      traitArray.forEach((traitValue: string) => {
        if (!traitValue?.trim()) return

        // Try to find the canonical label from TRAIT_CATEGORIES
        let foundLabel: string | null = null
        for (const [categoryKey, category] of Object.entries(TRAIT_CATEGORIES)) {
          if (categoryKey === "the_vibe") continue
          const trait = category.traits.find(
            (t) =>
              t.id.toLowerCase() === traitValue.toLowerCase() || t.label.toLowerCase() === traitValue.toLowerCase(),
          )
          if (trait) {
            foundLabel = trait.label
            break
          }
        }

        // Use found label or the original value (capitalized properly)
        const label = foundLabel || traitValue.charAt(0).toUpperCase() + traitValue.slice(1)
        traitCounts[label] = (traitCounts[label] || 0) + 1
      })
    })
  })

  const traitSignals: TraitSignal[] = Object.entries(traitCounts)
    .filter(([label]) => label?.trim())
    .sort(([, a], [, b]) => b - a)
    .map(([label, count]) => ({ label, count }))

  const vibeCounts: Record<string, number> = {}

  contributions?.forEach((c) => {
    const vibeArray = c.traits_category4 || []

    vibeArray.forEach((vibeValue: string) => {
      if (!vibeValue?.trim()) return

      // Try to find the canonical label from TRAIT_CATEGORIES.the_vibe
      let foundLabel: string | null = null
      const vibeTrait = TRAIT_CATEGORIES.the_vibe?.traits.find(
        (t) => t.id.toLowerCase() === vibeValue.toLowerCase() || t.label.toLowerCase() === vibeValue.toLowerCase(),
      )

      if (vibeTrait) {
        foundLabel = vibeTrait.label
      } else {
        // If not found in trait categories, use the value as-is (capitalized)
        foundLabel = vibeValue.charAt(0).toUpperCase() + vibeValue.slice(1)
      }

      if (foundLabel) {
        vibeCounts[foundLabel] = (vibeCounts[foundLabel] || 0) + 1
      }
    })
  })

  const vibeSignals: VibeSignal[] = Object.entries(vibeCounts)
    .filter(([label]) => label?.trim())
    .sort(([, a], [, b]) => b - a)
    .map(([label, count]) => ({ label, count }))

  const contributionCount = contributions?.length || 0
  const uploadCount = importedFeedback?.length || 0

  return {
    analysisText,
    traitSignals,
    vibeSignals,
    counts: {
      contributions: contributionCount,
      voiceNotes: contributions?.filter((c) => c.audio_url || c.voice_url)?.length || 0,
      uploads: uploadCount,
    },
    confidenceLevel: getConfidenceLevel(contributionCount, uploadCount),
  }
}
