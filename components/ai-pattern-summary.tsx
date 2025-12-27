"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

interface Contribution {
  id: string
  written_note: string
  relationship: string
  traits_category1?: string[]
  traits_category2?: string[]
  traits_category3?: string[]
  traits_category4?: string[]
}

interface ImportedFeedback {
  id: string
  ocr_text: string | null
  ai_extracted_excerpt: string | null
  traits: string[] | null
  included_in_analysis: boolean
}

interface AiPatternSummaryProps {
  contributions: Contribution[]
  importedFeedback: ImportedFeedback[]
  topTraits: { label: string; count: number }[]
}

export function AiPatternSummary({ contributions, importedFeedback, topTraits }: AiPatternSummaryProps) {
  const [summary, setSummary] = useState<{
    synthesis: string
    patterns: string[]
    relationshipInsights?: { role: string; qualities: string[] }[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    generateSummary()
  }, [contributions, importedFeedback, topTraits])

  const generateSummary = () => {
    if (contributions.length === 0 || topTraits.length === 0) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const analyzableUploads = (importedFeedback || []).filter((u) => u.included_in_analysis && u.ocr_text)

    const top3Traits = topTraits.slice(0, 3).map((t) => t.label.toLowerCase())

    const totalSources = contributions.length + analyzableUploads.length
    const uploadNote = analyzableUploads.length > 0 ? ` across ${totalSources} sources` : ""

    const synthesis = `People consistently describe working with this person as ${top3Traits.slice(0, 2).join(" and ")}, with a strong emphasis on ${top3Traits[2] || "collaboration"}${uploadNote}.`

    const patterns: string[] = []

    const behaviorPatterns: Record<string, number> = {}

    const allTexts = [...contributions.map((c) => c.written_note), ...analyzableUploads.map((u) => u.ocr_text || "")]

    allTexts.forEach((text) => {
      const textLower = text.toLowerCase()

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
        while ((match = regex.exec(textLower)) !== null) {
          const key = extract(match)
          behaviorPatterns[key] = (behaviorPatterns[key] || 0) + 1
        }
      })
    })

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
        const qualityMap: Record<string, number> = {}

        filtered.forEach((c) => {
          const text = c.written_note.toLowerCase()

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

    setIsLoading(false)
  }

  if (isLoading && contributions.length > 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-neutral-100 rounded-lg"></div>
        <div className="h-8 bg-neutral-100 rounded-lg w-1/2"></div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-neutral-500">Summary will appear once contributions are received.</p>
      </div>
    )
  }

  const needsExpand = summary.synthesis.length > 240

  return (
    <div className="space-y-5">
      <div className="relative">
        <p
          className={`text-neutral-700 leading-relaxed text-lg md:text-xl transition-all duration-300 ${
            !isExpanded && needsExpand ? "line-clamp-2" : ""
          }`}
          style={{ lineHeight: "1.7" }}
        >
          {summary.synthesis}
        </p>

        {needsExpand && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors font-medium"
          >
            {isExpanded ? "Read less" : "Read more"}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {summary.patterns.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Most mentioned signals</p>
          <div className="flex flex-wrap gap-3">
            {summary.patterns.slice(0, 4).map((pattern, index) => (
              <span
                key={index}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 transition-all duration-300 ease-out cursor-default hover:scale-105 hover:shadow-lg hover:shadow-blue-100/50 hover:bg-blue-100 hover:border-blue-200 hover:-translate-y-0.5"
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
