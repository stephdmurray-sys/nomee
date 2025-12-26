import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const contributionId = searchParams.get("id")

  if (!token || !contributionId) {
    return NextResponse.redirect(new URL("/?error=invalid-link", request.url))
  }

  const supabase = await createClient()

  const { data: contribution, error } = await supabase
    .from("contributions")
    .select("*, profiles!contributions_profile_id_fkey(username)")
    .eq("id", contributionId)
    .eq("status", "pending")
    .maybeSingle()

  if (error || !contribution) {
    return NextResponse.redirect(new URL("/?error=not-found", request.url))
  }

  // TODO: Verify token matches (implement secure token verification)

  const { error: updateError } = await supabase
    .from("contributions")
    .update({
      verified: true,
      status: "verified",
    })
    .eq("id", contributionId)

  if (updateError) {
    return NextResponse.redirect(new URL("/?error=confirmation-failed", request.url))
  }

  const profileUsername = contribution.profiles?.username || "dashboard"
  return NextResponse.redirect(new URL(`/${profileUsername}?confirmed=true`, request.url))
}
