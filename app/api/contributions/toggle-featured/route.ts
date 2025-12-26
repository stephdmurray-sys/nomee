import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { contributionId, isFeatured } = await request.json()

    if (!contributionId || typeof isFeatured !== "boolean") {
      return NextResponse.json({ error: "Missing contributionId or isFeatured" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile and plan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, plan")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const plan = profile.plan || "free"
    const featuredLimit = plan === "free" ? 1 : plan === "starter" ? 3 : Number.POSITIVE_INFINITY

    // Verify the contribution belongs to the user
    const { data: contribution, error: contribError } = await supabase
      .from("contributions")
      .select("id, profile_id, status")
      .eq("id", contributionId)
      .single()

    if (contribError || !contribution) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 })
    }

    if (contribution.profile_id !== profile.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // If featuring, check limits
    if (isFeatured) {
      const { data: featuredContribs } = await supabase
        .from("contributions")
        .select("id")
        .eq("profile_id", profile.id)
        .eq("is_featured", true)
        .eq("status", "confirmed")

      const currentFeaturedCount = featuredContribs?.length || 0

      if (currentFeaturedCount >= featuredLimit) {
        return NextResponse.json(
          {
            error: `You've reached your ${featuredLimit} featured perspective limit. Upgrade your plan to feature more.`,
          },
          { status: 403 },
        )
      }
    }

    // Update featured status
    const { error: updateError } = await supabase
      .from("contributions")
      .update({ is_featured: isFeatured })
      .eq("id", contributionId)

    if (updateError) {
      console.error("[v0] Error updating featured status:", updateError)
      return NextResponse.json({ error: "Failed to update featured status" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Toggle featured error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
