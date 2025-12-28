/**
 * Maps raw relationship values from database into standardized filter categories
 */
export type RelationshipFilterCategory =
  | "All"
  | "Manager"
  | "Teammate"
  | "Direct Report"
  | "Client"
  | "Vendor"
  | "Mentor"
  | "Collaborator"

export function mapRelationshipToCategory(relationship: string | null | undefined): RelationshipFilterCategory {
  if (!relationship) return "Collaborator"

  const normalized = relationship.toLowerCase().trim()

  // Manager
  if (normalized.includes("manager") || normalized.includes("supervisor") || normalized.includes("lead")) {
    return "Manager"
  }

  // Direct Report
  if (normalized === "direct_report" || normalized === "direct report" || normalized.includes("reporting to me")) {
    return "Direct Report"
  }

  // Teammate
  if (normalized === "teammate" || normalized.includes("coworker") || normalized.includes("colleague")) {
    return "Teammate"
  }

  // Client
  if (normalized === "client" || normalized.includes("customer") || normalized.includes("brand")) {
    return "Client"
  }

  // Vendor
  if (normalized === "vendor" || normalized.includes("supplier") || normalized.includes("contractor")) {
    return "Vendor"
  }

  // Mentor (includes legacy "advisor" mapping)
  if (normalized === "mentor" || normalized === "advisor" || normalized.includes("coach")) {
    return "Mentor"
  }

  // Collaborator (includes legacy "peer", "partner", "founder" mappings)
  if (normalized === "collaborator" || normalized === "peer" || normalized === "partner" || normalized === "founder") {
    return "Collaborator"
  }

  // Default fallback
  return "Collaborator"
}

/**
 * Gets count of contributions per relationship category
 */
export function getRelationshipCounts(contributions: any[]): Record<RelationshipFilterCategory, number> {
  const counts: Record<RelationshipFilterCategory, number> = {
    All: contributions.length,
    Manager: 0,
    Teammate: 0,
    "Direct Report": 0,
    Client: 0,
    Vendor: 0,
    Mentor: 0,
    Collaborator: 0,
  }

  contributions.forEach((c) => {
    const category = mapRelationshipToCategory(c.relationship)
    counts[category]++
  })

  return counts
}

/**
 * Filters contributions by relationship category
 */
export function filterByRelationship(contributions: any[], selectedCategory: RelationshipFilterCategory): any[] {
  if (selectedCategory === "All") {
    return contributions
  }

  return contributions.filter((c) => {
    const category = mapRelationshipToCategory(c.relationship)
    return category === selectedCategory
  })
}
