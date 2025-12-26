import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Health - Starting Supabase connectivity check")

    const supabase = await createClient()

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("[v0] Health - Supabase Auth error:", error.message)
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          details: "Failed to connect to Supabase Auth",
        },
        { status: 503 },
      )
    }

    console.log("[v0] Health - ✅ Supabase Auth connection successful")
    return NextResponse.json({
      ok: true,
      message: "Supabase Auth connectivity verified",
      session: session ? "Active" : "None",
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Health - Error:", errorMessage)

    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
        details: "Failed to reach Supabase Auth endpoint",
      },
      { status: 503 },
    )
  }
}
