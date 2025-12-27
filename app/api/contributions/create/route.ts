import { type NextRequest, NextResponse } from "next/server"
import { createPublicServerClient } from "@/lib/supabase/public-server"
import { checkRateLimit, detectSpamPatterns, detectInappropriateContent } from "@/lib/rate-limiter"
import { RELATIONSHIP_VALUES, DURATION_VALUES } from "@/lib/nomee-enums"
import crypto from "crypto"

const VALID_RELATIONSHIPS = [
  "Peer",
  "Manager",
  "Direct Report",
  "Client",
  "Customer",
  "Vendor",
  "Contractor",
  "Consultant",
  "Agency",
  "Brand Partner",
  "Collaborator",
  "Affiliate",
  "Other",
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] API - Received contribution request:", Object.keys(body))

    const {
      profileId,
      contributorName,
      contributorEmail,
      companyOrOrg,
      relationship,
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

    console.log("[v0] API - Relationship value being validated:", relationship)
    if (!RELATIONSHIP_VALUES.includes(relationship)) {
      console.log("[v0] API - Invalid relationship value:", relationship)
      console.log("[v0] API - Expected one of:", RELATIONSHIP_VALUES)
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
      console.log("[v0] API - Expected one of:", DURATION_VALUES)
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
          error: `The email "${normalizedEmail}" has reached its submission limit. You can only submit 3 times per email within 24 hours. Try again later or use a different email.`,
          code: "RATE_LIMIT",
          resetAt: rateLimit.resetAt.toISOString(),
        },
        { status: 429 },
      )
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
      return NextResponse.json(
        { ok: false, error: "Profile not found", code: "PROFILE_NOT_FOUND", details: profileError?.message },
        { status: 404 },
      )
    }

    console.log("[v0] API - Profile found:", profile.username)

    const emailHash = crypto.createHash("sha256").update(normalizedEmail).digest("hex")

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

    console.log("[v0] API - Inserting contribution (Phase A: Core submission)")
    console.log("[v0] API - Relationship value being inserted:", relationship)

    const confirmationToken = crypto.randomBytes(32).toString("hex")

    const traitCategories = {
      traits_category1: [] as string[],
      traits_category2: [] as string[],
      traits_category3: [] as string[],
    }

    if (selectedTraitIds && Array.isArray(selectedTraitIds) && selectedTraitIds.length > 0) {
      const { data: traits } = await supabase
        .from("trait_library")
        .select("id, label, category")
        .in("id", selectedTraitIds)

      if (traits) {
        traits.forEach((trait) => {
          if (trait.category === "how_they_work") {
            if (traitCategories.traits_category1.length < 2) {
              traitCategories.traits_category1.push(trait.label)
            }
          } else if (trait.category === "what_working_feels_like") {
            if (traitCategories.traits_category2.length < 2) {
              traitCategories.traits_category2.push(trait.label)
            }
          } else if (trait.category === "how_they_think" || trait.category === "how_they_show_up") {
            if (traitCategories.traits_category3.length < 4) {
              traitCategories.traits_category3.push(trait.label)
            }
          }
        })
      }
    }

    const { data: newContribution, error: insertError } = await supabase
      .from("contributions")
      .insert({
        owner_id: profileId,
        contributor_name: contributorName,
        contributor_email: normalizedEmail,
        contributor_company: companyOrOrg || "Unknown",
        relationship,
        duration,
        written_note: message,
        email_hash: emailHash,
        status: "pending_confirmation",
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
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("[v0] API - Core insert error:", insertError)
      console.error("[v0] API - Insert error details:", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      })
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

    console.log("[v0] API - ✅ Core contribution created successfully:", newContribution.id)

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
