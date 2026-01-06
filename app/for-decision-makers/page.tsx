"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { motion } from "framer-motion"

export default function ForDecisionMakersPage() {
  const [activeRole, setActiveRole] = useState<"hiring" | "partnerships" | "clients">("hiring")

  const roleContent = {
    hiring: {
      sectionLabel: "Candidate evaluation",
      themes: ["Strategic", "Clear communicator", "Reliable"],
      quotes: [
        {
          text: "Brings clarity to complex projects. Always two steps ahead.",
          highlights: [
            { text: "clarity", theme: "Clear communicator" },
            { text: "two steps ahead", theme: "Strategic" },
          ],
          source: "From email",
        },
        {
          text: "A reliable collaborator who elevates everyone around them.",
          highlights: [{ text: "reliable", theme: "Reliable" }],
          source: "From Slack",
        },
      ],
    },
    partnerships: {
      sectionLabel: "Partner validation",
      themes: ["Dependable", "Strategic", "Clear vision"],
      quotes: [
        {
          text: "Zero surprises. Delivered exactly what was promised on schedule.",
          highlights: [
            { text: "Zero surprises", theme: "Dependable" },
            { text: "on schedule", theme: "Dependable" },
          ],
          source: "From email",
        },
        {
          text: "Thinks three steps ahead and communicates a clear vision.",
          highlights: [
            { text: "three steps ahead", theme: "Strategic" },
            { text: "clear vision", theme: "Clear vision" },
          ],
          source: "From text message",
        },
      ],
    },
    clients: {
      sectionLabel: "Collaboration preview",
      themes: ["Clear direction", "Delivers results", "Responsive"],
      quotes: [
        {
          text: "Delivered exactly what we needed. Clear timelines from day one.",
          highlights: [
            { text: "Delivered exactly what we needed", theme: "Delivers results" },
            { text: "Clear timelines", theme: "Clear direction" },
          ],
          source: "From email",
        },
        {
          text: "Always responsive and keeps the project moving forward smoothly.",
          highlights: [{ text: "responsive", theme: "Responsive" }],
          source: "From Slack",
        },
      ],
    },
  }

  const currentContent = roleContent[activeRole]

  // Helper function to render text with highlights
  const renderQuoteWithHighlights = (text: string, highlights: Array<{ text: string; theme: string }>) => {
    const result = text
    const parts: Array<{ text: string; isHighlight: boolean }> = []
    let lastIndex = 0

    // Sort highlights by their position in the text
    const sortedHighlights = [...highlights].sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text))

    sortedHighlights.forEach((highlight) => {
      const index = text.indexOf(highlight.text, lastIndex)
      if (index !== -1) {
        // Add non-highlighted text before this highlight
        if (index > lastIndex) {
          parts.push({ text: text.substring(lastIndex, index), isHighlight: false })
        }
        // Add highlighted text
        parts.push({ text: highlight.text, isHighlight: true })
        lastIndex = index + highlight.text.length
      }
    })

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), isHighlight: false })
    }

    return (
      <>
        {parts.map((part, i) =>
          part.isHighlight ? (
            <span key={i} className="bg-yellow-200/60 px-1 rounded">
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO — VALUE IN ONE GLANCE */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">~1 min read</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight leading-tight px-2">
            See how people actually experience working with someone.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            Real feedback, saved as it happens — organized into clear signals.
          </p>
        </div>
      </section>

      {/* ROLE TOGGLE — CONTEXT WITHOUT COMPLEXITY */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 border-y border-slate-200 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-start sm:justify-center gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:pb-0">
            <button
              onClick={() => setActiveRole("hiring")}
              className={`flex-shrink-0 snap-center px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                activeRole === "hiring"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              Hiring
            </button>
            <button
              onClick={() => setActiveRole("partnerships")}
              className={`flex-shrink-0 snap-center px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                activeRole === "partnerships"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              Partnerships
            </button>
            <button
              onClick={() => setActiveRole("clients")}
              className={`flex-shrink-0 snap-center px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                activeRole === "clients"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              Clients
            </button>
          </div>
        </div>
      </section>

      {/* DECISION-MAKER VIEW — CORE CONTENT */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            {currentContent.sectionLabel}
          </h2>

          <motion.div
            key={activeRole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6 sm:mt-8"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
              {/* Common Themes */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">Common themes</h3>
                <div className="flex flex-wrap gap-2">
                  {currentContent.themes.map((theme, i) => (
                    <span key={i} className="bg-slate-100 text-slate-900 px-3 py-1.5 rounded-full text-sm font-medium">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* What people say */}
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-4">What people say</h3>
                <div className="space-y-6">
                  {currentContent.quotes.map((quote, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-base sm:text-lg text-slate-900 leading-relaxed">
                        "{renderQuoteWithHighlights(quote.text, quote.highlights)}"
                      </p>
                      <p className="text-sm text-slate-500">{quote.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* PATTERN PROOF — QUIET AUTHORITY */}
          <p className="text-xs sm:text-sm text-slate-500 text-center mt-4 sm:mt-6 px-2">
            Patterns shown across multiple moments — not a single reference.
          </p>
        </div>
      </section>

      {/* WHAT THIS REPLACES — DECISION CLARITY */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 text-center mb-8 sm:mb-12 leading-tight px-2">
            This replaces guesswork.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Instead of */}
            <div className="space-y-4 bg-white md:bg-transparent rounded-xl md:rounded-none p-6 md:p-0">
              <h3 className="text-base sm:text-lg font-medium text-slate-500 mb-4 sm:mb-6">Instead of</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">References you chase</p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">Testimonials written later</p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">Self-reported strengths</p>
            </div>

            {/* You get */}
            <div className="space-y-4 bg-slate-900 md:bg-transparent text-white md:text-slate-900 rounded-xl md:rounded-none p-6 md:p-0">
              <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">You get</h3>
              <p className="text-sm sm:text-base leading-relaxed">Saved feedback in real time</p>
              <p className="text-sm sm:text-base leading-relaxed">Repeated patterns</p>
              <p className="text-sm sm:text-base leading-relaxed">One link that shows the truth</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA — DECISION, NOT SALES */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 leading-tight px-2">
            Review someone in under a minute.
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 px-2">
            See what consistently shows up — before you decide.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Button size="lg" className="w-full sm:w-auto min-h-[48px]" asChild>
              <Link href="/maya-torres">View a Nomee example</Link>
            </Button>

            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-block sm:inline text-center py-3 sm:py-0 text-sm text-slate-600 hover:text-slate-900 transition-colors min-h-[48px] sm:min-h-0 flex sm:inline-flex items-center justify-center"
            >
              Create a Nomee link
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
