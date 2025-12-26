import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")
  const contributionId = searchParams.get("id")

  if (!token || !contributionId) {
    return NextResponse.redirect(new URL("/?error=invalid-link", request.url))
  }

  const supabase = createAdminClient()

  const { data: contribution, error } = await supabase
    .from("contributions")
    .select("id, status, profiles!contributions_profile_id_fkey(username, full_name)")
    .eq("id", contributionId)
    .eq("confirmation_token", token)
    .eq("status", "pending_confirmation")
    .maybeSingle()

  if (error || !contribution) {
    console.error("[v0] Confirmation error:", error)
    return NextResponse.redirect(new URL("/?error=not-found", request.url))
  }

  const { error: updateError } = await supabase
    .from("contributions")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", contributionId)

  if (updateError) {
    console.error("[v0] Update error:", updateError)
    return NextResponse.redirect(new URL("/?error=confirmation-failed", request.url))
  }

  const profileUsername = contribution.profiles?.username || "dashboard"
  return NextResponse.redirect(new URL(`/${profileUsername}?confirmed=true`, request.url))
}
