interface ContributionLike {
  id: string
  contributor_name?: string
  relationship?: string
  contributor_company?: string
  written_note?: string
  owner_id?: string
}

export function dedupeContributions<T extends ContributionLike>(contributions: T[], profileOwnerName: string): T[] {
  const seen = new Set<string>()
  const deduped: T[] = []

  contributions.forEach((contribution) => {
    // Create unique key for deduplication based on content and contributor
    const normalizedQuote = contribution.written_note?.toLowerCase().trim().replace(/\s+/g, " ") || ""
    const uniqueKey = `${contribution.contributor_name}|${contribution.relationship}|${contribution.contributor_company}|${normalizedQuote}`

    if (seen.has(uniqueKey)) {
      console.log("[v0] Excluded duplicate contribution:", contribution.id)
      return
    }

    seen.add(uniqueKey)
    deduped.push(contribution)
  })

  return deduped
}
