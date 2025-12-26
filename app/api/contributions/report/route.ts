import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { checkRateLimit } from "@/lib/rate-limiter"

const VALID_REASONS = ["spam", "inappropriate", "false_information", "other"]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contributionId, reporterEmail, reason, details } = body

    if (!contributionId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Rate limit reports
    if (reporterEmail) {
      const rateLimit = await checkRateLimit(supabase, {
        identifier: reporterEmail.toLowerCase().trim(),
        action: "report",
        maxRequests: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
      })

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: "You've reached your reporting limit. Please try again later.",
          },
          { status: 429 },
        )
      }
    }

    // Verify contribution exists
    const { data: contribution, error: contributionError } = await supabase
      .from("contributions")
      .select("id, status")
      .eq("id", contributionId)
      .single()

    if (contributionError || !contribution) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 })
    }

    // Create report
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        contribution_id: contributionId,
        reporter_email: reporterEmail,
        reason,
        details,
        status: "pending",
      })
      .select("id")
      .single()

    if (reportError) {
      console.error("[v0] Report creation error:", reportError)
      return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
    }

    // If multiple reports, auto-flag the contribution
    const { count } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("contribution_id", contributionId)
      .eq("status", "pending")

    if (count && count >= 3) {
      await supabase
        .from("contributions")
        .update({
          flagged: true,
          flag_reason: `Auto-flagged: ${count} reports received`,
          flagged_at: new Date().toISOString(),
        })
        .eq("id", contributionId)
    }

    return NextResponse.json(
      {
        success: true,
        reportId: report.id,
        message: "Thank you for your report. We'll review it shortly.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Report API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
