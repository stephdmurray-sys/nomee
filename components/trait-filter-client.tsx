"use client"

import { useState } from "react"
import { TraitFilterHeatmap } from "./trait-filter-heatmap"

interface TraitFilterClientProps {
  traits: { label: string; count: number }[]
  onFilterChange: (trait: string | null) => void
  ownerFirstName: string
}

export function TraitFilterClient({ traits, onFilterChange, ownerFirstName }: TraitFilterClientProps) {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null)

  const handleFilterChange = (trait: string | null) => {
    setSelectedTrait(trait)
    onFilterChange(trait)
  }

  return <TraitFilterHeatmap traits={traits} onFilterChange={handleFilterChange} ownerFirstName={ownerFirstName} />
}
