"use client"

import { useState } from "react"
import { BentoGridHeatmap } from "./bento-grid-heatmap"

interface Trait {
  label: string
  count: number
}

interface Contribution {
  id: string
  message: string
  contributor_name: string
  audio_url: string | null
  role: string | null
  company_or_org: string | null
  relationship: string
}

interface ReputationLedgerClientProps {
  traits: Trait[]
  contributions: Contribution[]
  traitToContributions: Map<string, string[]>
}

export function ReputationLedgerClient({ traits, contributions, traitToContributions }: ReputationLedgerClientProps) {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null)

  const filteredContributions = selectedTrait
    ? contributions.filter((c) => traitToContributions.get(selectedTrait)?.includes(c.id))
    : contributions

  return (
    <>
      <section className="mb-24 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-sm uppercase tracking-widest text-[var(--quiet-indigo)] mb-8 font-semibold">
          Interactive Signal Heatmap
        </h2>
        <p className="text-sm text-[var(--soft-gray-text)] mb-6">
          Click any trait to filter testimonials below. See exactly where each quality was mentioned.
        </p>
        <BentoGridHeatmap traits={traits} onTraitClick={(trait) => setSelectedTrait(trait)} />
        {selectedTrait && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-[var(--quiet-indigo)]">
              Filtering by: <span className="font-semibold">{selectedTrait}</span>
            </span>
            <button
              onClick={() => setSelectedTrait(null)}
              className="text-xs text-[var(--soft-gray-text)] hover:text-[var(--near-black)] underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </section>

      <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-sm uppercase tracking-widest text-[var(--quiet-indigo)] mb-12 font-semibold">
          Human Voice Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredContributions.map((contribution, idx) => {
            const colors = ["bg-white", "bg-slate-50", "bg-blue-50/50", "bg-indigo-50/50"]
            const bgColor = colors[idx % colors.length]

            return (
              <article
                key={contribution.id}
                className={`${bgColor} p-8 rounded-xl border border-slate-200/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
                style={{
                  opacity: 0,
                  animation: "fadeInViewport 0.6s ease-out forwards",
                  animationDelay: `${Math.min(idx * 0.1, 1.5)}s`,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="mb-6">
                  <p className="text-lg leading-relaxed text-[var(--near-black)] font-serif italic">
                    "{contribution.message}"
                  </p>
                </div>

                {contribution.audio_url && (
                  <div className="mb-6 pb-6 border-b border-slate-200/60">
                    <p className="text-xs uppercase tracking-wider text-[var(--soft-gray-text)]/60 font-semibold mb-3">
                      Verified Audio
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm text-[var(--soft-gray-text)]">Voice note available</span>
                    </div>
                  </div>
                )}

                <footer className="space-y-2">
                  <p className="font-semibold text-[var(--near-black)]">{contribution.contributor_name}</p>
                  <p className="text-sm text-[var(--soft-gray-text)]">
                    {contribution.role || "Professional collaborator"}
                    {contribution.company_or_org && ` at ${contribution.company_or_org}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {contribution.relationship}
                    </span>
                  </div>
                </footer>
              </article>
            )
          })}
        </div>

        {filteredContributions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--soft-gray-text)]">
              No testimonials found with this trait. Try selecting a different one.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
