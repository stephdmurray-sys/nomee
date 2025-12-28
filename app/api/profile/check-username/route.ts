import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  // Validate username format
  if (username.length < 3 || username.length > 30) {
    return NextResponse.json({ error: "Username must be 3-30 characters" }, { status: 400 })
  }

  if (!/^[a-z0-9-]+$/.test(username)) {
    return NextResponse.json(
      { error: "Username can only contain lowercase letters, numbers, and hyphens" },
      { status: 400 },
    )
  }

  try {
    const supabase = await createClient()

    // Check if username exists
    const { data, error } = await supabase.from("profiles").select("slug").eq("slug", username).maybeSingle()

    if (error) {
      console.error("Error checking username:", error)
      return NextResponse.json({ error: "Failed to check username" }, { status: 500 })
    }

    return NextResponse.json({ available: !data })
  } catch (error) {
    console.error("Error in check-username route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
