"use client"

import { useState } from "react"
import { TraitFilterClient } from "./trait-filter-client"
import { IntimateAudioPlayer } from "./intimate-audio-player"

interface Contribution {
  id: string
  message: string
  contributor_name: string
  audio_url: string | null
  role: string | null
  company_or_org: string | null
  relationship: string
}

interface TraitFilterClientWrapperProps {
  traits: { label: string; count: number }[]
  contributions: Contribution[]
  traitToContributions: Map<string, Set<string>>
  ownerFirstName: string
}

export function TraitFilterClientWrapper({
  traits,
  contributions,
  traitToContributions,
  ownerFirstName,
}: TraitFilterClientWrapperProps) {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null)
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null)

  const availableRelationships = Array.from(new Set(contributions.map((c) => c.relationship).filter(Boolean))).sort()

  console.log("[v0] Available relationships:", availableRelationships)
  console.log("[v0] Contributions count:", contributions.length)

  const filteredContributions = contributions.filter((c) => {
    const matchesTrait = selectedTrait ? traitToContributions.get(selectedTrait)?.has(c.id) : true
    const matchesRelationship = selectedRelationship ? c.relationship === selectedRelationship : true
    return matchesTrait && matchesRelationship
  })

  const multipleCollaborators =
    selectedTrait && traitToContributions.get(selectedTrait) ? traitToContributions.get(selectedTrait)!.size > 1 : false

  const generateExperienceDescriptors = () => {
    const topTraits = traits.slice(0, 4).map((t) => t.label.toLowerCase())

    const traitToDescriptor: Record<string, string> = {
      "strategic thinker": "Clear and forward-moving",
      "gets things done": "Decisive and reliable",
      empathetic: "Thoughtful and supportive",
      resourceful: "Solution-oriented under pressure",
      encouraging: "Supportive and motivating",
      "moves fast": "Quick to execute",
      supportive: "Reliable and encouraging",
      "positive energy": "Uplifting presence",
      collaborative: "Easy to partner with",
      communicative: "Clear in updates",
      organized: "Structured and reliable",
      "detail-oriented": "Thorough and precise",
      proactive: "Takes initiative consistently",
      creative: "Brings fresh perspective",
      analytical: "Data-driven in approach",
      decisive: "Clear in decisions",
      patient: "Calm under pressure",
      flexible: "Adapts quickly",
      "team player": "Collaborative by nature",
      mentor: "Develops others naturally",
    }

    const descriptors: string[] = []
    topTraits.forEach((trait) => {
      if (traitToDescriptor[trait]) {
        descriptors.push(traitToDescriptor[trait])
      }
    })

    if (descriptors.length === 0) {
      return ["Clear in communication", "Reliable in execution", "Thoughtful in approach"]
    }

    return descriptors.slice(0, 4)
  }

  const experienceDescriptors = generateExperienceDescriptors()

  const colorPalette = [
    "bg-yellow-50/80",
    "bg-purple-50/80",
    "bg-blue-50/80",
    "bg-pink-50/80",
    "bg-green-50/80",
    "bg-orange-50/80",
  ]

  return (
    <>
      {/* Traits Section */}
      <section className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <TraitFilterClient traits={traits} onFilterChange={setSelectedTrait} ownerFirstName={ownerFirstName} />
      </section>

      {/* Complete Reflections Section */}
      <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-sm uppercase tracking-widest text-[var(--quiet-indigo)]/80 mb-8 font-medium">
          How it feels to work with {ownerFirstName}
        </h2>
        <p className="text-[1.15rem] leading-relaxed text-[var(--near-black)]/90 font-medium max-w-3xl mb-8">
          Collaborators describe the experience as clear and forward-moving—someone who brings thoughtful support while
          maintaining decisive action. Projects feel well-structured, with consistent reliability and encouragement that
          keeps momentum steady even when complexity increases.
        </p>

        {availableRelationships.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {availableRelationships.map((relationship) => {
              const isSelected = selectedRelationship === relationship
              return (
                <button
                  key={relationship}
                  onClick={() => setSelectedRelationship(isSelected ? null : relationship)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-light transition-all duration-150
                    ${
                      isSelected
                        ? "bg-slate-800 text-white shadow-md scale-[1.02]"
                        : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                    }
                  `}
                >
                  {relationship}
                </button>
              )
            })}
          </div>
        )}

        {selectedTrait && multipleCollaborators && (
          <p className="text-sm text-[var(--soft-gray-text)]/70 mb-8 font-light italic">
            This quality appears across multiple collaborators.
          </p>
        )}

        <div
          className="columns-1 md:columns-2 lg:columns-3 gap-6"
          style={{
            columnGap: "1.5rem",
          }}
        >
          {filteredContributions.map((contribution, idx) => {
            const bgColor = colorPalette[idx % colorPalette.length]
            const matchesTrait = selectedTrait ? traitToContributions.get(selectedTrait)?.has(contribution.id) : true
            const matchesRelationship = selectedRelationship ? contribution.relationship === selectedRelationship : true
            const isMatch = matchesTrait && matchesRelationship
            const opacity = isMatch ? 1 : 0.35

            return (
              <article
                key={contribution.id}
                className={`${bgColor} p-8 rounded-2xl border border-white/60 break-inside-avoid mb-6 transition-all duration-500`}
                style={{
                  opacity: opacity,
                  animation: "fadeInViewport 0.6s ease-out forwards",
                  animationDelay: `${Math.min(idx * 0.1, 1.5)}s`,
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                }}
              >
                <div className="mb-6">
                  <span className="text-6xl text-[var(--quiet-indigo)]/20 font-serif leading-none">"</span>
                  <p className="text-base leading-relaxed text-[var(--near-black)] font-serif italic mt-2">
                    {contribution.message}
                  </p>
                </div>

                {contribution.audio_url && (
                  <div className="mb-6 pb-6 border-b border-white/60">
                    <p className="text-xs uppercase tracking-wider text-[var(--soft-gray-text)]/60 font-light mb-3">
                      In their own voice
                    </p>
                    <IntimateAudioPlayer audioUrl={contribution.audio_url} />
                  </div>
                )}

                <footer className="space-y-2">
                  <p className="font-medium text-[var(--near-black)]">— {contribution.contributor_name}</p>
                  <p className="text-sm text-[var(--soft-gray-text)] font-light">
                    {contribution.role || "Professional collaborator"}
                    {contribution.company_or_org && ` · ${contribution.company_or_org}`}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/60 text-[var(--soft-gray-text)] font-light">
                      {contribution.relationship}
                    </span>
                  </div>
                </footer>
              </article>
            )
          })}
        </div>

        {filteredContributions.length === 0 && (selectedTrait || selectedRelationship) && (
          <div className="text-center py-12">
            <p className="text-sm text-[var(--soft-gray-text)] font-light italic">
              No reflections found with this filter.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
