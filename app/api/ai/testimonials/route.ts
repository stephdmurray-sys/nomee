import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { contributions, profileName } = await req.json()

  if (!contributions || !profileName) {
    return NextResponse.json({ error: "Missing contributions or profileName" }, { status: 400 })
  }

  const testimonials = contributions
    .map((c: { written_note: string }) => c.written_note)
    .filter(Boolean)
    .join("\n\n")

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are analyzing testimonials about ${profileName}. Based on these testimonials, generate 3 short summary statements (one sentence each) that capture the overall feeling and experience of working with them. Each summary should be emotionally resonant and focus on the human experience, not just skills.

Testimonials:
${testimonials}

Return ONLY 3 summaries, one per line, without numbering or bullet points. Each should be 10-15 words max.`,
    })

    const generatedSummaries = text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 3)

    return NextResponse.json({ summaries: generatedSummaries })
  } catch (error) {
    console.error("[v0] Error generating summaries:", error)
    return NextResponse.json(
      {
        summaries: [
          "Working with them feels effortless and inspiring",
          "They bring clarity and calm to complex challenges",
          "People consistently highlight their authentic leadership style",
        ],
      },
      { status: 500 },
    )
  }
}
