"use client"

interface TrustMatrixProps {
  partnerships: number
  industries: number
  signalCount: number
}

export function TrustMatrix({ partnerships, industries, signalCount }: TrustMatrixProps) {
  return (
    <div className="flex items-center justify-center gap-12 py-8">
      <div className="text-center">
        <div className="text-4xl font-light text-[var(--near-black)] mb-1">{partnerships}</div>
        <div className="text-xs uppercase tracking-wider text-[var(--soft-gray-text)]">Partnerships</div>
      </div>
      <div className="h-12 w-px bg-[var(--quiet-indigo)]/20" />
      <div className="text-center">
        <div className="text-4xl font-light text-[var(--near-black)] mb-1">{industries}</div>
        <div className="text-xs uppercase tracking-wider text-[var(--soft-gray-text)]">Collaboration Length</div>
      </div>
      <div className="h-12 w-px bg-[var(--quiet-indigo)]/20" />
      <div className="text-center">
        <div className="text-4xl font-light text-[var(--near-black)] mb-1">{signalCount}</div>
        <div className="text-xs uppercase tracking-wider text-[var(--soft-gray-text)]">Verified Signals</div>
      </div>
    </div>
  )
}
