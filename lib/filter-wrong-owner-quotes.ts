import type { Contribution } from "@/types"

export function filterWrongOwnerQuotes(contributions: Contribution[], ownerFullName: string): Contribution[] {
  const ownerFirstName = ownerFullName.split(" ")[0]?.toLowerCase()
  if (!ownerFirstName) return contributions

  const commonFirstNames = new Set([
    "john",
    "jane",
    "michael",
    "sarah",
    "david",
    "emily",
    "chris",
    "jessica",
    "daniel",
    "ashley",
    "stephanie",
    "maya",
    "alex",
    "sam",
    "jordan",
    "taylor",
    "morgan",
    "casey",
    "riley",
    "avery",
  ])

  return contributions.filter((contrib) => {
    const text = contrib.written_note?.toLowerCase() || ""

    // Check if quote mentions owner's name - if so, it's valid
    if (text.includes(ownerFirstName) || text.includes(ownerFullName.toLowerCase())) {
      return true
    }

    // Check if quote mentions any other common first name
    for (const name of commonFirstNames) {
      if (
        (name !== ownerFirstName && text.includes(` ${name} `)) ||
        text.includes(`"${name}"`) ||
        text.includes(`'${name}'`)
      ) {
        console.warn(`[v0] Filtering quote ${contrib.id} - mentions "${name}" instead of "${ownerFirstName}"`)
        return false
      }
    }

    // If no names mentioned, include it
    return true
  })
}
