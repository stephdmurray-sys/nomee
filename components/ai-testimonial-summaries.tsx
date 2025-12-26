"use client"

import { useState, useEffect } from "react"

interface AITestimonialSummariesProps {
  contributions: any[]
  profileName: string
}

export function AITestimonialSummaries({ contributions, profileName }: AITestimonialSummariesProps) {
  const [summaries, setSummaries] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    async function generateSummaries() {
      if (contributions.length === 0) {
        setIsGenerating(false)
        return
      }

      try {
        const response = await fetch("/api/ai/testimonials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contributions, profileName }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setSummaries(data.summaries)
      } catch (error) {
        console.error("[v0] Error fetching summaries:", error)
        // Fallback summaries
        setSummaries([
          "Working with them feels effortless and inspiring",
          "They bring clarity and calm to complex challenges",
          "People consistently highlight their authentic leadership style",
        ])
      } finally {
        setIsGenerating(false)
      }
    }

    generateSummaries()
  }, [contributions, profileName])

  // Cycle through summaries every 4 seconds
  useEffect(() => {
    if (summaries.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % summaries.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [summaries.length])

  if (isGenerating || summaries.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <div className="animate-pulse text-neutral-400 text-lg">Analyzing perspectives...</div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-neutral-50 via-white to-neutral-50 border-y border-neutral-200 py-12">
      <div className="relative h-24 flex items-center justify-center px-6">
        {summaries.map((summary, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center px-6 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-xl md:text-2xl font-light text-neutral-800 text-center text-balance max-w-3xl">
              "{summary}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
