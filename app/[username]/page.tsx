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

    const profileResponse = await supabase.from("profiles").select("*").eq("slug", username).maybeSingle()

    if (profileResponse.error) {
      console.error("[v0] Profile query error:", profileResponse.error.message)
      notFound()
    }

    if (!profileResponse.data) {
      notFound()
    }

    const profile = profileResponse.data

    let profileAnalysis = { traitSignals: [], vibeSignals: [], impactSignals: [], totalDataCount: 0 }
    try {
      profileAnalysis = await buildProfileAnalysis(profile.id)
    } catch (e) {
      console.error("[v0] buildProfileAnalysis failed:", e)
    }

    const { data: contributions } = await supabase
      .from("contributions")
      .select("*")
      .eq("owner_id", profile.id)
      .order("created_at", { ascending: false })

    const featuredContributions = contributions || []

    const { data: importedFeedback } = await supabase
      .from("imported_feedback")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("approved_by_owner", true)
      .eq("visibility", "public")
      .order("created_at", { ascending: false })

    const traitFrequency: Record<string, { count: number; examples: string[]; category: string; weight: number }> = {}

    featuredContributions.forEach((contribution) => {
      const allTraits = [
        ...(contribution.traits_category1 || []),
        ...(contribution.traits_category2 || []),
        ...(contribution.traits_category3 || []),
        ...(contribution.traits_category4 || []),
      ]

      allTraits.forEach((trait) => {
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
    ;(importedFeedback || []).forEach((feedback) => {
      const traits = feedback.traits || []
      const confidenceScore = feedback.confidence_score || 0
      const feedbackWeight = confidenceScore < 0.7 ? 0.3 : 0.5

      traits.forEach((trait: string) => {
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
    const uniqueCompanies = new Set(featuredContributions.map((c) => c.contributor_company).filter((c) => c)).size

    let vibeLabels: string[] = []
    try {
      vibeLabels = await generateVibeCheck(featuredContributions)
    } catch (e) {
      console.error("[v0] generateVibeCheck failed:", e)
    }

    const anchorQuote = extractAnchorQuote(featuredContributions)

    let interpretationSentence = ""
    try {
      interpretationSentence = await generateInterpretationSentence(
        profile.full_name || "this person",
        traitsWithCounts.slice(0, 5),
        totalContributions,
      )
    } catch (e) {
      console.error("[v0] generateInterpretationSentence failed:", e)
    }

    return (
      <ProfileErrorBoundary slug={username}>
        <PremierProfileClient
          profile={profile}
          contributions={featuredContributions}
          importedFeedback={importedFeedback || []}
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
    console.error("[v0] PublicNomeePage: Error occurred:", error instanceof Error ? error.message : String(error))
    throw error
  }
}
