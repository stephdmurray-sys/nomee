"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Contribution {
  id: string
  written_note: string
  relationship: string
  traits_category1?: string[]
  traits_category2?: string[]
  traits_category3?: string[]
  traits_category4?: string[]
}

interface AiPatternSummaryProps {
  contributions: Contribution[]
  topTraits: { label: string; count: number }[]
}

export function AiPatternSummary({ contributions, topTraits }: AiPatternSummaryProps) {
  const [summary, setSummary] = useState<{
    synthesis: string
    patterns: string[]
    relationshipInsights?: { role: string; qualities: string[] }[]
  } | null>(null)

  useEffect(() => {
    generateSummary()
  }, [contributions, topTraits])

  const generateSummary = () => {
    if (contributions.length === 0 || topTraits.length === 0) return

    // Extract top 3 traits
    const top3Traits = topTraits.slice(0, 3).map((t) => t.label.toLowerCase())

    // Generate synthesis sentence
    const synthesis = `People consistently describe working with this person as ${top3Traits.slice(0, 2).join(" and ")}, with a strong emphasis on ${top3Traits[2] || "collaboration"}.`

    const patterns: string[] = []

    const behaviorPatterns: Record<string, number> = {}

    contributions.forEach((c) => {
      const text = c.written_note.toLowerCase()

      // Look for actual behavioral descriptions
      const behaviorRegexes = [
        {
          regex: /(brings|delivers|provides) (\w+) (ideas|solutions|perspectives|thinking)/g,
          extract: (m: RegExpMatchArray) => `Brings ${m[2]} ${m[3]}`,
        },
        {
          regex: /(always|consistently) (delivers|shows up|communicates|follows through)/g,
          extract: (m: RegExpMatchArray) => `${m[1].charAt(0).toUpperCase() + m[1].slice(1)} ${m[2]}`,
        },
        {
          regex: /(helps|makes) (teams|everyone|us) (better|stronger|successful)/g,
          extract: () => "Makes teams better",
        },
        { regex: /(quick|responsive|fast) (to respond|turnaround|communication)/g, extract: () => "Quick to respond" },
        {
          regex: /great (problem solver|communicator|collaborator|partner)/g,
          extract: (m: RegExpMatchArray) => `Great ${m[1]}`,
        },
      ]

      behaviorRegexes.forEach(({ regex, extract }) => {
        let match
        while ((match = regex.exec(text)) !== null) {
          const key = extract(match)
          behaviorPatterns[key] = (behaviorPatterns[key] || 0) + 1
        }
      })
    })

    // Get top 3 behavioral patterns with at least 2 mentions
    const sortedBehaviors = Object.entries(behaviorPatterns)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    sortedBehaviors.forEach(([behavior]) => {
      patterns.push(behavior)
    })

    if (patterns.length < 3) {
      const traitTemplates = [
        (trait: string) => `Known for being ${trait}`,
        (trait: string) => `Reputation for ${trait} work`,
        (trait: string) => `Recognized for ${trait} approach`,
      ]

      let templateIndex = 0
      for (let i = patterns.length; i < 3 && i < top3Traits.length; i++) {
        patterns.push(traitTemplates[templateIndex](top3Traits[i]))
        templateIndex++
      }
    }

    const relationshipInsights: { role: string; qualities: string[] }[] = []

    const relationshipGroups = [
      { key: "client", variations: ["client"] },
      { key: "peer", variations: ["peer", "together", "colleague"] },
      { key: "manager", variations: ["manager", "lead", "direct report"] },
    ]

    relationshipGroups.forEach(({ key, variations }) => {
      const filtered = contributions.filter((c) => variations.some((v) => c.relationship?.toLowerCase().includes(v)))

      if (filtered.length >= 2) {
        // Extract most common qualities mentioned by this relationship type
        const qualityMap: Record<string, number> = {}

        filtered.forEach((c) => {
          const text = c.written_note.toLowerCase()

          // Extract quality descriptors
          const qualityRegexes = [
            /\b(reliable|dependable|consistent|trustworthy)\b/g,
            /\b(creative|innovative|strategic|visionary)\b/g,
            /\b(problem solver|solution-oriented|resourceful)\b/g,
            /\b(collaborative|team player|supportive)\b/g,
          ]

          qualityRegexes.forEach((regex) => {
            let match
            while ((match = regex.exec(text)) !== null) {
              qualityMap[match[1]] = (qualityMap[match[1]] || 0) + 1
            }
          })
        })

        const topQualities = Object.entries(qualityMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([quality]) => quality)

        if (topQualities.length > 0) {
          relationshipInsights.push({
            role: key.charAt(0).toUpperCase() + key.slice(1) + "s",
            qualities: topQualities,
          })
        }
      }
    })

    setSummary({
      synthesis,
      patterns: patterns.slice(0, 3),
      relationshipInsights: relationshipInsights.length >= 2 ? relationshipInsights : undefined,
    })
  }

  if (!summary) return null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full py-12 px-6 bg-neutral-50/30"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">Pattern Summary</h2>
          <p className="text-xs text-neutral-400">AI-generated from recurring themes across real collaborators</p>
        </div>

        <div className="space-y-8">
          {/* Synthesis */}
          <p className="text-neutral-700 leading-relaxed text-center text-2xl">{summary.synthesis}</p>

          {summary.patterns.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column: Most consistent patterns */}
              <div>
                <h3 className="text-sm font-medium text-neutral-600 mb-4">Most consistent patterns</h3>
                <div className="space-y-3">
                  {summary.patterns.map((pattern, index) => (
                    <div key={index} className="bg-white rounded-lg px-4 py-3 border border-neutral-100">
                      <div className="text-sm text-neutral-700">{pattern}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: How different collaborators describe them */}
              {summary.relationshipInsights && summary.relationshipInsights.length >= 2 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-600 mb-4">
                    How different collaborators describe them
                  </h3>
                  <div className="space-y-3">
                    {summary.relationshipInsights.map((insight, index) => (
                      <div key={index} className="bg-white rounded-lg px-4 py-3 border border-neutral-100">
                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5">
                          {insight.role}
                        </div>
                        <div className="text-sm text-neutral-700">{insight.qualities.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
