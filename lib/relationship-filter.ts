/**
 * Maps raw relationship values from database into standardized filter categories
 */
export type RelationshipFilterCategory = "All" | "Manager" | "Direct report" | "Peer" | "Client" | "Other"

export function mapRelationshipToCategory(relationship: string | null | undefined): RelationshipFilterCategory {
  if (!relationship) return "Other"

  const normalized = relationship.toLowerCase().trim()

  // Manager/supervisor/lead → Manager
  if (normalized.includes("manager") || normalized.includes("supervisor") || normalized.includes("lead")) {
    return "Manager"
  }

  // Direct report/reporting to me → Direct report
  if (
    normalized.includes("direct_report") ||
    normalized.includes("direct report") ||
    normalized.includes("reporting to me")
  ) {
    return "Direct report"
  }

  // Peer/teammate/coworker/collaborator → Peer
  if (
    normalized.includes("peer") ||
    normalized.includes("teammate") ||
    normalized.includes("coworker") ||
    normalized.includes("collaborator") ||
    normalized.includes("colleague")
  ) {
    return "Peer"
  }

  // Client/customer/brand → Client
  if (normalized.includes("client") || normalized.includes("customer") || normalized.includes("brand")) {
    return "Client"
  }

  // Everything else → Other
  return "Other"
}

/**
 * Gets count of contributions per relationship category
 */
export function getRelationshipCounts(contributions: any[]): Record<RelationshipFilterCategory, number> {
  const counts: Record<RelationshipFilterCategory, number> = {
    All: contributions.length,
    Manager: 0,
    "Direct report": 0,
    Peer: 0,
    Client: 0,
    Other: 0,
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
