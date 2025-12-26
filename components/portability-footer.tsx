"use client"

import { Download, Code } from "lucide-react"

export function PortabilityFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[var(--quiet-indigo)]/10 shadow-2xl z-50">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="text-sm text-[var(--soft-gray-text)]">
          <span className="font-medium text-[var(--near-black)]">Verified Reputation Ledger</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white border border-[var(--quiet-indigo)]/20 text-sm font-medium text-[var(--near-black)] hover:bg-[var(--quiet-indigo)]/5 hover:border-[var(--quiet-indigo)]/30 transition-all duration-200 shadow-sm">
            <Code className="w-4 h-4" />
            Embed this Proof
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--quiet-indigo)] text-sm font-medium text-white hover:bg-[var(--quiet-indigo)]/90 transition-all duration-200 shadow-lg">
            <Download className="w-4 h-4" />
            Export Verified PDF
          </button>
        </div>
      </div>
    </div>
  )
}
