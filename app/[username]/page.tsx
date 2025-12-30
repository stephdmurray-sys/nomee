import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { PremierProfileClient } from "./premier-profile-client"
import { generateVibeCheck } from "@/lib/generate-vibe-check"
import { extractAnchorQuote } from "@/lib/extract-anchor-quote"
import { generateInterpretationSentence } from "@/lib/generate-interpretation-sentence"
import { buildProfileAnalysis } from "@/lib/build-profile-analysis"
import { ProfileErrorBoundary } from "@/components/profile-error-boundary"

export default async function PublicNomeePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const staticRoutes = ["how-it-works", "what-is-nomee", "pricing", "auth", "dashboard", "c", "api"]
  if (staticRoutes.includes(username)) {
    redirect("/" + username)
  }

  try {
    const supabase = await createClient()

    console.log("[v0] Fetching profile for slug:", username)
    const profileResponse = await supabase.from("profiles").select("*").eq("slug", username).maybeSingle()

    if (profileResponse.error) {
      console.error("[v0] Profile query error:", profileResponse.error.message)
      notFound()
    }

    const profile = profileResponse.data
    if (!profile) {
      console.log("[v0] No profile found for slug:", username)
      notFound()
    }

    let profileAnalysis = {
      traitSignals: [] as Array<{ label: string; count: number; sources: string[] }>,
      vibeSignals: [] as Array<{ label: string; count: number }>,
      impactSignals: [] as Array<{ label: string; count: number; phrases: string[] }>,
      totalDataCount: 0,
    }
    try {
      const result = await buildProfileAnalysis(profile.id)
      if (result) {
        profileAnalysis = {
          traitSignals: Array.isArray(result.traitSignals) ? result.traitSignals : [],
          vibeSignals: Array.isArray(result.vibeSignals) ? result.vibeSignals : [],
          impactSignals: Array.isArray(result.impactSignals) ? result.impactSignals : [],
          totalDataCount: typeof result.totalDataCount === "number" ? result.totalDataCount : 0,
        }
      }
    } catch (e) {
      console.error("[v0] buildProfileAnalysis failed:", e)
    }

    console.log("[v0] Fetching contributions for profile:", profile.id)
    const contributionsResponse = await supabase
      .from("contributions")
      .select("*")
      .eq("owner_id", profile.id)
      .order("created_at", { ascending: false })

    if (contributionsResponse.error) {
      console.error("[v0] Contributions query error:", contributionsResponse.error.message)
    }

    const featuredContributions = contributionsResponse.data ?? []

    console.log("[v0] Fetching imported feedback for profile:", profile.id)
    const importedResponse = await supabase
      .from("imported_feedback")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("approved_by_owner", true)
      .eq("visibility", "public")
      .order("created_at", { ascending: false })

    if (importedResponse.error) {
      console.error("[v0] Imported feedback query error:", importedResponse.error.message)
    }

    const importedFeedback = importedResponse.data ?? []

    const traitFrequency: Record<string, { count: number; examples: string[]; category: string; weight: number }> = {}

    featuredContributions.forEach((contribution) => {
      if (!contribution) return // Skip null items

      const allTraits = [
        ...(Array.isArray(contribution.traits_category1) ? contribution.traits_category1 : []),
        ...(Array.isArray(contribution.traits_category2) ? contribution.traits_category2 : []),
        ...(Array.isArray(contribution.traits_category3) ? contribution.traits_category3 : []),
        ...(Array.isArray(contribution.traits_category4) ? contribution.traits_category4 : []),
      ]

      allTraits.forEach((trait) => {
        if (!trait || typeof trait !== "string") return // Skip invalid traits
        if (!traitFrequency[trait]) {
          traitFrequency[trait] = { count: 0, examples: [], category: "leadership", weight: 0 }
        }
        traitFrequency[trait].weight += 1.0
        traitFrequency[trait].count += 1
        if (traitFrequency[trait].examples.length < 3 && contribution.written_note) {
          traitFrequency[trait].examples.push(contribution.written_note)
        }
      })
    })

    importedFeedback.forEach((feedback) => {
      if (!feedback) return // Skip null items

      const traits = Array.isArray(feedback.traits) ? feedback.traits : []
      const confidenceScore = typeof feedback.confidence_score === "number" ? feedback.confidence_score : 0
      const feedbackWeight = confidenceScore < 0.7 ? 0.3 : 0.5

      traits.forEach((trait: string) => {
        if (!trait || typeof trait !== "string") return // Skip invalid traits
        if (!traitFrequency[trait]) {
          traitFrequency[trait] = { count: 0, examples: [], category: "leadership", weight: 0 }
        }
        traitFrequency[trait].weight += feedbackWeight
        traitFrequency[trait].count += 1
        if (traitFrequency[trait].examples.length < 3 && feedback.ai_extracted_excerpt) {
          traitFrequency[trait].examples.push(feedback.ai_extracted_excerpt)
        }
      })
    })

    const traitsWithCounts = Object.entries(traitFrequency)
      .map(([label, data]) => ({
        label,
        count: data.count,
        weightedCount: data.weight,
        category: data.category as "leadership" | "execution" | "collaboration" | "eq",
        examples: data.examples,
      }))
      .sort((a, b) => b.weightedCount - a.weightedCount)

    const totalContributions = featuredContributions.length
    const uniqueCompanies = new Set(
      featuredContributions
        .map((c) => c?.contributor_company)
        .filter((c): c is string => typeof c === "string" && c.length > 0),
    ).size

    let vibeLabels: string[] = []
    try {
      const result = await generateVibeCheck(featuredContributions)
      vibeLabels = Array.isArray(result) ? result : []
    } catch (e) {
      console.error("[v0] generateVibeCheck failed:", e)
    }

    let anchorQuote = ""
    try {
      anchorQuote = extractAnchorQuote(featuredContributions) || ""
    } catch (e) {
      console.error("[v0] extractAnchorQuote failed:", e)
    }

    let interpretationSentence = ""
    try {
      interpretationSentence =
        (await generateInterpretationSentence(
          profile.full_name || "this person",
          traitsWithCounts.slice(0, 5),
          totalContributions,
        )) || ""
    } catch (e) {
      console.error("[v0] generateInterpretationSentence failed:", e)
    }

    console.log("[v0] Successfully loaded profile:", username, {
      contributions: featuredContributions.length,
      imported: importedFeedback.length,
      traits: traitsWithCounts.length,
    })

    return (
      <ProfileErrorBoundary slug={username}>
        <PremierProfileClient
          profile={profile}
          contributions={featuredContributions}
          importedFeedback={importedFeedback}
          traits={traitsWithCounts}
          totalContributions={totalContributions}
          uniqueCompanies={uniqueCompanies}
          interpretationSentence={interpretationSentence}
          vibeLabels={vibeLabels}
          anchorQuote={anchorQuote}
          profileAnalysis={profileAnalysis}
        />
      </ProfileErrorBoundary>
    )
  } catch (error) {
    console.error("[v0] PublicNomeePage FATAL:", username, error instanceof Error ? error.message : String(error))
    throw error
  }
}
