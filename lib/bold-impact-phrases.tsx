import type React from "react"
const IMPACT_PHRASES = [
  "increased",
  "drove",
  "tripled",
  "doubled",
  "results",
  "launched",
  "solved",
  "delivered",
  "achieved",
  "improved",
  "grew",
  "scaled",
  "revenue",
  "engagement",
  "performance",
]

const FEELS_PHRASES = [
  "trust",
  "easy to work with",
  "asks the right questions",
  "thoughtful",
  "polished",
  "collaborative",
  "transparent",
  "clear communication",
  "genuine",
  "supportive",
  "reliable",
]

export function boldPhrases(text: string, type: "impact" | "feels", maxBolds = 2): React.ReactNode {
  if (!text) return text

  const phrases = type === "impact" ? IMPACT_PHRASES : FEELS_PHRASES
  let bolded = 0
  const parts: React.ReactNode[] = []
  let remaining = text

  // Find and bold matching phrases
  phrases.forEach((phrase) => {
    if (bolded >= maxBolds) return

    const regex = new RegExp(`\\b(${phrase})\\b`, "gi")
    const match = remaining.match(regex)

    if (match) {
      const split = remaining.split(regex)
      split.forEach((part, idx) => {
        if (idx % 2 === 0) {
          parts.push(part)
        } else {
          parts.push(<strong key={`${phrase}-${idx}`}>{part}</strong>)
          bolded++
        }
      })
      remaining = "" // Reset after processing
    }
  })

  if (parts.length === 0) {
    return text
  }

  return parts
}
