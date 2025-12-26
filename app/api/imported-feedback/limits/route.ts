import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile to check plan
    const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get current upload count
    const { data: existingFeedback } = await supabase.from("imported_feedback").select("id").eq("profile_id", user.id)

    const currentCount = existingFeedback?.length || 0
    const plan = profile.plan || "free"

    // Define limits based on plan
    const limits = {
      free: 5,
      starter: 15,
      premier: Number.POSITIVE_INFINITY,
    }

    const limit = limits[plan as keyof typeof limits] || limits.free
    const isPro = plan === "premier"
    const remaining = isPro ? Number.POSITIVE_INFINITY : Math.max(0, limit - currentCount)

    return NextResponse.json({
      remaining,
      limit,
      currentCount,
      isPro,
      plan,
    })
  } catch (error) {
    console.error("[v0] Limits check error:", error)
    return NextResponse.json({ error: "Failed to check limits" }, { status: 500 })
  }
}
