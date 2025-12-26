import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/contributions/attach-voice instead." },
    { status: 410 },
  )
}
