"use client"

import { useState } from "react"

interface Contribution {
  id: string
  written_note: string
  traits_category1?: string[]
  traits_category2?: string[]
  traits_category3?: string[]
}

interface EchoLayerProps {
  contributions: Contribution[]
}

export function EchoLayer({ contributions }: EchoLayerProps) {
  const [isPaused, setIsPaused] = useState(false)

  const extractShortQuotes = () => {
    const quotes: string[] = []
    const seenQuotes = new Set<string>()

    for (const contribution of contributions) {
      if (!contribution.written_note) continue

      // Split by sentences
      const sentences = contribution.written_note.match(/[^.!?]+[.!?]+/g) || []

      for (const sentence of sentences) {
        const words = sentence.trim().split(/\s+/)
        const wordCount = words.length

        // Extract phrases between 6-14 words
        if (wordCount >= 6 && wordCount <= 14) {
          const quote = sentence.trim().replace(/[.!?]+$/, "")
          if (!seenQuotes.has(quote.toLowerCase())) {
            quotes.push(quote)
            seenQuotes.add(quote.toLowerCase())
          }
        } else if (wordCount > 14) {
          // Take first 10-12 words for longer sentences
          const excerpt = words.slice(0, 11).join(" ")
          if (!seenQuotes.has(excerpt.toLowerCase())) {
            quotes.push(excerpt)
            seenQuotes.add(excerpt.toLowerCase())
          }
        }

        if (quotes.length >= 15) break
      }

      if (quotes.length >= 15) break
    }

    return quotes
  }

  const quotes = extractShortQuotes()

  if (quotes.length === 0) return null

  // Duplicate quotes for seamless loop
  const allQuotes = [...quotes, ...quotes, ...quotes]

  return (
    null
  )
}
