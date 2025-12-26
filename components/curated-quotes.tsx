"use client"

interface Contribution {
  id: string
  message: string
  audio_url: string | null
  contributor_name: string
  relationship: string
  company_or_org: string
  role?: string
}

interface CuratedQuotesProps {
  contributions: Contribution[]
  selectedTrait: string | null
}

function extractShortQuote(message: string): string {
  // Extract 1-2 sentences from the message
  const sentences = message
    .split(/[.!?]+/)
    .filter(Boolean)
    .map((s) => s.trim())

  if (sentences.length === 0) return message
  if (sentences.length === 1) return sentences[0]

  // Return first 2 sentences
  return sentences.slice(0, 2).join(". ") + "."
}

export function CuratedQuotes({ contributions, selectedTrait }: CuratedQuotesProps) {
  const curatedContributions = contributions.slice(0, 3)

  if (curatedContributions.length === 0) return null

  return (
    <section className="mb-24">
      <h2 className="text-sm uppercase tracking-widest text-[var(--quiet-indigo)] mb-8 font-medium">
        What people shared after working together
      </h2>

      <div className="space-y-8">
        {curatedContributions.map((contribution) => {
          const shortQuote = extractShortQuote(contribution.message)

          return (
            <article
              key={contribution.id}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <p className="text-base leading-relaxed text-[var(--near-black)]/80 mb-6 italic">"{shortQuote}"</p>

              <footer className="text-sm text-[var(--soft-gray-text)] border-l-2 border-[var(--quiet-indigo)]/30 pl-4">
                <p className="font-semibold text-[var(--near-black)] mb-1">— {contribution.contributor_name}</p>
                <p>
                  {contribution.role || "Professional collaborator"} · {contribution.company_or_org || "Client"}
                </p>
                <p className="mt-0.5">{contribution.relationship}</p>
              </footer>
            </article>
          )
        })}
      </div>
    </section>
  )
}
