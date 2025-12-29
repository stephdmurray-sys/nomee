import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { checkRateLimit, detectSpamPatterns, detectInappropriateContent } from "@/lib/rate-limiter"
import { RELATIONSHIP_VALUES, DURATION_VALUES } from "@/lib/nomee-enums"
import { TRAIT_CATEGORIES } from "@/lib/trait-categories"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[COLLECTION] /api/contributions/create received", {
      keys: Object.keys(body),
      hasProfileId: !!body.profileId,
      hasRelationship: !!body.relationship,
      hasDuration: !!body.duration,
      hasMessage: !!body.message,
      contributionId: body.contributionId || null, // Log if this is an update vs insert
    })

    const {
      profileId,
      contributionId, // Accept contributionId to support updates
      contributorName,
      contributorEmail,
      companyOrOrg,
      relationship,
      duration,
      message,
      selectedTraitIds,
    } = body

    if (!relationship || !duration || !message) {
      console.log("[COLLECTION] create: Missing required fields (relationship, duration, or message)")
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Relationship, duration, and message are required",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      )
    }

    if (!RELATIONSHIP_VALUES.includes(relationship)) {
      console.log("[COLLECTION] create: Invalid relationship value:", relationship)
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Invalid relationship value",
          code: "INVALID_RELATIONSHIP",
        },
        { status: 400 },
      )
    }

    if (!DURATION_VALUES.includes(duration)) {
      console.log("[COLLECTION] create: Invalid duration value:", duration)
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Invalid duration value",
          code: "INVALID_DURATION",
        },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()
    console.log("[COLLECTION] create: Supabase admin client created")

    const normalizedEmail = contributorEmail
      ? contributorEmail.toLowerCase().trim()
      : `pending+${crypto.randomUUID()}@nomee.app`

    console.log("[COLLECTION] create: Using email", {
      isPlaceholder: !contributorEmail,
      email: normalizedEmail.includes("pending+") ? "pending+[UUID]@nomee.app" : normalizedEmail,
    })

    // Only check rate limit if real email provided
    if (!normalizedEmail.startsWith("pending+")) {
      if (contributorEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(contributorEmail)) {
          console.log("[COLLECTION] create: Invalid email format")
          return NextResponse.json(
            { ok: false, success: false, error: "Invalid email format", code: "INVALID_EMAIL" },
            { status: 400 },
          )
        }
      }

      const rateLimit = await checkRateLimit(supabase, {
        identifier: normalizedEmail,
        action: "submission",
        maxRequests: 3,
        windowMs: 24 * 60 * 60 * 1000,
      })

      if (!rateLimit.allowed) {
        console.log("[COLLECTION] create: Rate limit exceeded for:", normalizedEmail)
        return NextResponse.json(
          {
            ok: false,
            success: false,
            error: `The email "${normalizedEmail}" has reached its submission limit.`,
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
      console.log("[COLLECTION] create: Content flagged:", { isSpam, isInappropriate })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("id", profileId)
      .single()

    if (profileError || !profile) {
      console.log("[COLLECTION] create: Profile not found", {
        errorCode: profileError?.code,
        errorMessage: profileError?.message,
      })
      return NextResponse.json(
        { ok: false, success: false, error: "Profile not found", code: "PROFILE_NOT_FOUND" },
        { status: 404 },
      )
    }

    const emailHash = crypto.createHash("sha256").update(normalizedEmail).digest("hex")

    if (contributionId) {
      console.log("[COLLECTION] create: Updating existing contribution", { contributionId })

      const { data: updatedContribution, error: updateError } = await supabase
        .from("contributions")
        .update({
          relationship,
          duration,
          written_note: message,
          contributor_company: companyOrOrg || "Unknown",
          flagged: isSpam || isInappropriate,
          flag_reason: isSpam
            ? "Auto-flagged: spam patterns detected"
            : isInappropriate
              ? "Auto-flagged: inappropriate content detected"
              : null,
          flagged_at: isSpam || isInappropriate ? new Date().toISOString() : null,
        })
        .eq("id", contributionId)
        .select("id")
        .single()

      if (updateError) {
        console.error("[COLLECTION] create: Update error", {
          errorCode: updateError.code,
          errorMessage: updateError.message,
          constraint: updateError.details,
        })
        return NextResponse.json(
          {
            ok: false,
            success: false,
            error: `Database update failed: ${updateError.message}`,
            code: "DB_UPDATE_ERROR",
            details: updateError.message,
          },
          { status: 500 },
        )
      }

      console.log("[COLLECTION] create: SUCCESS (updated)", { contributionId })

      return NextResponse.json(
        {
          ok: true,
          success: true,
          contributionId: contributionId,
          message: "Your Nomee has been updated successfully",
        },
        { status: 200 },
      )
    }

    // Only check for duplicates if real email provided
    if (!normalizedEmail.startsWith("pending+")) {
      const { data: existing } = await supabase
        .from("contributions")
        .select("id, status")
        .eq("owner_id", profileId)
        .eq("email_hash", emailHash)
        .in("status", ["pending_confirmation", "confirmed"])
        .maybeSingle()

      if (existing) {
        console.log("[COLLECTION] create: Duplicate submission detected")
        return NextResponse.json(
          {
            ok: false,
            success: false,
            error: `This email has already submitted feedback for this person. Each contributor can only submit once.`,
            code: "DUPLICATE_SUBMISSION",
          },
          { status: 409 },
        )
      }
    }

    console.log("[COLLECTION] create: Mapping traits to 4 categories")

    const traitCategories = {
      traits_category1: [] as string[],
      traits_category2: [] as string[],
      traits_category3: [] as string[],
      traits_category4: [] as string[],
    }

    if (selectedTraitIds && Array.isArray(selectedTraitIds) && selectedTraitIds.length > 0) {
      Object.entries(TRAIT_CATEGORIES).forEach(([categoryKey, category]) => {
        const categoryTraitIds = category.traits.map((t) => t.id)
        const matchingTraitIds = selectedTraitIds.filter((id: string) => categoryTraitIds.includes(id))

        if (matchingTraitIds.length > 0) {
          const labels = matchingTraitIds
            .map((id: string) => category.traits.find((t) => t.id === id)?.label)
            .filter(Boolean) as string[]

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

    console.log("[COLLECTION] create: Trait categories mapped:", traitCategories)

    const confirmationToken = crypto.randomBytes(32).toString("hex")
    const finalContributorName = contributorName || "Pending Contributor"

    const { data: newContribution, error: insertError } = await supabase
      .from("contributions")
      .insert({
        owner_id: profileId,
        contributor_name: finalContributorName,
        contributor_email: normalizedEmail,
        contributor_company: companyOrOrg || "Unknown",
        relationship,
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
      console.error("[COLLECTION] create: Insert error", {
        errorCode: insertError.code,
        errorMessage: insertError.message,
        errorDetails: insertError.details,
        errorHint: insertError.hint,
        constraint: insertError.details, // Log constraint name for debugging
      })
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: `Database insert failed: ${insertError.message}`,
          code: "DB_INSERT_ERROR",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    if (!newContribution) {
      console.error("[COLLECTION] create: No contribution returned")
      return NextResponse.json(
        { ok: false, success: false, error: "Failed to create contribution", code: "NO_RESULT" },
        { status: 500 },
      )
    }

    console.log("[COLLECTION] create: SUCCESS (inserted)", {
      contributionId: newContribution.id,
      usedPlaceholder: normalizedEmail.startsWith("pending+"),
    })

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
    console.error("[COLLECTION] create: Unexpected error", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
