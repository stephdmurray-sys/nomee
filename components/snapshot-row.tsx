"use client"

import { PremiumPill } from "./premium-pill"

interface SnapshotRowProps {
  firstName: string
  vibes: Array<{ label: string; count: number }>
  traits: Array<{ label: string; count: number }>
  onVibeClick: (vibe: string) => void
  onTraitClick: (trait: string) => void
  selectedVibe: string | null
  selectedTrait: string | null
}

export function SnapshotRow({
  firstName,
  vibes,
  traits,
  onVibeClick,
  onTraitClick,
  selectedVibe,
  selectedTrait,
}: SnapshotRowProps) {
  const showVibeCard = vibes.length > 0
  const topVibes = vibes.slice(0, 6)
  const topTraits = traits.slice(0, 6)

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
      <div className={`grid gap-4 ${showVibeCard ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-3xl mx-auto"}`}>
        {/* Left card: {firstName}'s vibe */}
        {showVibeCard && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-900">{firstName}'s vibe</h3>
              <p className="text-sm text-muted-text">What people consistently feel</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {topVibes.map((vibe, index) => (
                <PremiumPill
                  key={vibe.label}
                  variant="vibe"
                  count={vibe.count}
                  isActive={selectedVibe === vibe.label}
                  showIndicator={selectedVibe === vibe.label}
                  onClick={() => onVibeClick(vibe.label)}
                  className={index < 3 ? "text-base" : ""}
                >
                  {vibe.label}
                </PremiumPill>
              ))}
            </div>
          </div>
        )}

        {/* Right card: Known for */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900">Known for</h3>
            <p className="text-sm text-muted-text">Most repeated signals</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {topTraits.map((trait, index) => (
              <PremiumPill
                key={trait.label}
                variant="trait"
                count={trait.count}
                isActive={selectedTrait === trait.label}
                showIndicator={selectedTrait === trait.label}
                onClick={() => onTraitClick(trait.label)}
                className={index < 3 ? "text-base" : ""}
              >
                {trait.label}
              </PremiumPill>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
