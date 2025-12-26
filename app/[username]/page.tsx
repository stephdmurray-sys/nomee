import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PremierProfileClient } from "./premier-profile-client"
import { generateVibeCheck } from "@/lib/generate-vibe-check"
import { extractAnchorQuote } from "@/lib/extract-anchor-quote"
import { generateInterpretationSentence } from "@/lib/generate-interpretation-sentence"

export default async function PublicNomeePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  console.log("[v0] PublicNomeePage: Loading profile for username:", username)

  try {
    const supabase = await createClient()
    console.log("[v0] PublicNomeePage: Supabase client created successfully")

    const profileResponse = await supabase.from("profiles").select("*").eq("slug", username).maybeSingle()

    console.log("[v0] Profile query response:", {
      hasData: !!profileResponse.data,
      hasError: !!profileResponse.error,
      errorDetails: profileResponse.error
        ? {
            message: profileResponse.error.message,
            code: profileResponse.error.code,
            details: profileResponse.error.details,
          }
        : null,
    })

    if (profileResponse.error) {
      console.error("[v0] Profile query error:", profileResponse.error.message)
      notFound()
    }

    if (!profileResponse.data) {
      console.log("[v0] PublicNomeePage: No profile found, calling notFound()")
      notFound()
    }

    const profile = profileResponse.data

    console.log("[v0] PublicNomeePage: Profile found:", {
      id: profile.id,
      slug: profile.slug,
      name: profile.full_name,
    })

    const { data: contributions } = await supabase
      .from("contributions")
      .select("*")
      .eq("owner_id", profile.id)
      .eq("status", "confirmed")
      .order("confirmed_at", { ascending: false })

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

    importedFeedback?.forEach((feedback) => {
      const traits = feedback.traits || []
      const confidenceScore = feedback.confidence_score || 0
      const feedbackWeight = confidenceScore < 0.7 ? 0.3 : 0.5

      traits.forEach((trait) => {
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

    const vibeLabels = await generateVibeCheck(featuredContributions)
    const anchorQuote = extractAnchorQuote(featuredContributions)

    const interpretationSentence = await generateInterpretationSentence(
      profile.full_name || "this person",
      traitsWithCounts.slice(0, 5),
      totalContributions,
    )

    console.log("[v0] PublicNomeePage: Rendering profile with", {
      contributionsCount: featuredContributions.length,
      importedFeedbackCount: importedFeedback?.length || 0,
      traitsCount: traitsWithCounts.length,
    })

    return (
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
      />
    )
  } catch (error) {
    console.error("[v0] PublicNomeePage: Error occurred:", error instanceof Error ? error.message : String(error))
    throw error
  }
}
