import type { RelationshipFilterCategory } from "./relationship-filter"

interface ContributionWithRelationship {
  relationship?: string
}

export function filterByRelationship<T extends ContributionWithRelationship>(
  contributions: T[],
  category: RelationshipFilterCategory,
): T[] {
  if (category === "All") {
    return contributions
  }

  return contributions.filter((contribution) => {
    const relationship = contribution.relationship?.toLowerCase() || ""

    switch (category) {
      case "Manager":
        return relationship.includes("manager") || relationship.includes("lead") || relationship.includes("supervisor")
      case "Client":
        return relationship.includes("client") || relationship.includes("customer") || relationship.includes("partner")
      case "Colleague":
        return (
          relationship.includes("colleague") ||
          relationship.includes("peer") ||
          relationship.includes("coworker") ||
          relationship.includes("teammate")
        )
      default:
        return true
    }
  })
}
