// Generate experiential pattern statements from verified testimonials
// These reflect repeated experiences, not praise adjectives

export function generatePatternStatements(contributions: any[]): string[] {
  const statements: string[] = []
  const seenThemes = new Set<string>()

  // Extract experiential patterns from testimonials
  contributions.forEach((contribution) => {
    const note = contribution.written_note?.toLowerCase() || ""

    // Pattern: Communication quality
    if (
      (note.includes("clear") && note.includes("communicat")) ||
      (note.includes("transparent") && note.includes("updat"))
    ) {
      if (!seenThemes.has("communication")) {
        statements.push("Clear communication, even when priorities shift")
        seenThemes.add("communication")
      }
    }

    // Pattern: Follow-through
    if (
      note.includes("follow through") ||
      note.includes("follow-through") ||
      (note.includes("deliver") && note.includes("promise"))
    ) {
      if (!seenThemes.has("followthrough")) {
        statements.push("Follow-through people don't have to chase")
        seenThemes.add("followthrough")
      }
    }

    // Pattern: Execution
    if (
      (note.includes("idea") && note.includes("execut")) ||
      (note.includes("turn") && note.includes("action")) ||
      (note.includes("finish") && note.includes("work"))
    ) {
      if (!seenThemes.has("execution")) {
        statements.push("Ideas consistently turn into finished work")
        seenThemes.add("execution")
      }
    }

    // Pattern: Calm under pressure
    if (
      (note.includes("calm") && note.includes("pressure")) ||
      (note.includes("steady") && note.includes("deadline")) ||
      (note.includes("composed") && note.includes("stress"))
    ) {
      if (!seenThemes.has("pressure")) {
        statements.push("Calm collaboration under pressure")
        seenThemes.add("pressure")
      }
    }

    // Pattern: Strategic thinking
    if (
      (note.includes("strategic") && note.includes("think")) ||
      (note.includes("big picture") && note.includes("detail"))
    ) {
      if (!seenThemes.has("strategic")) {
        statements.push("Strategic thinking that connects to real outcomes")
        seenThemes.add("strategic")
      }
    }

    // Pattern: Adaptability
    if ((note.includes("adapt") && note.includes("chang")) || (note.includes("flexible") && note.includes("pivot"))) {
      if (!seenThemes.has("adapt")) {
        statements.push("Adapts quickly when circumstances change")
        seenThemes.add("adapt")
      }
    }

    // Pattern: Ownership
    if (note.includes("ownership") || (note.includes("accountab") && note.includes("deliver"))) {
      if (!seenThemes.has("ownership")) {
        statements.push("Takes ownership without being asked")
        seenThemes.add("ownership")
      }
    }

    // Pattern: Collaboration quality
    if (
      (note.includes("collaborat") && note.includes("easy")) ||
      (note.includes("work with") && note.includes("pleasure"))
    ) {
      if (!seenThemes.has("collab")) {
        statements.push("Makes collaboration feel effortless")
        seenThemes.add("collab")
      }
    }
  })

  // Fallback statements if none detected
  if (statements.length === 0) {
    statements.push("Consistent quality across different projects")
    statements.push("Reliable collaboration that delivers results")
    statements.push("Work that speaks for itself")
  }

  return statements.slice(0, 5) // Return max 5 unique patterns
}
