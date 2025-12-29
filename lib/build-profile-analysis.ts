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
    .order("created_at", { ascending: false })

  const { data: importedFeedback } = await supabase
    .from("imported_feedback")
    .select("*")
    .eq("profile_id", profileId)
    .eq("approved_by_owner", true)
    .eq("visibility", "public")

  console.log("[v0] buildProfileAnalysis: contributions count:", contributions?.length)
  console.log(
    "[v0] buildProfileAnalysis: sample contribution traits:",
    contributions?.[0]
      ? {
          cat1: contributions[0].traits_category1,
          cat2: contributions[0].traits_category2,
          cat3: contributions[0].traits_category3,
          cat4: contributions[0].traits_category4,
        }
      : null,
  )

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

  // Database stores labels directly ("Strategic") not IDs ("strategic")
  const traitCounts: Record<string, number> = {}
  contributions?.forEach((c) => {
    const traitValues = [...(c.traits_category1 || []), ...(c.traits_category2 || []), ...(c.traits_category3 || [])]

    traitValues.forEach((traitValue: string) => {
      let found = false
      // First try to find by id or label in TRAIT_CATEGORIES
      for (const [categoryKey, category] of Object.entries(TRAIT_CATEGORIES)) {
        if (categoryKey === "the_vibe") continue
        const trait = category.traits.find((t) => t.id === traitValue || t.label === traitValue)
        if (trait) {
          traitCounts[trait.label] = (traitCounts[trait.label] || 0) + 1
          found = true
          break
        }
      }
      // If not found in categories, use the value directly as the label
      // (handles case where labels are stored directly in database)
      if (!found && traitValue?.trim()) {
        traitCounts[traitValue] = (traitCounts[traitValue] || 0) + 1
      }
    })
  })

  const traitSignals: TraitSignal[] = Object.entries(traitCounts)
    .filter(([label]) => label?.trim())
    .sort(([, a], [, b]) => b - a)
    .map(([label, count]) => ({ label, count }))

  console.log("[v0] buildProfileAnalysis: final traitSignals:", traitSignals)

  const vibeCounts: Record<string, number> = {}
  contributions?.forEach((c) => {
    const vibeValues = c.traits_category4 || []
    vibeValues.forEach((vibeValue: string) => {
      const vibeTrait = TRAIT_CATEGORIES.the_vibe?.traits.find((t) => t.id === vibeValue || t.label === vibeValue)
      if (vibeTrait) {
        vibeCounts[vibeTrait.label] = (vibeCounts[vibeTrait.label] || 0) + 1
      } else if (vibeValue?.trim()) {
        // Use value directly if not found in categories
        vibeCounts[vibeValue] = (vibeCounts[vibeValue] || 0) + 1
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
      voiceNotes: contributions?.filter((c) => c.audio_url)?.length || 0,
      uploads: uploadCount,
    },
    confidenceLevel: getConfidenceLevel(contributionCount, uploadCount),
  }
}
