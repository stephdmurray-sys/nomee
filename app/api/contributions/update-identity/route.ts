import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { checkRateLimit } from "@/lib/rate-limiter"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[COLLECTION] /api/contributions/update-identity received", {
      keys: Object.keys(body),
      hasContributionId: !!body.contributionId,
      hasName: !!body.contributorName,
      hasEmail: !!body.contributorEmail,
    })

    const { contributionId, contributorName, contributorEmail } = body

    if (!contributionId || !contributorName || !contributorEmail) {
      console.log("[COLLECTION] update-identity: Missing required fields")
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required (contributionId, contributorName, contributorEmail)",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contributorEmail)) {
      console.log("[COLLECTION] update-identity: Invalid email format")
      return NextResponse.json(
        { success: false, error: "Invalid email format", code: "INVALID_EMAIL" },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()
    console.log("[COLLECTION] update-identity: Supabase admin client created")

    const normalizedEmail = contributorEmail.toLowerCase().trim()

    // Check rate limit
    const rateLimit = await checkRateLimit(supabase, {
      identifier: normalizedEmail,
      action: "submission",
      maxRequests: 3,
      windowMs: 24 * 60 * 60 * 1000,
    })

    if (!rateLimit.allowed) {
      console.log("[COLLECTION] update-identity: Rate limit exceeded for:", normalizedEmail)
      return NextResponse.json(
        {
          success: false,
          error: `The email "${normalizedEmail}" has reached its submission limit. You can only submit 3 times per email within 24 hours.`,
          code: "RATE_LIMIT",
          resetAt: rateLimit.resetAt.toISOString(),
        },
        { status: 429 },
      )
    }

    // Get the contribution to check owner_id
    const { data: contribution, error: fetchError } = await supabase
      .from("contributions")
      .select("owner_id")
      .eq("id", contributionId)
      .single()

    if (fetchError || !contribution) {
      console.log("[COLLECTION] update-identity: Contribution not found", {
        errorCode: fetchError?.code,
        errorMessage: fetchError?.message,
      })
      return NextResponse.json(
        {
          success: false,
          error: "Contribution not found. Please go back and save your message again.",
          code: "NOT_FOUND",
        },
        { status: 404 },
      )
    }

    const emailHash = crypto.createHash("sha256").update(normalizedEmail).digest("hex")

    // Check for duplicate submissions from this email to the same profile
    const { data: existing } = await supabase
      .from("contributions")
      .select("id")
      .eq("owner_id", contribution.owner_id)
      .eq("email_hash", emailHash)
      .neq("id", contributionId)
      .in("status", ["pending_confirmation", "confirmed"])
      .maybeSingle()

    if (existing) {
      console.log("[COLLECTION] update-identity: Duplicate submission detected")
      return NextResponse.json(
        {
          success: false,
          error: `The email "${normalizedEmail}" has already submitted for this person. Each email can only submit once.`,
          code: "DUPLICATE_SUBMISSION",
        },
        { status: 409 },
      )
    }

    // Update the contribution with identity information
    console.log("[COLLECTION] update-identity: Updating contribution", { contributionId })
    const { error: updateError } = await supabase
      .from("contributions")
      .update({
        contributor_name: contributorName,
        contributor_email: normalizedEmail,
        email_hash: emailHash,
      })
      .eq("id", contributionId)

    if (updateError) {
      console.error("[COLLECTION] update-identity: Update error", {
        errorCode: updateError.code,
        errorMessage: updateError.message,
      })
      return NextResponse.json(
        {
          success: false,
          error: `Database update failed: ${updateError.message}`,
          code: "UPDATE_ERROR",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    console.log("[COLLECTION] update-identity: SUCCESS", { contributionId })

    return NextResponse.json(
      {
        success: true,
        message: "Identity updated successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[COLLECTION] update-identity: Unexpected error", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    })
    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
