import { type NextRequest, NextResponse } from "next/server"
import { createPublicServerClient } from "@/lib/supabase/public-server"
import { checkRateLimit, detectSpamPatterns, detectInappropriateContent } from "@/lib/rate-limiter"
import { RELATIONSHIP_VALUES, DURATION_VALUES } from "@/lib/nomee-enums"
import { TRAIT_CATEGORIES } from "@/lib/trait-categories"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] API - Received contribution request")

    const {
      profileId,
      contributorName,
      contributorEmail,
      companyOrOrg,
      relationship,
      relationshipContext, // Added relationshipContext parameter
      duration,
      message,
      selectedTraitIds,
    } = body

    if (!contributorName || !contributorEmail || !relationship || !duration || !message) {
      console.log("[v0] API - Missing required fields")
      return NextResponse.json(
        {
          ok: false,
          error: "All fields are required",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      )
    }

    if (!RELATIONSHIP_VALUES.includes(relationship)) {
      console.log("[v0] API - Invalid relationship value:", relationship)
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid relationship value",
          code: "INVALID_RELATIONSHIP",
        },
        { status: 400 },
      )
    }

    if (!DURATION_VALUES.includes(duration)) {
      console.log("[v0] API - Invalid duration value:", duration)
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid duration value",
          code: "INVALID_DURATION",
        },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contributorEmail)) {
      console.log("[v0] API - Invalid email format")
      return NextResponse.json({ ok: false, error: "Invalid email format", code: "INVALID_EMAIL" }, { status: 400 })
    }

    const supabase = await createPublicServerClient()
    console.log("[v0] API - Supabase client created successfully")

    const normalizedEmail = contributorEmail.toLowerCase().trim()

    if (normalizedEmail !== "pending@nomee.app") {
      const rateLimit = await checkRateLimit(supabase, {
        identifier: normalizedEmail,
        action: "submission",
        maxRequests: 3,
        windowMs: 24 * 60 * 60 * 1000,
      })

      if (!rateLimit.allowed) {
        console.log("[v0] API - Rate limit exceeded for:", normalizedEmail)
        return NextResponse.json(
          {
            ok: false,
            error: `The email "${normalizedEmail}" has reached its submission limit. You can only submit 3 times per email within 24 hours.`,
            code: "RATE_LIMIT",
            resetAt: rateLimit.resetAt.toISOString(),
          },
          { status: 429 },
        )
      }
    }

    const isSpam = detectSpamPatterns(message)
    const isInappropriate = detectInappropriateContent(message)

    if (isSpam || isInappropriate) {
      console.log("[v0] API - Content flagged:", { isSpam, isInappropriate })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("id", profileId)
      .single()

    if (profileError || !profile) {
      console.log("[v0] API - Profile not found:", profileError)
      return NextResponse.json({ ok: false, error: "Profile not found", code: "PROFILE_NOT_FOUND" }, { status: 404 })
    }

    const emailHash = crypto.createHash("sha256").update(normalizedEmail).digest("hex")

    if (normalizedEmail !== "pending@nomee.app") {
      const { data: existing } = await supabase
        .from("contributions")
        .select("id, status")
        .eq("owner_id", profileId)
        .eq("email_hash", emailHash)
        .in("status", ["pending_confirmation", "confirmed"])
        .maybeSingle()

      if (existing) {
        console.log("[v0] API - Duplicate submission detected")
        return NextResponse.json(
          {
            ok: false,
            error: `The email "${normalizedEmail}" has already submitted for this person. Each email can only submit once.`,
            code: "DUPLICATE_SUBMISSION",
          },
          { status: 409 },
        )
      }
    }

    console.log("[v0] API - Mapping traits to 4 categories")

    const traitCategories = {
      traits_category1: [] as string[],
      traits_category2: [] as string[],
      traits_category3: [] as string[],
      traits_category4: [] as string[],
    }

    if (selectedTraitIds && Array.isArray(selectedTraitIds) && selectedTraitIds.length > 0) {
      // Map trait IDs to labels based on TRAIT_CATEGORIES
      Object.entries(TRAIT_CATEGORIES).forEach(([categoryKey, category], index) => {
        const categoryTraitIds = category.traits.map((t) => t.id)
        const matchingTraitIds = selectedTraitIds.filter((id) => categoryTraitIds.includes(id))

        if (matchingTraitIds.length > 0) {
          const labels = matchingTraitIds
            .map((id) => category.traits.find((t) => t.id === id)?.label)
            .filter(Boolean) as string[]

          // Map to database columns: how_it_felt=1, communication=2, execution=3, collaboration_and_leadership=4
          if (categoryKey === "how_it_felt") {
            traitCategories.traits_category1 = labels.slice(0, 2)
          } else if (categoryKey === "communication") {
            traitCategories.traits_category2 = labels.slice(0, 2)
          } else if (categoryKey === "execution") {
            traitCategories.traits_category3 = labels.slice(0, 2)
          } else if (categoryKey === "collaboration_and_leadership") {
            traitCategories.traits_category4 = labels.slice(0, 2)
          }
        }
      })
    }

    console.log("[v0] API - Trait categories mapped:", traitCategories)

    const confirmationToken = crypto.randomBytes(32).toString("hex")

    const { data: newContribution, error: insertError } = await supabase
      .from("contributions")
      .insert({
        owner_id: profileId,
        contributor_name: contributorName,
        contributor_email: normalizedEmail,
        contributor_company: companyOrOrg || "Unknown",
        relationship,
        relationship_context: relationshipContext || null, // Added relationship_context field
        duration,
        written_note: message,
        email_hash: emailHash,
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        confirmation_token: confirmationToken,
        confirmation_sent_at: new Date().toISOString(),
        flagged: isSpam || isInappropriate,
        flag_reason: isSpam
          ? "Auto-flagged: spam patterns detected"
          : isInappropriate
            ? "Auto-flagged: inappropriate content detected"
            : null,
        flagged_at: isSpam || isInappropriate ? new Date().toISOString() : null,
        traits_category1: traitCategories.traits_category1,
        traits_category2: traitCategories.traits_category2,
        traits_category3: traitCategories.traits_category3,
        traits_category4: traitCategories.traits_category4,
        audio_status: "none",
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("[v0] API - Insert error:", insertError)
      return NextResponse.json(
        {
          ok: false,
          error: "Database error. Please try again.",
          code: "DB_INSERT_ERROR",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    if (!newContribution) {
      console.error("[v0] API - No contribution returned")
      return NextResponse.json(
        { ok: false, error: "Failed to create contribution", code: "NO_RESULT" },
        { status: 500 },
      )
    }

    console.log("[v0] API - ✅ Contribution created successfully:", newContribution.id)

    return NextResponse.json(
      {
        ok: true,
        success: true,
        contributionId: newContribution.id,
        message: "Your Nomee has been shared successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] API - Unexpected error:", error)
    return NextResponse.json(
      {
        ok: false,
        error: "Server error. Please try again.",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
